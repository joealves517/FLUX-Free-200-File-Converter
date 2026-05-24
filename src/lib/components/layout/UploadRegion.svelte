<script lang="ts">
	import { duration, fade } from "$lib/util/animation";
	import { dropping, effects } from "$lib/store/index.svelte";
	import { quintOut } from "svelte/easing";
</script>

{#if $dropping}
	<div
		class="fixed w-screen h-screen opacity-40 dynadark:opacity-20 z-[100] pointer-events-none blur-2xl {$effects
			? 'dragoverlay'
			: 'glass-icon-blue'}"
		class:_dragover={dropping && $effects}
		transition:fade={{
			duration,
			easing: quintOut,
		}}
	></div>
{/if}

<style lang="postcss">
	.dragoverlay {
		animation: dragoverlay-animation 3s infinite linear;
	}

	@keyframes dragoverlay-animation {
		0% {
			@apply glass-icon-pink;
		}

		25% {
			@apply glass-icon-blue;
		}

		50% {
			@apply glass-icon-purple;
		}

		75% {
			@apply glass-icon-red;
		}

		100% {
			@apply glass-icon-pink;
		}
	}
</style>
