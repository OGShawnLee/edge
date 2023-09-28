// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { JWTPayloadState } from "@types";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: null | JWTPayloadState;
		}
		interface PageData {
			user: null | JWTPayloadState;
		}
		// interface Platform {}
	}
}

export {};
