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
			@apply bg-pink-500 text-white shadow-sm border border-black/5;
		}

		25% {
			@apply bg-blue-500 text-white shadow-sm border border-black/5;
		}

		50% {
			@apply bg-purple-500 text-white shadow-sm border border-black/5;
		}

		75% {
			@apply bg-red-500 text-white shadow-sm border border-black/5;
		}

		100% {
			@apply bg-pink-500 text-white shadow-sm border border-black/5;
		}
	}
</style>
