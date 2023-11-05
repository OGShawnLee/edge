<script lang="ts">
	import { applyAction, deserialize } from "$app/forms";
	import { Input } from "$lib/components";
	import { toast } from "$lib/state";

	export let form;

	async function handle_sign_in(this: HTMLFormElement) {
		const response = await fetch(this.action, {
			method: this.method,
			body: new FormData(this)
		});

		const result = deserialize(await response.text());

		if (result.type === "failure" && result.data?.issue) {
			toast.push({
				type: "error",
				message: result.data.issue as string
			});
		} else if (result.type === "redirect") {
			return applyAction(result);
		}

		form = result?.data;
	}
</script>

<svelte:head>
	<title>Sign in - Edge | X</title>
</svelte:head>

<main class="w-full max-w-md p-8 | grid gap-12 | bg-dialog-color/30 lg:(max-w-4xl grid-cols-12)">
	<!-- Form - Right -->
	<div class="grid gap-7.5 | w-full | md:col-span-6 lg:(order-2)">
		<div class="grid gap-12">
			<div class="flex items-center gap-1.5 | md:hidden">
				<a class="w-fit uppercase text-3xl text-top-color font-bold tracking-1" href="/">
					Edge | X
				</a>
			</div>
			<header>
				<h1 class="text-2xl text-white font-medium font-bold">Sign in</h1>
				<p class="text-sm">
					Dont have an account?
					<a class="text-aqua-50 hover:underline" href="/auth/sign-up"> Sign up! </a>
				</p>
			</header>
		</div>
		<form class="grid gap-6" method="post" on:submit|preventDefault={handle_sign_in}>
			<div class="grid gap-4.5">
				<Input
					id="display-name"
					label="username"
					minlength={4}
					maxlength={16}
					placeholder="OGJohnDoe"
					error={form?.display_name}
				/>
				<Input id="password" minlength={8} maxlength={80} type="password" error={form?.password} />
			</div>
			<button class="button button--top" type="submit"> Continue </button>
		</form>
	</div>
	<!-- Banner - Left -->
	<div
		class="p-8 | flex flex-col justify-between gap-9 rounded-xl overflow-hidden md:col-span-6 lg:order-1"
		data-element="banner-left"
	>
		<div class="grid gap-9">
			<a class="w-fit uppercase text-xl text-top-color font-bold tracking-1 md:text-2xl" href="/">
				Edge | X
			</a>
			<div class="grid gap-2.75">
				<p class="uppercase text-xl text-white font-semibold">
					Create an account and join a community of users from all over the world.
				</p>
				<p class="uppercase text-xl text-white font-semibold">
					Post, like, comment, and share, all in one place.
				</p>
			</div>
		</div>
		<div class="flex items-center gap-1.5 | not-sr-only" aria-hidden>
			<a
				href="https://www.artstation.com/artwork/nQmdEX"
				target="_blank"
				title="View Original Image"
			>
				<i class="bx bx-palette | text-xl hover:text-white" />
				<span class="sr-only">View Original Image</span>
			</a>
			<a
				class="text-sm hover:text-aqua-50"
				href="https://www.artstation.com/mchahin"
				target="_blank"
				title="View Image Author"
			>
				Mohamed Chahin
			</a>
		</div>
	</div>
</main>

<!-- <script lang="ts">
	import Input from "../Input.svelte";
	import { AtSign, Key } from "lucide-svelte";
	import { use_catch } from "$lib/hooks";
	import { parse } from "valibot";
	import { tick } from "svelte";
	import { display_name_schema, password_schema } from "$lib/valibot";
	import { applyAction, deserialize } from "$app/forms";

	export let form;

	$: already_filled = form !== null;
	let current_step = 0;
	let display_name = form?.display_name?.value ?? "";
	let display_name_element: HTMLInputElement;
	let password = "";
	let password_element: HTMLInputElement;

	async function handle_display_name() {
		const result = use_catch(() => parse(display_name_schema, display_name));
		if (result.failed || current_step !== 0) return;
		current_step = 1;
		await tick();
		password_element.focus();
	}

	async function handle_password() {
		const result = use_catch(() => parse(password_schema, password));
		if (result.failed || current_step !== 3) return;
	}

	async function handle_submit(this: HTMLFormElement) {
		const response = await fetch(this.action, {
			body: new FormData(this),
			method: this.method
		});
		const result = deserialize(await response.text());
		if (result.type === "failure" && result.data) {
			// @ts-ignore
			form = result.data;
		}

		if (result.type === "redirect") {
			applyAction(result);
		}
	}
</script>

<svelte:head>
	<title>Accesing - Edge</title>
</svelte:head>

<div class="max-w-4xl h-screen mx-auto | flex items-center justify-center">
	<main class="w-full max-w-lg">
		<header class="mb-9">
			<h1 class="text-3xl text-top-color font-bold">Accesing Edge</h1>
			<a
				class="text-14px text-screen-name-color outline-none focus:(underline text-top-color) hover:(underline text-top-color)"
				href="/auth/sign-up"
			>
				Dont have an account?
			</a>
		</header>
		<form class="mx-auto max-w-2xl | grid gap-6" method="post" on:submit|preventDefault={handle_submit}>
			<Input
				label="What is your username?"
				id="display-name"
				placeholder="OGAlexandra"
				icon={AtSign}
				on:click={handle_display_name}
				bind:element={display_name_element}
				bind:value={display_name}
				error={form?.display_name}
				{current_step}
				{already_filled}
				step={0}
			/>
			<Input
				label="What is your password?"
				id="password"
				submit
				icon={Key}
				on:click={handle_password}
				bind:element={password_element}
				bind:value={password}
				error={form?.password}
				{current_step}
				{already_filled}
				step={1}
				button_text="continue"
			/>
		</form>
	</main>
</div> -->

<style>
	div[data-element="banner-left"] {
		position: relative;
	}

	div[data-element="banner-left"]::after {
		content: "";
		position: absolute;
		inset: 0;
		background: bottom
			url("https://i.pinimg.com/564x/eb/56/95/eb56959fa18991a000a48d84a040afd2.jpg");
		-webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
		filter: grayscale(100%);
		background-size: cover;
		opacity: 0.25;
		z-index: -10;
	}
</style>
