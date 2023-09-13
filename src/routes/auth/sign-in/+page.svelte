<script lang="ts">
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
</div>
