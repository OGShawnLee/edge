import { email, maxLength, minLength, object, optional, string, toCustom } from "valibot";

export const display_name_schema = string([minLength(1), maxLength(16)]);
export const name_schema = string([minLength(1), maxLength(50)]);
export const email_schema = string([email(), maxLength(256)]);
export const password_schema = string([minLength(8), maxLength(256)]);

export const post_schema = string([
	toCustom((input) => {
		// Normalize newline characters from \r\n to \n
		// This is necessary because the textarea element in HTML uses \r\n
		return input.replace(/\r\n/g, "\n");
	}),
	maxLength(280), 
	minLength(1)
]);

export const user_schema = object({
	display_name: display_name_schema,
	name: name_schema,
	description: optional(string([maxLength(175)])),
	location: optional(string([maxLength(30)])),
	email: email_schema,
	password: password_schema
});
