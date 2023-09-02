import { isNullish } from 'malachite-ui/predicate'

export interface HTMLExpandableTextArea extends HTMLTextAreaElement {
  baseScrollHeight: number;
}

// Yair Evan Or https://codepen.io/vsync/pen/bGgQzL
// I have no idea how this works, why it works and why my modifications fixed bugs
export function handle_expandable_area(event: Event) {
	const element = event.target as HTMLExpandableTextArea
  if (element.value.length >= element.maxLength - 4) return;

	const minimum = element.getAttribute("data-minimum-rows");
	const final_minimum = minimum ? +minimum : 3;
	let rows: number;

	if (isNullish(element.baseScrollHeight)) set_scroll_height(element);

	element.rows = final_minimum;
	rows = Math.ceil((element.scrollHeight - element.baseScrollHeight) / 28);
	element.rows = final_minimum + rows;
}

function set_scroll_height(element: HTMLExpandableTextArea) {
	const value = element.value;
	element.value = "";
	element.baseScrollHeight = element.scrollHeight;
	element.value = value;
}