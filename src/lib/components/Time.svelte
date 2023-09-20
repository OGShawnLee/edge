<script lang="ts" context="module">
	// https://natclark.com/tutorials/javascript-relative-time/
	function get_relative_time(date: Date) {
		const current = new Date().getTime();
		const current_seconds = Math.floor(current / 1000);
		const old = date.getTime();
		const old_seconds = Math.floor(old / 1000);
		const difference = current_seconds - old_seconds;

		if (difference < 60) {
			return get_time_string(difference, "second");
		} else if (difference < 3600) {
			// Less than an hour has passed:
			return get_time_string(Math.floor(difference / 60), "minute");
		} else if (difference < 86400) {
			// Less than a day has passed:
			return get_time_string(Math.floor(difference / 3600), "hour");
		} else if (difference < 2620800) {
			// Less than a month has passed:
			return get_time_string(Math.floor(difference / 86400), "day");
		} else if (difference < 31449600) {
			// Less than a year has passed:
			return get_time_string(Math.floor(difference / 2620800), "month");
		} else {
			// More than a year has passed:
			return get_time_string(Math.floor(difference / 31449600), "year");
		}
	}

	function get_time_string(amount: number, word: string) {
		return `${amount} ${plural(amount, word)} ago`;
	}

	function plural(count: number, word: string) {
		return count === 1 ? word : word + "s";
	}
</script>

<script lang="ts">
	export let created_at: Date;
</script>

<time class="ml-12px | text-12px text-datetime-color" datetime={created_at.toISOString()}>
	{get_relative_time(created_at)}
</time>
