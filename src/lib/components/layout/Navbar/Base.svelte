<script lang="ts">
	const browser = typeof window !== "undefined";
	import { page, goto } from "$lib/util/router.svelte";
	import { duration, fade } from "$lib/util/animation";
	import {
		effects,
		files,
		goingLeft,
		setTheme,
	} from "$lib/store/index.svelte";
	import clsx from "clsx";
	import {
		InfoIcon,
		MoonIcon,
		RefreshCw,
		SettingsIcon,
		SunIcon,
		UploadIcon,
		type Icon as IconType,
	} from "lucide-svelte";
	import { quintOut } from "svelte/easing";
	import Panel from "../../visual/Panel.svelte";
	import Logo from "../../visual/svg/Logo.svelte";
	// goto imported from router above
	import Tooltip from "$lib/components/visual/Tooltip.svelte";
	import { m } from "$lib/paraglide/messages";

	const items = $derived<
		{
			name: string;
			url: string;
			activeMatch: (pathname: string) => boolean;
			icon: typeof IconType;
			badge?: number;
		}[]
	>([
		{
			name: m["navbar.upload"](),
			url: "#/",
			activeMatch: (pathname) => pathname === "/",
			icon: UploadIcon,
		},
		{
			name: m["navbar.convert"](),
			url: "#/convert/",
			activeMatch: (pathname) =>
				pathname === "/convert/" || pathname === "/convert",
			icon: RefreshCw,
			badge: files.files.length,
		},
		{
			name: m["navbar.settings"](),
			url: "#/settings/",
			activeMatch: (pathname) => pathname.startsWith("/settings"),
			icon: SettingsIcon,
		},
		{
			name: m["navbar.about"](),
			url: "#/about/",
			activeMatch: (pathname) => pathname.startsWith("/about"),
			icon: InfoIcon,
		},
	]);

	let links = $state<HTMLAnchorElement[]>([]);
	let container = $state<HTMLDivElement>();
	let activeRect = $state({ left: 0, width: 0, height: 0, top: 0 });

	const selectedIndex = $derived(
		items.findIndex((i) => i.activeMatch(page.url.pathname)),
	);

	const isSecretPage = $derived(selectedIndex === -1);

	$effect(() => {
		// Explicitly read reactive dependencies synchronously so Svelte 5 tracks them
		const index = selectedIndex;
		const activeLink = links[index];
		const currentContainer = container;

		const updateRect = () => {
			if (index !== -1 && activeLink && currentContainer) {
				const linkR = activeLink.getBoundingClientRect();
				const contR = currentContainer.getBoundingClientRect();
				activeRect = {
					left: linkR.left - contR.left,
					width: linkR.width,
					height: linkR.height,
					top: linkR.top - contR.top
				};
			}
		};

		// Run layout updates in timeout to ensure DOM styles apply correctly
		const id = setTimeout(updateRect, 50);

		window.addEventListener("resize", updateRect);
		return () => {
			clearTimeout(id);
			window.removeEventListener("resize", updateRect);
		};
	});
</script>

{#snippet link(item: (typeof items)[0], index: number)}
	{@const Icon = item.icon}
	<a
		bind:this={links[index]}
		href={item.url}
		aria-label={item.name}
		class={clsx(
			"min-w-14 md:min-w-32 h-full relative z-10 rounded-full flex flex-1 items-center justify-center gap-3 overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95",
			{
				"bg-panel-highlight":
					item.activeMatch(page.url.pathname) && !browser,
			},
		)}
		draggable={false}
	>
		<div class="grid grid-rows-1 grid-cols-1">
			{#key item.name}
				<div
					class="w-full row-start-1 col-start-1 h-full flex items-center justify-center gap-3"
					in:fade={{
						duration,
						easing: quintOut,
					}}
					out:fade={{
						duration,
						easing: quintOut,
					}}
				>
					<div class="relative flex items-center justify-center">
						<Icon class="w-5 h-5 md:w-6 md:h-6" />
						{#if item.badge}
							<div
								class="absolute overflow-hidden grid grid-rows-1 grid-cols-1 -top-1 font-display -right-2 w-fit px-1.5 h-4 rounded-full bg-badge text-on-badge font-medium"
								style="font-size: 0.7rem;"
								transition:fade={{
									duration,
									easing: quintOut,
								}}
							>
								{#key item.badge}
									<div
										class="flex items-center justify-center w-full h-full col-start-1 row-start-1"
										in:fade={{
											duration,
											easing: quintOut,
										}}
										out:fade={{
											duration,
											easing: quintOut,
										}}
									>
										{item.badge}
									</div>
								{/key}
							</div>
						{/if}
					</div>
					<p
						class="font-medium hidden hyphens-auto break-all md:flex min-w-0"
					>
						{item.name}
					</p>
				</div>
			{/key}
		</div>
	</a>
{/snippet}

<div class="w-full flex justify-center px-1">
	<Panel class="max-w-[778px] w-full h-16 md:h-20 rounded-full !bg-white/80 !backdrop-blur-2xl border border-black/5 shadow-xl !p-0 overflow-hidden dynadark:!bg-black/60 dynadark:border-white/10 dynadark:shadow-2xl">
		<div bind:this={container} class="w-full h-full flex items-center gap-1.5 md:gap-3 p-1.5 md:p-3 relative">
			{#if activeRect.width > 0}
				<div
					class="absolute bg-black/5 border border-black/10 shadow-sm dynadark:bg-white/10 dynadark:border-white/20 dynadark:shadow-sm backdrop-blur-md rounded-full"
					style="width: {activeRect.width}px; height: {activeRect.height}px; top: {activeRect.top}px; left: {activeRect.left}px; opacity: {isSecretPage
						? 0
						: 1}; {$effects
						? `transition: left var(--transition) ${duration}ms, top var(--transition) ${duration}ms, width var(--transition) ${duration}ms, height var(--transition) ${duration}ms, opacity var(--transition) ${duration}ms;`
						: ''}"
				></div>
			{/if}
			<a
				class="w-20 h-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-full items-center justify-center hidden md:flex transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
				href="/"
			>
				<div class="h-5 w-full">
					<Logo />
				</div>
			</a>
			{#each items as item, i (item.url)}
				{@render link(item, i)}
			{/each}
			<div class="w-0.5 bg-separator h-full hidden md:flex"></div>
			<Tooltip text={m["navbar.toggle_theme"]()} position="right">
				<button
					onclick={() => {
						const isDark =
							document.documentElement.classList.contains("dark");
						setTheme(isDark ? "light" : "dark");
					}}
					class="w-14 h-full items-center justify-center hidden md:flex"
				>
					<SunIcon class="dynadark:hidden block" />
					<MoonIcon class="dynadark:block hidden" />
				</button>
			</Tooltip>
		</div>
	</Panel>
</div>
