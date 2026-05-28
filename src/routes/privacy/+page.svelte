<script lang="ts">
	import { ShieldCheckIcon } from "lucide-svelte";
	import { GITHUB_URL_FLUX } from "$lib/util/consts";
</script>

<div class="flex flex-col h-full items-center">
	<h1 class="hidden md:flex text-[40px] tracking-tight leading-[72px] mb-6 items-center justify-center">
		<ShieldCheckIcon size="40" class="inline-block mr-3 text-accent-purple" />
		Privacy Policy for FLUX
	</h1>

	<div class="w-full max-w-[1280px] flex justify-center p-4 md:px-4 md:py-0">
		<div class="bg-panel rounded-2xl p-8 shadow-panel text-base font-normal max-w-[850px] w-full flex flex-col gap-6 leading-relaxed text-black dynadark:text-white">
			<div>
				<p class="text-sm text-muted mb-2">Last Updated: May 24, 2026</p>
				<p class="text-lg">
					At FLUX, we are committed to protecting your privacy. This Privacy Policy explains how FLUX ("we", "our", or "us") processes data when you use the <strong>FLUX - Free 200+ File Converter</strong> browser extension. 
				</p>
				<p class="mt-4 font-semibold text-accent-purple text-lg">
					We maintain a strict zero-data collection policy. Your files and personal data never leave your device.
				</p>
			</div>

			<hr class="border-separator" />

			<div>
				<h2 class="text-xl font-bold mb-3 text-black dynadark:text-white">1. 100% LOCAL COMPUTING AND PROCESSING (WEBASSEMBLY)</h2>
				<p class="mb-3">
					The core feature of FLUX is file conversion (images, videos, audio, and documents). Unlike online converters, FLUX processes your files entirely locally on your device:
				</p>
				<ul class="list-disc list-inside pl-4 flex flex-col gap-2">
					<li><strong>Local Execution:</strong> We use cutting-edge WebAssembly (WASM) technologies, including ImageMagick WASM, FFmpeg WASM, and Pandoc WASM, running inside your browser's local sandbox.</li>
					<li><strong>No Uploads:</strong> Your files are converted entirely within your browser window. <strong>No files, file metadata, or raw document contents are ever uploaded to our servers or any third-party servers.</strong></li>
					<li><strong>No Server Storage:</strong> Because processing is done on your local computer, we do not store, view, or retain any files you convert.</li>
				</ul>
			</div>

			<div>
				<h2 class="text-xl font-bold mb-3 text-black dynadark:text-white">2. DATA AND INFORMATION WE COLLECT</h2>
				<p class="mb-3">
					We have a strict <strong>no-tracking and no-personal data collection</strong> policy.
				</p>
				<ul class="list-disc list-inside pl-4 flex flex-col gap-2">
					<li><strong>We DO NOT collect</strong> your name, email address, physical address, age, phone number, or government identifiers.</li>
					<li><strong>We DO NOT collect</strong> search history, browsing history, or keystroke logs.</li>
					<li><strong>We DO NOT collect</strong> or inspect any content, text, audio, images, or videos contained in the files you upload for conversion.</li>
				</ul>
			</div>

			<div>
				<h2 class="text-xl font-bold mb-3 text-black dynadark:text-white">3. OUTBOUND NETWORK CONNECTIONS</h2>
				<p class="mb-3">
					For full transparency, the FLUX extension only makes the following safe, outbound network requests strictly to perform non-intrusive operations:
				</p>
				<ul class="list-disc list-inside pl-4 flex flex-col gap-2">
					<li><strong>IPAPI (ipapi.co):</strong> The extension makes a request to <code>https://ipapi.co/json/</code> to automatically detect your approximate location (country/region). This is used strictly to pre-select your preferred language for the interface. <strong>No personal data is saved or linked to this request.</strong></li>
					<li><strong>GitHub API:</strong> The About page makes a request to <code>https://api.github.com/repos/joealves517/FLUX-Free-200-File-Converter/contributors</code> to retrieve the static avatar images and profile links of open-source contributors to the project.</li>
					<li><strong>Plausible Analytics (Optional & Opt-out):</strong> FLUX utilizes Plausible Analytics on the extension page to collect completely anonymous, aggregated visitor statistics. Plausible <strong>does not use cookies, does not track individual identities, and stores no personal data.</strong> You can easily opt-out of analytics at any time in the extension Settings.</li>
					<li><strong>Stripe Payment Gateway:</strong> If you choose to make a voluntary donation to support the project, payment processing is handled independently and securely by Stripe. FLUX does not see, collect, or store any of your financial, credit card, or payment details.</li>
				</ul>
			</div>

			<div>
				<h2 class="text-xl font-bold mb-3 text-black dynadark:text-white">4. LOCAL STORAGE AND COOKIES</h2>
				<ul class="list-disc list-inside pl-4 flex flex-col gap-2">
					<li><strong>Settings Persistence:</strong> We use the browser's local storage (<code>localStorage</code> and Chrome Extension <code>storage</code> API) strictly to save your configuration preferences (such as conversion quality settings, audio sample rates, and light/dark theme preference).</li>
					<li><strong>No Tracking Cookies:</strong> The extension does not place any marketing or tracking cookies on your device.</li>
				</ul>
			</div>

			<div>
				<h2 class="text-xl font-bold mb-3 text-black dynadark:text-white">5. CHILDREN'S PRIVACY</h2>
				<p>
					Because we collect 0 personal information and process all files locally, our extension is fully compliant with children's privacy regulations globally, including COPPA and GDPR. We do not gather any data from users of any age.
				</p>
			</div>

			<div>
				<h2 class="text-xl font-bold mb-3 text-black dynadark:text-white">6. CHANGES TO THIS PRIVACY POLICY</h2>
				<p>
					We may update this Privacy Policy from time to time to reflect modifications in our local architecture. Any update will be immediately published on this page.
				</p>
			</div>

			<div>
				<h2 class="text-xl font-bold mb-3 text-black dynadark:text-white">7. LICENSE & OPEN SOURCE COMPLIANCE</h2>
				<p class="mb-3">
					This extension is an open-source project that utilizes code from the <a href="https://github.com/vert-sh/vert" target="_blank" rel="noopener noreferrer" class="text-accent-purple hover:underline font-semibold">VERT</a> project.
				</p>
				<p>
					In accordance with the GNU GPLv3 license (the 3.0 copyleft license), the full source code for this extension is publicly available. You can access, inspect, and modify our full source code at our public <a href={GITHUB_URL_FLUX} target="_blank" rel="noopener noreferrer" class="text-accent-purple hover:underline font-semibold">GitHub repository</a>.
				</p>
			</div>

			<hr class="border-separator" />

			<div>
				<h2 class="text-xl font-bold mb-2 text-black dynadark:text-white">8. CONTACT US</h2>
				<p>
					If you have any questions or concerns about our privacy practices, please contact us at:<br />
					Email: <a href="mailto:alvesoscar517@gmail.com" class="text-accent-purple hover:underline font-semibold">alvesoscar517@gmail.com</a>
				</p>
			</div>
		</div>
	</div>
</div>
