import { useWindowListener } from "malachite-ui/hooks";
import { isNullish } from "malachite-ui/predicate";
import { tick } from "svelte";

export interface HTMLExpandableTextArea extends HTMLTextAreaElement {
	baseScrollHeight: number;
}

// Yair Evan Or https://codepen.io/vsync/pen/bGgQzL
// I have no idea how this works, why it works and why my modifications fixed bugs
export function handle_expandable_area(event: Event) {
	const element = event.target as HTMLExpandableTextArea;
	if (element.value.length >= element.maxLength - 4) return;

	const minimum = element.getAttribute("data-minimum-rows");
	const final_minimum = minimum ? +minimum : 3;
	let rows: number;

	if (isNullish(element.baseScrollHeight)) set_scroll_height(element);

	element.rows = final_minimum;
	rows = Math.ceil((element.scrollHeight - element.baseScrollHeight) / 28);
	element.rows = final_minimum + rows;
}

function get_page_height() {
	return document.body.scrollHeight - document.body.clientHeight
}

// this took a gazillion hours to get right
export function move_on_scroll_down(
	element: HTMLElement,
	settings: {
		offset?: number;
		position?: "top" | "bottom";
		static?: boolean;
		translate_class_name?: string;
	}
) {
	if (settings?.static) return;

	const box = element.getBoundingClientRect();
	// offset is the number of pixels the user has to scroll up before the element is revealed
	const offset = settings.offset || 0;
	const translate_class_name = settings.translate_class_name || "-translate-y-full";
	const position = settings.position || "top";

	// safe_zone is meant to prevent leaving a huge gap at the top/bottom of the page
	// if the user hasnt scrolled past the safe zone we dont want to hide the element
	let safe_zone = box.height;

	// meant to hide both the header and the tab at the same time
	tick().then(() => {
		// ensure tab is already mounted
		const tab = document.getElementById("tab");
		if (tab === element) {
			const header = document.getElementById("header");
			safe_zone += header?.getBoundingClientRect().height || 0;
		} else if (tab && tab.classList.contains("sticky")) {
			safe_zone += tab.getBoundingClientRect().height;
		}
	});

	let previous_y = window.scrollY;

	// make sure all the classNames here are in the safelist in uno.config.ts
	element.classList.add("transition", "transform", "ease-in", "duration-150", "sm:transform-none");
	return {
		destroy: useWindowListener("scroll", () => {
			const current_y = window.scrollY;

			// fix a bug where the element is hidden when the page loads
			if (window.scrollY === 0) {
				return element.classList.remove(translate_class_name);
			};

			if (position === "bottom") {
				// ? maybe we can do this with an intersection observer?
				// we have to recompute the safe zone because the page height might have changed
				if (current_y > previous_y) {
					// only recalculate safe_zone if user is scrolling down
					safe_zone = get_page_height() - box.height;
				}

				// if the user has scrolled into the safe zone we show the element
				if (window.scrollY >= safe_zone) {
					return element.classList.remove(translate_class_name);
				}
			} else if (position === "top" && window.scrollY <= safe_zone) {
				return element.classList.remove(translate_class_name);
			}

			if (current_y > previous_y) {
				element.classList.add(translate_class_name);
			} else if (current_y < previous_y - offset) {
				element.classList.remove(translate_class_name);
			}

			previous_y = current_y;
		})
	};
}

export function hide_scrollbar() {
	const initial_overflow = document.body.style.overflow;
	document.body.style.overflow = "hidden";
	return {
		destroy: () => {
			document.body.style.overflow = initial_overflow;
		}
	};
}

function set_scroll_height(element: HTMLExpandableTextArea) {
	const value = element.value;
	element.value = "";
	element.baseScrollHeight = element.scrollHeight;
	element.value = value;
}
