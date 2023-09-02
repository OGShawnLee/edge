import * as v from 'valibot'

export const user_schema = v.object({
  display_name: v.string([
    v.minLength(1),
    v.maxLength(16),
  ]),
  name: v.string([
    v.minLength(1),
    v.maxLength(50),
  ]),
  email: v.string([
    v.email(),
    v.maxLength(256)
  ]),
  password: v.string([
    v.minLength(8),
    v.maxLength(256),
  ])
})