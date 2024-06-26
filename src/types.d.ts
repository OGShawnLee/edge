import type { Post as EPost, User as EUser, Notification as ENotification } from "edge/interfaces";

type Notification = Omit<ENotification, "receiver"> & {
	post?: Pick<PPost, "text">;
	sender: Pick<User, "display_name" | "name">;
};

type Post = Omit<EPost, "user">;

type User = Pick<EUser, "display_name" | "id" | "name">;

type CardUser = Pick<EUser, "display_name" | "id" | "name" | "description" | "is_followed">;

interface FormItemError {
	issue?: string;
	value?: string;
}

type NavTypes = "mobile-nav" | "tab";

interface JWTPayloadState {
	id: string;
	display_name: string;
	name: string;
}
