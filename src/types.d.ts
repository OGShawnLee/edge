import type { Post as EPost, User as EUser } from "edge/interfaces";

type Post = Omit<EPost, "user">;

type User = Pick<EUser, "display_name" | "id" | "name">

interface FormItemError {
	issue?: string;
	value?: string;
}

interface JWTPayloadState {
	id: string;
	display_name: string;
	name: string;
}
