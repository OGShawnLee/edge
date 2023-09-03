<script>
	import { Input } from "$lib/components";
	import { AtSign, Key } from "lucide-svelte";

	export let form;
</script>

<svelte:head>
	<title>Edge - Sign in</title>
</svelte:head>

<div class="grid gap-4.5">
	<header class="px-8 pb-4 | border-b-2 border-zinc-800">
		<h1 class="text-3xl text-white font-semibold">Join <b>Edge</b></h1>
		<p class="text-sm">
			Don't have an account?
			<a
				class="text-sky-400 font-medium outline-none focus:underline hover:text-sky-300"
				href="/auth/sign-up"
			>
				Sign up!
			</a>
		</p>
	</header>
	<form class="px-8 | grid gap-6" method="post">
		<Input
			id="display-name"
			label="Username"
			icon={AtSign}
			placeholder="OGJohnDoe"
			minlength={1}
			maxlength={16}
			error={form?.display_name}
		/>
		<Input
			id="password"
			icon={Key}
			type="password"
			minlength={8}
			maxlength={256}
			error={form?.password}
		/>
		<button
			class="min-h-10 w-full | bg-sky-600 rounded-xl text-white font-bold outline-none black-ring-white"
			type="submit"
		>
			Continue
		</button>
	</form>
</div>
