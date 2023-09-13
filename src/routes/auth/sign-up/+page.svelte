<script lang="ts">
	import Input from "../Input.svelte";
	import { AtSign, Key, Mail, UserCircle } from "lucide-svelte";
	import { use_catch } from "$lib/hooks";
	import { parse } from "valibot";
	import { tick } from "svelte";
	import { display_name_schema, email_schema, name_schema, password_schema } from "$lib/valibot";
	import { applyAction, deserialize } from "$app/forms";

	export let form;

	$: already_filled = form !== null;
	let current_step = 0;
	let name = form?.name?.value ?? "";
	let name_element: HTMLInputElement;
	let display_name = form?.display_name?.value ?? "";
	let display_name_element: HTMLInputElement;
	let email = form?.email?.value ?? "";
	let email_element: HTMLInputElement;
	let password = "";
	let password_element: HTMLInputElement;

	async function handle_name() {
		const result = use_catch(() => parse(name_schema, name));
		if (result.failed) {
			return name_element.focus();
		}

		if (current_step !== 0) return;
		current_step = 1;
		await tick();
		display_name_element.focus();
	}

	async function handle_display_name() {
		const result = use_catch(() => parse(display_name_schema, display_name));
		if (result.failed) {
			return display_name_element.focus();
		}

		if (current_step !== 1) return;
		current_step = 2;
		await tick();
		email_element.focus();
	}

	async function handle_email() {
		const result = use_catch(() => parse(email_schema, email));
		if (result.failed) {
			return email_element.focus();
		}

		if (current_step !== 2) return;
		current_step = 3;
		await tick();
		password_element.focus();
	}

	async function handle_password() {
		const result = use_catch(() => parse(password_schema, password));
		if (result.failed) {
			return password_element.focus();
		}

		if (current_step !== 3) return;
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
	<title>Joining - Edge</title>
</svelte:head>

<div class="max-w-4xl h-screen mx-auto | flex items-center justify-center">
	<main class="w-full max-w-lg">
		<header class="mb-9">
			<h1 class="text-3xl text-top-color font-bold">Joining Edge</h1>
			<a
				class="text-14px text-screen-name-color outline-none focus:(underline text-top-color) hover:(underline text-top-color)"
				href="/auth/sign-in"
			>
				Already have an account?
			</a>
		</header>
		<form
			class="mx-auto max-w-2xl | grid gap-6"
			method="post"
			on:submit|preventDefault={handle_submit}
		>
			<Input
				label="What is your name?"
				id="name"
				placeholder="Alexandra Isabella"
				icon={UserCircle}
				on:click={handle_name}
				bind:element={name_element}
				bind:value={name}
				{current_step}
				error={form?.name}
				step={0}
				{already_filled}
			/>
			<Input
				label="What username would you like to own?"
				id="display-name"
				placeholder="OGAlexandra"
				icon={AtSign}
				on:click={handle_display_name}
				bind:element={display_name_element}
				bind:value={display_name}
				{current_step}
				error={form?.display_name}
				step={1}
				{already_filled}
			/>
			<Input
				label="What is your email?"
				id="email"
				placeholder="OGAlexandra@gmail.com"
				icon={Mail}
				on:click={handle_email}
				bind:element={email_element}
				bind:value={email}
				{current_step}
				error={form?.email}
				step={2}
				{already_filled}
			/>
			<Input
				label="What will be your password?"
				id="password"
				icon={Key}
				on:click={handle_password}
				bind:element={password_element}
				bind:value={password}
				{current_step}
				error={form?.password}
				step={3}
				{already_filled}
				submit
				button_text="continue"
			/>
		</form>
	</main>
</div>
