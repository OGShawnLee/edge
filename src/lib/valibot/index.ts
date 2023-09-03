import { email, maxLength, minLength, object, optional, string } from "valibot";

export const user_schema = object({
	display_name: string([minLength(1), maxLength(16)]),
	name: string([minLength(1), maxLength(50)]),
	description: optional(string([maxLength(175)])),
	location: optional(string([maxLength(30)])),
	email: string([email(), maxLength(256)]),
	password: string([minLength(8), maxLength(256)])
});
