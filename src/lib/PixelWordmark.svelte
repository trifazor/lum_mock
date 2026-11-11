<script>
	/** Hand-drawn pixel "LUM" so the M reads clearly (Silkscreen's M looks like an H). */
	/** @type {{ color?: string, shadow?: string | null, height?: string }} */
	let { color = 'currentColor', shadow = null, height = '1em' } = $props();

	const L = ['#....', '#....', '#....', '#....', '#....', '#....', '#####'];
	const U = ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'];
	const M = ['#.....#', '##...##', '#.#.#.#', '#..#..#', '#.....#', '#.....#', '#.....#'];

	const px = [];
	let ox = 0;
	for (const g of [L, U, M]) {
		g.forEach((row, y) => [...row].forEach((c, x) => c === '#' && px.push({ x: ox + x, y })));
		ox += g[0].length + 2;
	}
	const w = ox - 2;
	const s = shadow ? 0.6 : 0;
</script>

<svg viewBox="0 0 {w + s} {7 + s}" style="height:{height}" shape-rendering="crispEdges" role="img" aria-label="LUM">
	{#if shadow}{#each px as p}<rect x={p.x + s} y={p.y + s} width="1" height="1" fill={shadow} />{/each}{/if}
	{#each px as p}<rect x={p.x} y={p.y} width="1.02" height="1.02" fill={color} />{/each}
</svg>

<style>
	svg { display: block; width: auto; overflow: visible; }
</style>
