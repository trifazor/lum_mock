<script>
	import { onMount } from 'svelte';

	/** @type {{ anchor?: HTMLElement, shake?: HTMLElement }} */
	let { anchor, shake } = $props();

	/** @type {HTMLCanvasElement} */
	let canvas;

	// poster palette: white water with royal-blue pixel outlines
	const BLUE = '#3b4ae0';
	const WATER = ['#9cc8ff', '#c4e0ff', '#e3f1ff', '#ffffff'];

	onMount(() => {
		const ctx = canvas.getContext('2d');
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

		let W = 0, H = 0, P = 4;
		let btn = { x0: 0, x1: 0, y0: 0, y1: 0, cx: 0 };
		/** @type {{x:number,y:number,vx:number,vy:number,c:number,hit:boolean,life:number}[]} */
		let drops = [];
		/** @type {{x:number,y:number,r:number,a:number}[]} */
		let ripples = [];
		let energy = 0;
		let t = 0;
		let raf = 0;
		let visible = true;

		function measure() {
			const rect = canvas.getBoundingClientRect();
			P = rect.width < 640 ? 3 : 4;
			W = Math.ceil(rect.width / P);
			H = Math.ceil(rect.height / P);
			canvas.width = W;
			canvas.height = H;
			if (anchor) {
				const b = anchor.getBoundingClientRect();
				btn.x0 = Math.round((b.left - rect.left) / P);
				btn.x1 = Math.round((b.right - rect.left) / P);
				btn.y0 = Math.round((b.top - rect.top) / P);
				btn.y1 = Math.round((b.bottom - rect.top) / P);
			}
			btn.cx = (btn.x0 + btn.x1) / 2;
		}

		const bandH = () => Math.max(10, Math.round(H * 0.07));
		const surface = () => H - bandH();

		// deterministic hash for the dissolving pixel blocks
		const hash = (/** @type {number} */ a, /** @type {number} */ b) => {
			const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
			return n - Math.floor(n);
		};

		// the stream arcs in from the top-left like the poster
		const src = () => ({ x: btn.cx - Math.min(W * 0.28, 90), y: -4 });

		function spawn() {
			const s = src();
			const width = Math.max(4, (btn.x1 - btn.x0) * 0.16);
			const n = reduced ? 1 : Math.max(2, Math.round(width / 2));
			// flight time ~ so the arc lands on the button centre
			const T = Math.sqrt((2 * (btn.y0 - s.y)) / 0.09);
			for (let i = 0; i < n; i++) {
				const r = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
				drops.push({
					x: s.x + r * width * 2,
					y: s.y - Math.random() * 3,
					vx: (btn.cx - s.x) / T + r * 0.12 + (Math.random() - 0.5) * 0.04,
					vy: 0.2 + Math.random() * 0.1,
					c: Math.abs(r) < 0.15 ? 3 : Math.floor(Math.random() * 3),
					hit: false,
					life: 0
				});
			}
		}

		function splash(/** @type {number} */ x, /** @type {number} */ y) {
			const n = 1 + Math.floor(Math.random() * 3);
			for (let i = 0; i < n; i++) {
				drops.push({
					x,
					y: y - 1,
					vx: (Math.random() < 0.7 ? 1 : -1) * (0.3 + Math.random() * 1.6),
					vy: -(0.8 + Math.random() * 1.8),
					c: 2 + Math.floor(Math.random() * 2),
					hit: true,
					life: 0
				});
			}
		}

		function step() {
			t += 1 / 60;
			spawn();
			let hits = 0;
			const next = [];
			for (const d of drops) {
				d.life++;
				const py = d.y;
				d.vy += 0.09;
				d.x += d.vx;
				d.y += d.vy;

				if (d.x >= btn.x0 && d.x <= btn.x1 && py <= btn.y0 && d.y >= btn.y0) {
					d.y = btn.y0 - 1;
					if (!d.hit) {
						hits++;
						d.hit = true;
						const off = (d.x - btn.cx) / ((btn.x1 - btn.x0) / 2 || 1);
						d.vx = d.vx * 0.6 + (off === 0 ? Math.random() - 0.5 : Math.sign(off)) * (0.2 + Math.random() * 0.5) + off * 0.8;
						d.vy = -Math.abs(d.vy) * (0.1 + Math.random() * 0.25);
						if (Math.random() < 0.3) splash(d.x, d.y);
					} else {
						d.vy = 0;
						d.vx *= 1.04;
					}
				}
				if (d.y > btn.y0 && d.y < btn.y1 && d.x > btn.x0 && d.x < btn.x1) {
					d.x = d.vx < 0 ? btn.x0 - 1 : btn.x1 + 1;
					d.vx *= -0.3;
				}
				if (d.y >= surface()) {
					if (Math.random() < 0.06) ripples.push({ x: d.x, y: surface(), r: 0, a: 1 });
					continue;
				}
				if (d.x < -6 || d.x > W + 6 || d.life > 900) continue;
				next.push(d);
			}
			drops = next;

			for (const r of ripples) {
				r.r += 0.4;
				r.a -= 0.03;
			}
			ripples = ripples.filter((r) => r.a > 0);

			energy = Math.min(9, energy * 0.88 + hits * 0.45);
			if (shake && !reduced) {
				const q = (/** @type {number} */ v) => Math.round(v / 2) * 2;
				shake.style.transform = `translate(${q((Math.random() - 0.5) * energy)}px, ${q((Math.random() - 0.3) * energy * 0.6)}px)`;
			}
		}

		function draw() {
			ctx.clearRect(0, 0, W, H);

			// blue band at the bottom that dissolves upward into flowing blocks
			const top = surface();
			ctx.fillStyle = BLUE;
			ctx.fillRect(0, top, W, H - top);
			const B = 4;
			const shift = Math.floor(t * 6);
			for (let row = 1; row <= 8; row++) {
				const p = 0.75 * Math.pow(1 - row / 9, 1.6);
				const y = top - row * B;
				for (let col = -1; col < W / B + 1; col++) {
					const k = col - Math.floor(shift / B) * (row % 2 ? 1 : 0) - Math.floor(t * (1 + row * 0.15));
					if (hash(k, row) < p) ctx.fillRect(col * B, y, B, B);
				}
			}

			for (const r of ripples) {
				ctx.fillStyle = `rgba(255,255,255,${r.a.toFixed(2)})`;
				const rr = Math.round(r.r);
				ctx.fillRect(Math.round(r.x - rr), Math.round(r.y) + 1, 2, 1);
				ctx.fillRect(Math.round(r.x + rr), Math.round(r.y) + 1, 2, 1);
			}

			// outline pass, then fill pass: gives the poster's blue pixel edge
			ctx.fillStyle = BLUE;
			for (const d of drops) {
				const x = Math.round(d.x) - 1, y = Math.round(d.y) - 1;
				ctx.fillRect(x, y, 3, d.vy > 1.4 ? 4 : 3);
			}
			for (const d of drops) {
				const x = Math.round(d.x), y = Math.round(d.y);
				ctx.fillStyle = WATER[d.c];
				ctx.fillRect(x, y, 1, 1);
				if (d.vy > 1.4) ctx.fillRect(x, y + 1, 1, 1);
			}

			if (energy > 1) {
				ctx.fillStyle = '#ffffff';
				for (let i = 0; i < energy; i++) {
					ctx.fillRect(
						Math.round(btn.x0 + Math.random() * (btn.x1 - btn.x0)),
						btn.y0 - 1 - Math.floor(Math.random() * 3),
						1,
						1
					);
				}
			}
		}

		function loop() {
			raf = requestAnimationFrame(loop);
			if (!visible) return;
			step();
			draw();
		}

		measure();
		for (let i = 0; i < 150; i++) step();
		loop();

		const ro = new ResizeObserver(measure);
		ro.observe(canvas);
		if (anchor) ro.observe(anchor);
		document.fonts?.ready.then(measure);
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
		io.observe(canvas);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
		pointer-events: none;
	}
</style>
