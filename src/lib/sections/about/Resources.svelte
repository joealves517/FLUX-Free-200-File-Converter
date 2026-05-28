<script lang="ts">
	import Panel from "$lib/components/visual/Panel.svelte";
	import { LinkIcon } from "lucide-svelte";
	import { m } from "$lib/paraglide/messages";
	import SupportSheet from "$lib/components/functional/SupportSheet.svelte";

	const privacyUrl = typeof chrome !== "undefined" && chrome.runtime
		? chrome.runtime.getURL("vert.html#/privacy/")
		: "#/privacy/";

	let showSupport = $state(false);

	function openPrivacyTab(e: MouseEvent) {
		e.preventDefault();
		if (typeof chrome !== "undefined" && chrome.tabs) {
			chrome.tabs.create({ url: chrome.runtime.getURL("vert.html#/privacy/") });
		} else {
			window.open("#/privacy/", "_blank");
		}
	}

	const rawNote = $derived(m["about.resources.privacy_note"]());
	
	// Dynamic parsing for both [privacy_link] and [support_link] tags
	interface ParsedPart {
		text: string;
		type: "text" | "privacy" | "support";
	}

	const parsedParts = $derived.by<ParsedPart[]>(() => {
		const text = rawNote;
		const parts: ParsedPart[] = [];
		const regex = /\[(privacy_link|support_link)\](.*?)\[\/\1\]/g;
		let match;
		let lastIndex = 0;

		while ((match = regex.exec(text)) !== null) {
			const matchIndex = match.index;
			if (matchIndex > lastIndex) {
				parts.push({
					text: text.slice(lastIndex, matchIndex),
					type: "text",
				});
			}
			parts.push({
				text: match[2],
				type: match[1] === "privacy_link" ? "privacy" : "support",
			});
			lastIndex = regex.lastIndex;
		}

		if (lastIndex < text.length) {
			parts.push({
				text: text.slice(lastIndex),
				type: "text",
			});
		}

		return parts.length > 0 ? parts : [{ text, type: "text" }];
	});
</script>

<Panel class="flex flex-col gap-4 p-6">
	<h2 class="text-2xl font-bold flex items-center">
		<div
			class="rounded-full glass-icon-purple p-2 inline-block mr-3 w-10 h-10"
		>
			<LinkIcon />
		</div>
		{m["about.resources.title"]()}
	</h2>

	<div class="text-base text-muted dynadark:text-muted font-normal">
		<p class="leading-relaxed">
			{#each parsedParts as part}
				{#if part.type === "text"}
					{part.text}
				{:else if part.type === "privacy"}
					<a
						href={privacyUrl}
						onclick={openPrivacyTab}
						class="text-accent-purple hover:underline font-semibold"
					>
						{part.text}
					</a>
				{:else if part.type === "support"}
					<a
						href="#support"
						onclick={(e) => {
							e.preventDefault();
							showSupport = true;
						}}
						class="text-accent-purple hover:underline font-semibold"
					>
						{part.text}
					</a>
				{/if}
			{/each}
		</p>
	</div>
</Panel>

<SupportSheet bind:open={showSupport} onClose={() => { showSupport = false; }} />

