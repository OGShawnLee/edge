import type { Post as EPost, User as EUser, Notification as ENotification } from "edge/interfaces";

type Notification = Omit<ENotification, "receiver"> & {
	post?: Pick<Post, "text">;
	sender: User;
};

type Post = Omit<EPost, "user">;

type User = Pick<EUser, "display_name" | "id" | "name">;

type CardUser = Pick<EUser, "display_name" | "id" | "name" | "description" | "is_followed">;

interface FormItemError {
	issue?: string;
	value?: string;
}

interface JWTPayloadState {
	id: string;
	avatar: string;
	display_name: string;
	name: string;
}
