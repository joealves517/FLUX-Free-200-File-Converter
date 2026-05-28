<script lang="ts">
	import Layout from "../../routes/+layout.svelte";
	import UploadPage from "../../routes/+page.svelte";
	import ConvertPage from "../../routes/convert/+page.svelte";
	import SettingsPage from "../../routes/settings/+page.svelte";
	import AboutPage from "../../routes/about/+page.svelte";
	import PrivacyPage from "../../routes/privacy/+page.svelte";
	import { page } from "$lib/util/router.svelte";
</script>

<Layout>
	{#if page.url.pathname === "/convert/" || page.url.pathname === "/convert"}
		<ConvertPage />
	{:else if page.url.pathname.startsWith("/settings")}
		<SettingsPage />
	{:else if page.url.pathname.startsWith("/about")}
		<AboutPage />
	{:else if page.url.pathname.startsWith("/privacy")}
		<PrivacyPage />
	{:else}
		<UploadPage />
	{/if}
</Layout>
