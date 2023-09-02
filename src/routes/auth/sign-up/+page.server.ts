import type { Issues } from 'valibot'
import e from 'edge/edgeql-js'
import { ConstraintViolationError } from 'edgedb'
import { user_schema } from '$lib/valibot'
import { parse, flatten } from 'valibot'
import { use_await, use_catch } from '$lib/hooks'
import { error, fail, redirect } from '@sveltejs/kit'
import { get_client } from '$lib/server/client'
import { genSalt, hash } from 'bcrypt'

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const name = data.get("name")
    const display_name = data.get("display-name")
    const email = data.get("email")
    const password = data.get("password")

    const user = use_catch(() => {
      return parse(user_schema, { name, display_name, email, password });
    })
    if (user.failed) {
      const issues = flatten(user.error as Issues).nested;
      return fail(400, {
        name: { issue: issues.name?.[0] },
        display_name: { issue: issues.display_name?.[0] },
        email: { issue: issues.email?.[0] },
        password: { issue: issues.password?.[0] },
      })
    }

    const password_hash = await create_password_hash(user.data.password)
    if (password_hash.failed) return fail(500)
    user.data.password = password_hash.data

    const client = get_client()
    const result = await use_await(() => {
      return e.insert(e.User, user.data).run(client);
    })
    if (result.failed) {
      const err = result.error

      if (err instanceof ConstraintViolationError) {
        if (err.message.includes("display_name")) {
          return fail(400, {
            name: { value: user.data.name },
            display_name: {
              issue: "Username already taken.",
              value: user.data.display_name
            },
            email: { value: user.data.email }
          })
        } else if (err.message.includes("email")) {
          return fail(400, {
            name: { value: user.data.name },
            display_name: { value: user.data.display_name },
            email: { issue: "Email already taken.", value: user.data.email }
          })
        }
      }

      throw error(500, { message: "Unable to create user." })
    }

    throw redirect(303, "/auth/sign-in")
  }
}

function create_password_hash(password: string) {
  return use_await(async () => {
    return hash(password, await genSalt());
  });
}