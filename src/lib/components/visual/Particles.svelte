<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	interface Circle {
		x: number;
		y: number;
		translateX: number;
		translateY: number;
		size: number;
		alpha: number;
		targetAlpha: number;
		dx: number;
		dy: number;
		magnetism: number;
	}

	let {
		class: className = "",
		quantity = 80,
		staticity = 20,
		ease = 10,
		size = 0.8,
		refresh = false,
		color = "#ffffff",
		vx = 0,
		vy = 0,
	} = $props();

	let canvasRef = $state<HTMLCanvasElement>();
	let canvasContainerRef = $state<HTMLDivElement>();
	let context: CanvasRenderingContext2D | null = null;
	let circles: Circle[] = [];
	let mouse = { x: 0, y: 0 };
	let canvasSize = { w: 0, h: 0 };
	let canvasRect = { left: 0, top: 0 };
	let animationFrameId: number;
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

	// Mouse movement handler directly updates mouse coordinates without reactive trigger overhead
	const handleMouseMove = (event: MouseEvent) => {
		const x = event.clientX - canvasRect.left - canvasSize.w / 2;
		const y = event.clientY - canvasRect.top - canvasSize.h / 2;
		mouse.x = x;
		mouse.y = y;
	};

	const handleMouseLeave = () => {
		mouse.x = 0;
		mouse.y = 0;
	};

	function hexToRgb(hex: string): number[] {
		let normalized = hex.replace("#", "");

		if (normalized.length === 3) {
			normalized = normalized
				.split("")
				.map((char) => char + char)
				.join("");
		}

		const hexInt = parseInt(normalized, 16);
		const red = (hexInt >> 16) & 255;
		const green = (hexInt >> 8) & 255;
		const blue = hexInt & 255;
		return [red, green, blue];
	}

	const rgb = $derived(hexToRgb(color));

	const circleParams = (): Circle => {
		const x = Math.floor(Math.random() * canvasSize.w);
		const y = Math.floor(Math.random() * canvasSize.h);
		const pSize = Math.floor(Math.random() * 2) + size;
		const targetAlpha = parseFloat((Math.random() * 0.4 + 0.1).toFixed(1));
		return {
			x,
			y,
			translateX: 0,
			translateY: 0,
			size: pSize,
			alpha: 0,
			targetAlpha,
			dx: (Math.random() - 0.5) * 0.1,
			dy: (Math.random() - 0.5) * 0.1,
			magnetism: 0.1 + Math.random() * 4,
		};
	};

	const drawCircle = (circle: Circle, update = false) => {
		if (context) {
			const { x, y, translateX, translateY, size, alpha } = circle;
			context.translate(translateX, translateY);
			context.beginPath();
			context.arc(x, y, size, 0, 2 * Math.PI);
			context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
			context.fill();
			context.setTransform(dpr, 0, 0, dpr, 0, 0);

			if (!update) {
				circles.push(circle);
			}
		}
	};

	const clearContext = () => {
		if (context) {
			context.clearRect(0, 0, canvasSize.w, canvasSize.h);
		}
	};

	const resizeCanvas = () => {
		if (canvasContainerRef && canvasRef && context) {
			circles.length = 0;
			canvasSize.w = canvasContainerRef.offsetWidth;
			canvasSize.h = canvasContainerRef.offsetHeight;
			canvasRef.width = canvasSize.w * dpr;
			canvasRef.height = canvasSize.h * dpr;
			canvasRef.style.width = `${canvasSize.w}px`;
			canvasRef.style.height = `${canvasSize.h}px`;
			context.scale(dpr, dpr);

			// Calculate bounds once here, preventing expensive getBoundingClientRect calls during mousemove
			const rect = canvasRef.getBoundingClientRect();
			canvasRect = { left: rect.left, top: rect.top };
		}
	};

	const drawParticles = () => {
		clearContext();
		const particleCount = quantity;
		for (let i = 0; i < particleCount; i++) {
			const circle = circleParams();
			drawCircle(circle);
		}
	};

	const initCanvas = () => {
		resizeCanvas();
		drawParticles();
	};

	const remapValue = (
		value: number,
		start1: number,
		end1: number,
		start2: number,
		end2: number,
	): number => {
		const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
		return remapped > 0 ? remapped : 0;
	};

	const animate = () => {
		clearContext();
		circles.forEach((circle, i) => {
			const edge = [
				circle.x + circle.translateX - circle.size,
				canvasSize.w - circle.x - circle.translateX - circle.size,
				circle.y + circle.translateY - circle.size,
				canvasSize.h - circle.y - circle.translateY - circle.size,
			];
			const closestEdge = edge.reduce((a, b) => Math.min(a, b));
			const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
			if (remapClosestEdge > 1) {
				circle.alpha += 0.02;
				if (circle.alpha > circle.targetAlpha) {
					circle.alpha = circle.targetAlpha;
				}
			} else {
				circle.alpha = circle.targetAlpha * remapClosestEdge;
			}
			circle.x += circle.dx + vx;
			circle.y += circle.dy + vy;
			circle.translateX +=
				(mouse.x / (staticity / circle.magnetism) - circle.translateX) / ease;
			circle.translateY +=
				(mouse.y / (staticity / circle.magnetism) - circle.translateY) / ease;

			drawCircle(circle, true);

			if (
				circle.x < -circle.size ||
				circle.x > canvasSize.w + circle.size ||
				circle.y < -circle.size ||
				circle.y > canvasSize.h + circle.size
			) {
				circles.splice(i, 1);
				const newCircle = circleParams();
				drawCircle(newCircle);
			}
		});
		animationFrameId = requestAnimationFrame(animate);
	};

	onMount(() => {
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseleave", handleMouseLeave);
		window.addEventListener("resize", initCanvas);
	});

	onDestroy(() => {
		if (typeof window !== "undefined") {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseleave", handleMouseLeave);
			window.removeEventListener("resize", initCanvas);
		}
	});

	$effect(() => {
		if (canvasRef) {
			context = canvasRef.getContext("2d");
		}
		initCanvas();
		animate();

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});

	$effect(() => {
		// Watch refresh changes reactively
		const _refresh = refresh;
		initCanvas();
	});
</script>

<div
	bind:this={canvasContainerRef}
	class="absolute inset-0 overflow-hidden pointer-events-none {className}"
>
	<canvas class="absolute inset-0 w-full h-full block" bind:this={canvasRef}></canvas>
</div>
