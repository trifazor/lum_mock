<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	/** @type {{ t: { deckKicker: string, deckH2: string, deckPrev: string, deckNext: string, deckFull: string, deckDownload: string, deckLoading: string, deckMeta: string, deckMobile: string } }} */
	let { t } = $props();

	const src = `${base}/lum-pitch-deck.pdf`;

	/** @type {HTMLElement | undefined} */
	let section = $state();
	/** @type {HTMLElement | undefined} */
	let stage = $state();
	/** @type {HTMLCanvasElement | undefined} */
	let canvas = $state();

	let desktop = $state(false);
	let page = $state(1);
	let total = $state(0);
	let ready = $state(false);
	let failed = $state(false);

	/** @type {any} */
	let doc;
	/** @type {any} */
	let task;

	async function load() {
		try {
			const pdfjs = await import('pdfjs-dist');
			pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
			doc = await pdfjs.getDocument({ url: src }).promise;
			total = doc.numPages;
			ready = true;
			render();
		} catch (e) {
			console.error("[PitchDeck] failed to load PDF", e);
			failed = true;
		}
	}

	async function render() {
		if (!doc || !canvas || !stage) return;
		const p = await doc.getPage(page);
		const unscaled = p.getViewport({ scale: 1 });
		const scale = Math.min(stage.clientWidth / unscaled.width, stage.clientHeight / unscaled.height);
		const dpr = window.devicePixelRatio || 1;
		const vp = p.getViewport({ scale: scale * dpr });

		task?.cancel();
		const off = document.createElement('canvas');
		off.width = vp.width;
		off.height = vp.height;
		task = p.render({ canvas: off, viewport: vp });
		try {
			await task.promise;
		} catch {
			return; // cancelled by a newer render
		}
		canvas.width = vp.width;
		canvas.height = vp.height;
		canvas.style.width = `${vp.width / dpr}px`;
		canvas.style.height = `${vp.height / dpr}px`;
		canvas.getContext('2d')?.drawImage(off, 0, 0);
	}

	/** @param {number} n */
	function go(n) {
		const next = Math.min(Math.max(n, 1), total);
		if (next === page) return;
		page = next;
		render();
	}

	function fullscreen() {
		if (document.fullscreenElement) document.exitFullscreen();
		else section?.querySelector('.viewer')?.requestFullscreen();
	}

	/** @param {KeyboardEvent} e */
	function onkey(e) {
		if (!ready) return;
		const inView = document.fullscreenElement || (section && isVisible(section));
		if (!inView || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
		if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(page + 1); }
		else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(page - 1); }
	}

	/** @param {HTMLElement} el */
	function isVisible(el) {
		const r = el.getBoundingClientRect();
		return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
	}

	onMount(() => {
		const mq = matchMedia('(min-width: 900px)');
		desktop = mq.matches;
		const onmq = () => (desktop = mq.matches);
		mq.addEventListener('change', onmq);

		// lazy-load pdf.js only when the section approaches the viewport on desktop
		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && desktop && !doc && !failed) load();
			},
			{ rootMargin: '600px' }
		);
		if (section) io.observe(section);

		return () => {
			mq.removeEventListener('change', onmq);
			io.disconnect();
			doc?.destroy();
		};
	});

	$effect(() => {
		if (!stage) return;
		const ro = new ResizeObserver(() => ready && render());
		ro.observe(stage);
		return () => ro.disconnect();
	});

	$effect(() => {
		// desktop may switch on after mount (window resized)
		if (desktop && stage && section && isVisible(section) && !doc && !failed) load();
	});
</script>

<svelte:window onkeydown={onkey} />

<section class="deck" id="deck" bind:this={section}>
	<div class="wrap">
		<p class="kicker">{t.deckKicker}</p>
		<h2>{t.deckH2}</h2>

		{#if desktop && !failed}
			<div class="viewer">
				<div class="stage" bind:this={stage}>
					<canvas bind:this={canvas} aria-label="{t.deckH2} – {page} / {total}"></canvas>
					{#if !ready}<p class="loading">{t.deckLoading}</p>{/if}
					<button class="hit hit-l" aria-label={t.deckPrev} onclick={() => go(page - 1)} disabled={page <= 1}></button>
					<button class="hit hit-r" aria-label={t.deckNext} onclick={() => go(page + 1)} disabled={page >= total}></button>
				</div>
				<div class="bar">
					<button onclick={() => go(page - 1)} disabled={!ready || page <= 1}>← {t.deckPrev}</button>
					<div class="progress" aria-hidden="true">
						{#each Array(total) as _, i}
							<span class:on={i < page} role="presentation" onclick={() => go(i + 1)}></span>
						{/each}
					</div>
					<span class="count">{String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
					<button onclick={() => go(page + 1)} disabled={!ready || page >= total}>{t.deckNext} →</button>
					<button onclick={fullscreen} disabled={!ready}>⛶ {t.deckFull}</button>
					<a href={src} download>↓ PDF</a>
				</div>
			</div>
		{:else}
			<div class="mobile">
				<div class="cover" aria-hidden="true">
					<span>Cashflow<br />for SMEs</span>
				</div>
				<div>
					<p>{t.deckMobile}</p>
					<p class="meta">{t.deckMeta}</p>
					<a class="dl" href={src} download>↓ {t.deckDownload}</a>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.deck { padding: clamp(4rem, 9vw, 7rem) 0; background: var(--soft); border-block: 1px solid var(--line); }
	.wrap { width: min(1120px, 100% - 2.5rem); margin-inline: auto; }
	.kicker { font-family: var(--mono); font-size: 0.85rem; color: var(--blue); font-weight: 500; margin: 0; }
	h2 { color: var(--ink); letter-spacing: -0.03em; font-size: clamp(2rem, 5vw, 3.25rem); line-height: 1.05; margin: 0.3em 0 0.7em; font-weight: 700; }

	.viewer { background: var(--ink); border-radius: 16px; padding: 1rem; box-shadow: 0 50px 100px -30px rgba(10, 16, 51, 0.5); }
	.viewer:fullscreen { border-radius: 0; display: flex; flex-direction: column; padding: 1.5rem; }
	.stage { position: relative; aspect-ratio: 16 / 9; display: grid; place-items: center; overflow: hidden; border-radius: 8px; background: #11183f; }
	.viewer:fullscreen .stage { aspect-ratio: auto; flex: 1; }
	canvas { display: block; }
	.loading { position: absolute; font-family: var(--pixel); color: #aeb8ff; margin: 0; }
	.hit { position: absolute; top: 0; bottom: 0; width: 30%; background: none; border: 0; cursor: pointer; }
	.hit:disabled { cursor: default; }
	.hit-l { left: 0; cursor: w-resize; }
	.hit-r { right: 0; cursor: e-resize; }

	.bar { display: flex; align-items: center; gap: 0.75rem; margin-top: 1rem; color: #c7cdea; }
	.bar button, .bar a {
		font: 600 0.8rem var(--pixel); color: #fff; background: #1f2752; border: 0;
		padding: 0.55rem 0.85rem; cursor: pointer; text-decoration: none; white-space: nowrap;
		box-shadow: 0 3px 0 #0a0f2a;
	}
	.bar button:hover:not(:disabled), .bar a:hover { background: var(--blue); }
	.bar button:disabled { opacity: 0.35; cursor: default; }
	.progress { flex: 1; display: flex; gap: 3px; }
	.progress span { flex: 1; height: 8px; background: #1f2752; cursor: pointer; }
	.progress span.on { background: #6d7bff; }
	.count { font-family: var(--pixel); font-size: 0.85rem; min-width: 5ch; text-align: center; }

	.mobile { display: grid; grid-template-columns: auto 1fr; gap: 1.5rem; align-items: center; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 1.25rem; }
	@media (max-width: 480px) { .mobile { grid-template-columns: 1fr; } }
	.cover { width: 160px; aspect-ratio: 16 / 9; background: var(--blue); border-radius: 8px; display: grid; place-items: center; box-shadow: 6px 6px 0 #c9d4ff; }
	.cover span { font-family: var(--pixel); color: #fff; font-size: 0.85rem; line-height: 1.2; text-align: center; }
	.meta { font-family: var(--mono); font-size: 0.8rem; color: var(--muted); margin: 0.3rem 0 1rem; }
	.dl { display: inline-block; font: 700 0.95rem var(--pixel); color: #fff; background: var(--blue); text-decoration: none; padding: 0.75em 1.3em; box-shadow: 0 4px 0 var(--blue-dark); }
</style>
