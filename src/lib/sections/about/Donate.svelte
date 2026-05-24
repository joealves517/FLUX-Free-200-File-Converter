<script lang="ts" module>
	export interface Donor {
		name: string;
		amount: number;
		avatar: string;
	}
</script>

<script lang="ts">
	import FancyInput from "$lib/components/functional/FancyInput.svelte";
	import Panel from "$lib/components/visual/Panel.svelte";
	import { effects } from "$lib/store/index.svelte";
	import clsx from "clsx";
	import {
		CalendarHeartIcon,
		HandCoinsIcon,
		HeartIcon,
		WalletIcon,
	} from "lucide-svelte";
	import { m } from "$lib/paraglide/messages";

	const LEMON_SQUEEZY_URL = "https://graphosai.lemonsqueezy.com/checkout/buy/af107fef-9760-44b8-bbd9-7e94fbb5e1fc";

	let amount = $state(1);
	let customAmount = $state("");
	let type = $state("one-time");

	const presetAmounts = [1, 10, 25];

	const amountClick = (preset: number) => {
		amount = preset;
		customAmount = "";
	};

	const paymentClick = () => {
		// Redirect to Lemon Squeezy with the selected amount
		const url = new URL(LEMON_SQUEEZY_URL);
		url.searchParams.set("checkout[custom_price]", amount.toString());
		window.open(url.toString(), "_blank");
	};

	$effect(() => {
		if (customAmount) {
			amount = parseFloat(customAmount);
		}
	});
</script>

<Panel class="flex flex-col gap-8 p-6">
	<div class="flex flex-col gap-3">
		<h2 class="text-2xl font-bold flex items-center">
			<div
				class="rounded-full glass-icon-red p-2 inline-block mr-3 w-10 h-10"
			>
				<HeartIcon />
			</div>
			{m["about.donate.title"]()}
		</h2>
		<p class="text-base font-normal">
			{m["about.donate.description"]()}
		</p>
	</div>

	<div class="flex flex-col gap-3 w-full">
		<div class="grid grid-cols-4 gap-3 w-full">
			{#each presetAmounts as preset, i}
				<button
					onclick={() => amountClick(preset)}
					class={clsx(
						"btn p-4 rounded-lg flex items-center justify-center",
						{
							"!scale-100": !$effects,
							"glass-icon-red text-black": amount === preset,
						},
					)}
					style={i === 2 ? "grid-column: 3;" : ""}
				>
					${preset} USD
				</button>
			{/each}
			<div class="flex items-center justify-center">
				<FancyInput
					bind:value={customAmount}
					placeholder={m["about.donate.custom"]()}
					prefix="$"
					type="number"
					class="h-full"
				/>
			</div>
		</div>
	</div>

	<div class="flex flex-row justify-center w-full">
		<button
			onclick={paymentClick}
			class="btn flex-1 p-3 rounded-full glass-icon-red border-2 border-accent-red h-14 text-black flex justify-center items-center font-bold text-lg"
		>
			<WalletIcon size="24" class="inline-block mr-2" />
			{m["about.donate.pay_now"]()} - ${amount}
		</button>
	</div>
</Panel>
