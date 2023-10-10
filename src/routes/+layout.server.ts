import { PINNED_POST_COOKIE } from "$env/static/private";

export function load(event) {
	return {
		user: event.locals.user,
		pinned_post_id: event.cookies.get(PINNED_POST_COOKIE)
	};
}
