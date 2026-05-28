<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { m } from "$lib/paraglide/messages";
	import { ToastManager } from "$lib/util/toast.svelte";
	import { SendIcon, MailIcon, UserIcon, FileTextIcon, MessageSquareIcon } from "lucide-svelte";
	import { onMount } from "svelte";

	type Props = {
		open: boolean;
		onClose: () => void;
	};

	let { open = $bindable(false), onClose }: Props = $props();

	let name = $state("");
	let email = $state("");
	let subject = $state("");
	let message = $state("");
	
	let isSending = $state(false);
	let emailError = $state("");
	let textareaRef = $state<HTMLTextAreaElement>();

	// Email validation regex
	const validateEmail = (emailStr: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(emailStr);
	};

	const handleInputEmail = () => {
		if (email && !validateEmail(email)) {
			emailError = m.support_email_invalid();
		} else {
			emailError = "";
		}
	};

	// Auto-resize textarea
	$effect(() => {
		if (textareaRef && message !== undefined) {
			textareaRef.style.height = "auto";
			textareaRef.style.height = `${Math.min(textareaRef.scrollHeight, 180)}px`;
		}
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		if (!email.trim()) {
			emailError = m.support_email_required();
			return;
		}
		if (!validateEmail(email)) {
			emailError = m.support_email_invalid();
			return;
		}
		if (!subject.trim() || !message.trim()) {
			return;
		}

		isSending = true;
		const SUPPORT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbww8SxkxrSOYScJNdtkhorXTqIQ10qVT8WHRgHXnrCRjyYbYhfHLWlta97sFzVk8o0pSA/exec";

		try {
			// Trigger a sending toast
			const toastId = ToastManager.add({
				type: "info",
				message: m.support_sending(),
				disappearing: false
			});

			const response = await fetch(SUPPORT_WEBHOOK_URL, {
				method: "POST",
				headers: { "Content-Type": "text/plain;charset=utf-8" },
				body: JSON.stringify({
					name: name.trim() || "FLUX Extension User",
					email: email.trim(),
					title: `[FLUX] ${subject.trim()}`,
					content: message.trim()
				})
			});

			// Dismiss sending toast
			ToastManager.remove(toastId);

			const text = await response.text();
			let isSuccess = false;

			try {
				const data = JSON.parse(text);
				if (data.status === "success") isSuccess = true;
			} catch {
				if (response.ok) isSuccess = true;
			}

			if (isSuccess) {
				ToastManager.add({
					type: "success",
					message: m.support_send_success()
				});
				// Reset fields
				name = "";
				email = "";
				subject = "";
				message = "";
				open = false;
				onClose();
			} else {
				throw new Error("Failed to send");
			}
		} catch (err) {
			ToastManager.add({
				type: "error",
				message: m.support_send_error()
			});
		} finally {
			isSending = false;
		}
	};

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			},
		};
	}

	const duration = 250;
</script>

{#if open}
	<div use:portal class="z-[9999]">
		<!-- Backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm"
			transition:fade={{ duration }}
			onclick={(e) => {
				e.stopPropagation();
				if (!isSending) {
					open = false;
					onClose();
				}
			}}
		></div>

		<!-- Support Sheet Content -->
		<div
			transition:fly={{
				y: 350,
				duration,
				easing: quintOut,
			}}
			class="fixed inset-x-0 bottom-0 w-full max-w-[400px] mx-auto z-[9999] shadow-2xl rounded-t-[1.75rem] overflow-hidden flex flex-col pb-6 max-h-[90vh]"
			style="background-color: var(--bg); padding-bottom: max(env(safe-area-inset-bottom), 1.5rem);"
		>
			<!-- iOS Handle bar -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="w-full flex justify-center pt-3.5 pb-2 cursor-pointer" onclick={() => { if (!isSending) { open = false; onClose(); } }}>
				<div class="w-10 h-1 rounded-full bg-separator opacity-60"></div>
			</div>

			<!-- Form Title -->
			<div class="px-6 pt-1 pb-3 text-center">
				<h3 class="text-xl font-bold font-display tracking-tight text-foreground flex items-center justify-center gap-2">
					<MessageSquareIcon size="20" class="text-accent-purple" />
					{m.support_title()}
				</h3>
				<p class="text-xs text-muted mt-1 leading-relaxed">
					{m.support_subtitle()}
				</p>
			</div>

			<!-- Scrollable Form Container -->
			<form onsubmit={handleSubmit} class="flex flex-col gap-4 px-6 overflow-y-auto max-h-[60vh] pb-2">
				<!-- Name Input (Optional) -->
				<div class="flex flex-col gap-1.5">
					<label for="support-name" class="text-xs font-semibold text-muted pl-1">{m.support_name_label()}</label>
					<div class="relative flex items-center">
						<input
							type="text"
							id="support-name"
							bind:value={name}
							placeholder={m.support_name_placeholder()}
							disabled={isSending}
							autocomplete="name"
							class="w-full bg-panel text-foreground text-sm rounded-xl !pl-10 !pr-4 py-3 border border-transparent focus:!border-transparent focus:!outline-none focus:!ring-0 focus-visible:!border-transparent focus-visible:!outline-none focus-visible:!ring-0 transition-all"
						/>
						<span class="absolute left-3.5 text-muted pointer-events-none z-10 flex items-center">
							<UserIcon size="15" />
						</span>
					</div>
				</div>

				<!-- Email Input (Required) -->
				<div class="flex flex-col gap-1.5">
					<div class="flex justify-between items-center pl-1">
						<label for="support-email" class="text-xs font-semibold text-muted">{m.support_email_label()}</label>
						{#if emailError}
							<span class="text-[10px] text-red-500 font-medium transition-all">{emailError}</span>
						{/if}
					</div>
					<div class="relative flex items-center">
						<input
							type="email"
							id="support-email"
							bind:value={email}
							oninput={handleInputEmail}
							placeholder="you@example.com"
							required
							disabled={isSending}
							autocomplete="email"
							class="w-full bg-panel text-foreground text-sm rounded-xl !pl-10 !pr-4 py-3 border border-transparent focus:!border-transparent focus:!outline-none focus:!ring-0 focus-visible:!border-transparent focus-visible:!outline-none focus-visible:!ring-0 transition-all
							{emailError ? 'border-red-500/50 bg-red-500/5' : ''}"
						/>
						<span class="absolute left-3.5 text-muted pointer-events-none z-10 flex items-center">
							<MailIcon size="15" />
						</span>
					</div>
				</div>

				<!-- Subject Input (Required) -->
				<div class="flex flex-col gap-1.5">
					<label for="support-subject" class="text-xs font-semibold text-muted pl-1">{m.support_subject_label()}</label>
					<div class="relative flex items-center">
						<input
							type="text"
							id="support-subject"
							bind:value={subject}
							placeholder={m.support_subject_placeholder()}
							required
							disabled={isSending}
							class="w-full bg-panel text-foreground text-sm rounded-xl !pl-10 !pr-4 py-3 border border-transparent focus:!border-transparent focus:!outline-none focus:!ring-0 focus-visible:!border-transparent focus-visible:!outline-none focus-visible:!ring-0 transition-all"
						/>
						<span class="absolute left-3.5 text-muted pointer-events-none z-10 flex items-center">
							<FileTextIcon size="15" />
						</span>
					</div>
				</div>

				<!-- Message Input (Required) -->
				<div class="flex flex-col gap-1.5">
					<label for="support-message" class="text-xs font-semibold text-muted pl-1">{m.support_message_label()}</label>
					<textarea
						id="support-message"
						bind:this={textareaRef}
						bind:value={message}
						placeholder={m.support_message_placeholder()}
						required
						disabled={isSending}
						rows="3"
						class="w-full bg-panel text-foreground text-sm rounded-xl px-4 py-3 border border-transparent focus:!border-transparent focus:!outline-none focus:!ring-0 focus-visible:!border-transparent focus-visible:!outline-none focus-visible:!ring-0 transition-all resize-none min-h-[90px] leading-relaxed"
					></textarea>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isSending || !email.trim() || !!emailError || !subject.trim() || !message.trim()}
					class="w-full mt-2 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md select-none focus:!outline-none focus-visible:!outline-none
					{isSending || !email.trim() || !!emailError || !subject.trim() || !message.trim()
						? 'bg-panel text-muted/50 cursor-not-allowed opacity-50'
						: 'bg-accent-purple text-white hover:opacity-95 active:scale-[0.98]'}"
				>
					{#if isSending}
						<div class="w-4 h-4 rounded-full border-[2px] border-white/30 border-t-white animate-spin mr-1"></div>
						{m.support_button_sending()}
					{:else}
						<SendIcon size="14" />
						{m.support_button_send()}
					{/if}
				</button>
			</form>
		</div>
	</div>
{/if}
