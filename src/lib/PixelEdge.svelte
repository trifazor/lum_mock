<script>
	/** Pixel blocks that dissolve a solid colour into the next section. */
	/** @type {{ color?: string, flip?: boolean, rows?: number, seed?: number }} */
	let { color = '#3b4ae0', flip = false, rows = 5, seed = 1 } = $props();

	const cell = 16;
	const cols = 160;
	const hash = (/** @type {number} */ a, /** @type {number} */ b) => {
		const n = Math.sin(a * 127.1 + b * 311.7 + seed * 74.7) * 43758.5453;
		return n - Math.floor(n);
	};

	const blocks = [];
	for (let r = 0; r < rows; r++) {
		const p = Math.pow(1 - r / rows, 1.5) * 0.85;
		for (let c = 0; c < cols; c++) if (r === 0 || hash(c, r) < p) blocks.push({ x: c * cell, y: r * cell });
	}
</script>

<div class="edge" class:flip style="height:{rows * cell}px" aria-hidden="true">
	<svg width={cols * cell} height={rows * cell} shape-rendering="crispEdges">
		{#each blocks as b}<rect x={b.x} y={b.y} width={cell} height={cell} fill={color} />{/each}
	</svg>
</div>

<style>
	.edge { position: relative; overflow: hidden; line-height: 0; }
	svg { position: absolute; left: 50%; transform: translateX(-50%); }
	.flip svg { transform: translateX(-50%) scaleY(-1); }
</style>
