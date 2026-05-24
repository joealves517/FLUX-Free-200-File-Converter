<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$lib/util/router.svelte";

	const PUB_PLAUSIBLE_URL = "";
	const PUB_HOSTNAME = "flux.sh";
	import { DISABLE_ALL_EXTERNAL_REQUESTS, FLUX_NAME } from "$lib/util/consts.js";
	import * as Layout from "$lib/components/layout";
	import * as Navbar from "$lib/components/layout/Navbar";
	import featuredImage from "$lib/assets/FLUX_Feature.webp";
	import { Settings } from "$lib/sections/settings/index.svelte";
	import {
		files,
		isMobile,
		effects,
		theme,
		dropping,
		vertdLoaded,
		locale,
		updateLocale,
	} from "$lib/store/index.svelte";
	import "$lib/css/app.scss";
	const browser = typeof window !== "undefined";
	import { initStores as initAnimStores } from "$lib/util/animation.js";
	import { VertdInstance } from "$lib/sections/settings/vertdSettings.svelte.js";
	import { ToastManager } from "$lib/util/toast.svelte.js";
	import { m } from "$lib/paraglide/messages.js";
	import { log } from "$lib/util/logger.js";
	import Particles from "$lib/components/visual/Particles.svelte";

	let { children } = $props();
	let enablePlausible = $state(false);
	let isAprilFools = $state(false);

	let scrollPositions = new Map<string, number>();

	const dropFiles = async (e: DragEvent) => {
		e.preventDefault();
		dropping.set(false);
		const dt = e.dataTransfer;
		if (!dt) return;

		const oldLength = files.files.length;

		if (dt.files && dt.files.length > 0) {
			files.add(dt.files);
		} else {
			// Extract URL if dragging from another browser tab
			let url = "";
			
			// 1. Try to find an image in the dragged HTML (prevents getting the link href instead of image src)
			const htmlData = dt.getData("text/html");
			if (htmlData) {
				const match = htmlData.match(/<img[^>]+src="([^">]+)"/i);
				if (match && match[1]) {
					url = match[1].replace(/&amp;/g, '&');
				}
			}

			// 2. Fallback to URL or uri-list
			if (!url) {
				const uriList = dt.getData("URL") || dt.getData("text/uri-list");
				if (uriList) {
					url = uriList.split('\n').find((l: string) => l.startsWith('http') || l.startsWith('data:'))?.trim() || "";
				}
			}

			if (url && (url.startsWith("http") || url.startsWith("data:"))) {
				try {
					ToastManager.add({
						type: "info",
						message: "Fetching file from URL...",
					});
					const res = await fetch(url);
					if (!res.ok) throw new Error("Fetch failed");
					const blob = await res.blob();
					
					if (blob.type.startsWith("text/html")) {
						throw new Error("URL is a webpage, not a file");
					}

					let filename = url.split("/").pop()?.split("?")[0] || "";
					if (!filename || !filename.includes(".")) {
						filename = "downloaded_file" + (blob.type ? "." + blob.type.split("/")[1] : "");
					}
					
					const file = new File([blob], filename, { type: blob.type });
					files.add([file]);
				} catch (err) {
					const isHtml = err instanceof Error && err.message === "URL is a webpage, not a file";
					ToastManager.add({
						type: "error",
						message: isHtml 
							? "You dragged a link to a webpage, not a file/image." 
							: "Browser security (CORS) blocks direct drag from this site. Please save it to your computer first.",
					});
				}
			}
		}

		if (oldLength !== files.files.length) goto("/convert");
	};

	const handleDrag = (e: DragEvent, drag: boolean) => {
		e.preventDefault();
		dropping.set(drag);
	};

	const handlePaste = (e: ClipboardEvent) => {
		const clipboardData = e.clipboardData;
		if (!clipboardData || !clipboardData.files.length) return;
		e.preventDefault();
		const oldLength = files.files.length;
		files.add(clipboardData.files);
		if (oldLength !== files.files.length) goto("/convert");
	};

	onMount(() => {
		const now = new Date();
		isAprilFools = now.getDate() === 1 && now.getMonth() === 3;

		initAnimStores();

		const handleResize = () => {
			isMobile.set(window.innerWidth <= 768);
		};

		isMobile.set(window.innerWidth <= 768); // initial page load
		window.addEventListener("resize", handleResize); // handle window resize
		window.addEventListener("paste", handlePaste);

		effects.set(localStorage.getItem("effects") !== "false"); // defaults to true if not set
		theme.set(
			(localStorage.getItem("theme") as "light" | "dark") || "light",
		);
		const storedLocale = localStorage.getItem("locale");
		if (storedLocale) updateLocale(storedLocale);

		Settings.instance.load();

		if (!DISABLE_ALL_EXTERNAL_REQUESTS) {
			VertdInstance.instance
				.url()
				.then((u) => fetch(`${u}/api/version`))
				.then((res) => {
					if (res.ok) $vertdLoaded = true;
				})
				.catch((err) => {
					log(["layout"], `Failed to reach vertd instance: ${err}`);
				});
		}

		// detect if insecure context
		if (!window.isSecureContext) {
			log(["layout"], "Insecure context (HTTP) detected, some features may not work as expected -- you may want to enable \"PUB_DISABLE_FAILURE_BLOCKS\" on local deployments.");
			ToastManager.add({
				type: "warning",
				message: m["toast.insecure_context"](),
				disappearing: false,
			});
		}

		const processQueuedUrls = async (urls: string[]) => {
			if (!urls || urls.length === 0) return;
			// clear queue immediately
			chrome.storage.local.set({ queuedUrls: [] });
			
			for (const url of urls) {
				try {
					ToastManager.add({
						type: "info",
						message: "Fetching file from Context Menu...",
					});
					const res = await fetch(url);
					if (!res.ok) throw new Error("Fetch failed");
					const blob = await res.blob();
					
					if (blob.type.startsWith("text/html")) {
						throw new Error("URL is a webpage, not a file");
					}

					let filename = url.split("/").pop()?.split("?")[0] || "";
					if (!filename || !filename.includes(".")) {
						filename = "downloaded_file" + (blob.type ? "." + blob.type.split("/")[1] : "");
					}
					
					const file = new File([blob], filename, { type: blob.type });
					files.add([file]);
				} catch (err) {
					ToastManager.add({
						type: "error",
						message: "Failed to fetch file from Context Menu.",
					});
				}
			}
			goto("/convert");
		};

		if (typeof chrome !== 'undefined' && chrome.storage) {
			chrome.storage.local.get("queuedUrls", (data) => {
				if (data.queuedUrls && data.queuedUrls.length > 0) {
					processQueuedUrls(data.queuedUrls);
				}
			});

			chrome.storage.onChanged.addListener((changes, namespace) => {
				if (namespace === "local" && changes.queuedUrls && changes.queuedUrls.newValue) {
					processQueuedUrls(changes.queuedUrls.newValue);
				}
			});
		}

		return () => {
			window.removeEventListener("paste", handlePaste);
			window.removeEventListener("resize", handleResize);
		};
	});

	$effect(() => {
		enablePlausible =
			!!PUB_PLAUSIBLE_URL &&
			Settings.instance.settings.plausible &&
			!DISABLE_ALL_EXTERNAL_REQUESTS;
		if (!enablePlausible && browser) {
			// reset pushState on opt-out so that plausible stops firing events on page navigation
			history.pushState = History.prototype.pushState;
		}
	});
</script>

<svelte:head>
	<title>FLUX — Free 200+ File Converter</title>
	<meta name="theme-color" content="#F2ABEE" />
	<meta
		name="title"
		content="FLUX — Free 200+ File Converter"
	/>
	<meta
		name="description"
		content="With FLUX, you can quickly convert 200+ formats of images, videos, audio, and documents. No ads, no tracking, open source, and all processing (other than video) is done offline on your device."
	/>
	<meta property="og:url" content="https://flux.sh" />
	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="FLUX — Free 200+ File Converter"
	/>
	<meta
		property="og:description"
		content="With FLUX, you can quickly convert 200+ formats of images, videos, audio, and documents. No ads, no tracking, open source, and all processing (other than video) is done offline on your device."
	/>
	<meta property="og:image" content={featuredImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="flux.sh" />
	<meta property="twitter:url" content="https://flux.sh" />
	<meta
		property="twitter:title"
		content="FLUX — Free 200+ File Converter"
	/>
	<meta
		property="twitter:description"
		content="With FLUX, you can quickly convert 200+ formats of images, videos, audio, and documents. No ads, no tracking, open source, and all processing (other than video) is done offline on your device."
	/>
	<meta property="twitter:image" content={featuredImage} />
	<link rel="canonical" href="https://flux.sh/" />
	{#if enablePlausible}
		<script
			defer
			data-domain={PUB_HOSTNAME || "flux.sh"}
			src="{PUB_PLAUSIBLE_URL}/js/script.js"
		></script>
	{/if}
	{#if isAprilFools}
		<style>
			* {
				font-family: "Comic Sans MS", "Comic Sans", cursive !important;
			}
		</style>
	{/if}
</svelte:head>

<!-- FIXME: if user resizes between desktop/mobile, highlight of page disappears (only shows on original size) -->
{#key $locale}
	<div
		class="flex flex-col min-h-screen h-full w-full overflow-x-hidden"
		ondrop={dropFiles}
		ondragenter={(e) => handleDrag(e, true)}
		ondragover={(e) => handleDrag(e, true)}
		ondragleave={(e) => handleDrag(e, false)}
		role="region"
	>
		<Layout.UploadRegion />

		<div>
			<Layout.MobileLogo />
			<Navbar.Desktop />
		</div>

		<!-- 
		SvelteKit throws the following warning when developing - safe to ignore as we render the children in this component:
		`<slot />` or `{@render ...}` tag missing — inner content will not be rendered
		-->
		<Layout.PageContent {children} />

		<Layout.Toasts />
		<Layout.Dialogs />

		<div>
			<Navbar.Mobile />
		</div>
	</div>
{/key}

<!-- Gradients placed here to prevent it overlapping in transitions -->
<Particles class="fixed inset-0 -z-30 pointer-events-none" />
<Layout.Gradients />
