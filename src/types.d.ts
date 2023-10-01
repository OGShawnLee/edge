import type { Post as EPost, User as EUser, Notification as ENotification } from "edge/interfaces";

type Notification = Omit<ENotification, "receiver"> & {
	post?: Pick<Post, "text">;
	sender: User;
};

type Post = Omit<EPost, "user">;

type User = Pick<EUser, "display_name" | "id" | "name">;

interface FormItemError {
	issue?: string;
	value?: string;
}

interface JWTPayloadState {
	id: string;
	display_name: string;
	name: string;
}
