<script lang="ts" context="module">
	// https://natclark.com/tutorials/javascript-relative-time/
	function get_relative_time(date: Date, is_mobile: boolean) {
		const current = new Date().getTime();
		const current_seconds = Math.floor(current / 1000);
		const old = date.getTime();
		const old_seconds = Math.floor(old / 1000);
		const difference = current_seconds - old_seconds;

		if (difference < 60) {
			return get_time_string(difference, "second", is_mobile);
		} else if (difference < 3600) {
			// Less than an hour has passed:
			return get_time_string(Math.floor(difference / 60), "minute", is_mobile);
		} else if (difference < 86400) {
			// Less than a day has passed:
			return get_time_string(Math.floor(difference / 3600), "hour", is_mobile);
		} else if (difference < 2620800) {
			// Less than a month has passed:
			return get_time_string(Math.floor(difference / 86400), "day", is_mobile);
		} else if (difference < 31449600) {
			// Less than a year has passed:
			return get_time_string(Math.floor(difference / 2620800), "month", is_mobile);
		} else {
			// More than a year has passed:
			return get_time_string(Math.floor(difference / 31449600), "year", is_mobile);
		}
	}

	function get_time_string(amount: number, word: string, is_mobile: boolean) {
		if (is_mobile) return `${amount}${word[0]}`;
		return `${amount} ${plural(amount, word)} ago`;
	}

	function plural(count: number, word: string) {
		return count === 1 ? word : word + "s";
	}
</script>

<script lang="ts">
	export let created_at: Date;
	export let type: "post" | "post-page" | "user-info";
</script>

{#if type === "user-info"}
	{@const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" })}
	<time class="text-12px" datetime={created_at.toISOString()}>
		Joined {formatter.format(created_at)}
	</time>
{:else if type === "post-page"}
	{@const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "medium" })}
	<time class="text-14px text-screen-name-color" datetime={created_at.toISOString()}>
		{formatter.format(created_at)}
	</time>
{:else if type === "post"}
	<time class="ml-12px | text-12px text-datetime-color" datetime={created_at.toISOString()}>
		<span class="hidden md:inline">{get_relative_time(created_at, false)}</span>
		<span class="md:hidden">{get_relative_time(created_at, true)}</span>
	</time>
{/if}
