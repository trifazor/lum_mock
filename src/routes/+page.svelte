<script>
	import { onMount } from 'svelte';
	import PixelWater from '$lib/PixelWater.svelte';
	import PixelEdge from '$lib/PixelEdge.svelte';
	import PixelIcon from '$lib/PixelIcon.svelte';
	import PixelWordmark from '$lib/PixelWordmark.svelte';
	import { dict, students, sources } from '$lib/i18n.js';

	/** @type {HTMLElement | undefined} */
	let anchor = $state();
	/** @type {HTMLElement | undefined} */
	let shake = $state();
	let sent = $state(false);
	/** @type {'de' | 'en'} */
	let lang = $state('de');
	const t = $derived(dict[lang]);

	const amount = 12400;
	const fmt = (/** @type {number} */ n) =>
		n.toLocaleString(t.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

	onMount(() => {
		const saved = localStorage.getItem('lum-lang');
		if (saved === 'en' || saved === 'de') lang = saved;
	});

	$effect(() => {
		document.documentElement.lang = lang;
		localStorage.setItem('lum-lang', lang);
	});

	/** @param {SubmitEvent} e */
	function submit(e) {
		e.preventDefault();
		sent = true;
	}
</script>

<svelte:head>
	<title>{t.title}</title>
</svelte:head>

<nav class="nav">
	<a href="#top" class="logo" aria-label="LUM"><PixelWordmark color="#3b4ae0" shadow="#c9d4ff" height="0.9em" /></a>
	<div class="links">
		<a href="#product">{t.nav.product}</a>
		<a href="#market">{t.nav.market}</a>
		<a href="#how">{t.nav.how}</a>
		<a href="#model">{t.nav.model}</a>
		<div class="lang" role="group" aria-label="Language">
			<button class:active={lang === 'de'} aria-pressed={lang === 'de'} onclick={() => (lang = 'de')}>DE</button>
			<button class:active={lang === 'en'} aria-pressed={lang === 'en'} onclick={() => (lang = 'en')}>EN</button>
		</div>
		<a href="#contact" class="nav-cta">{t.nav.cta} <span aria-hidden="true">→</span></a>
	</div>
</nav>

<header class="hero" id="top">
	<div class="grid-bg" aria-hidden="true"></div>
	<div class="glow" aria-hidden="true"></div>
	<PixelWater {anchor} {shake} />
	<div class="hero-content">
		<a href="#product" class="pill"><span class="pill-tag">{t.pillTag}</span> {t.pill} <span aria-hidden="true">›</span></a>
		<div class="wordmark"><PixelWordmark color="#3b4ae0" shadow="#c9d4ff" height="0.62em" /></div>
		<h1>{t.h1a} <br class="br-m" />{t.h1b}</h1>
		<p class="lead">{t.lead}</p>
		<div class="ctas">
			<div class="cta-anchor" bind:this={anchor}>
				<a href="#contact" class="btn" bind:this={shake}>{t.cta}</a>
			</div>
			<a href="#how" class="link-arrow">{t.ctaSecondary} <span aria-hidden="true">→</span></a>
		</div>
	</div>
</header>

<section class="blue" id="product">
	<div class="wrap">
		<div class="product">
			<div class="product-copy">
				<p class="kicker kicker-light">{t.productKicker}</p>
				<h2>{t.productH2a} <span class="strike">{t.productStrike}</span> {t.productH2b}</h2>
				<p>{t.productText}</p>
			</div>

			<div class="mock">
				<div class="terminal">
					<div class="term-screen">
						<span class="x">✕</span>
						<div>
							<strong>{t.declined}</strong>
							<span>{t.insufficient}</span>
						</div>
					</div>
					<div class="keys" aria-hidden="true">
						{#each Array(12) as _, i}<span class:red={i === 9} class:green={i === 11}></span>{/each}
					</div>
				</div>

				<div class="checkout">
					<div class="co-head">
						<span class="logo small"><PixelWordmark color="#3b4ae0" shadow="#c9d4ff" height="0.9em" /></span>
						<span class="badge"><PixelIcon name="check" size={12} color="#0e9f6e" /> {t.approved}</span>
					</div>
					<p class="co-label">{t.invoice}</p>
					<p class="co-amount">{fmt(amount)}</p>
					<div class="co-rows">
						<div><span>{t.supplierRow}</span><strong>{t.supplierVal}</strong></div>
						<div><span>{t.clientRow}</span><strong>{t.clientVal}</strong></div>
						<div><span>{t.interestRow}</span><strong>0%</strong></div>
					</div>
					<div class="co-bar"><span style="width:66%"></span></div>
					<button class="co-btn" type="button">{t.confirm}</button>
				</div>
			</div>
		</div>
	</div>
</section>
<PixelEdge color="#3b4ae0" rows={5} seed={3} />

<main>
	<section class="section">
		<div class="wrap">
			<p class="kicker">{t.problemKicker}</p>
			<h2 class="h-wide">{t.problemH2}</h2>
			<div class="stats">
				{#each t.stats as s}
					<div class="stat">
						<p class="stat-v" class:stat-word={!s.unit}>{s.value}<span>{s.unit}</span></p>
						<p class="stat-l">{s.label}</p>
					</div>
				{/each}
			</div>
			<div class="trap">
				<h3>{t.trapH}</h3>
				<p>{t.trapText}</p>
			</div>
		</div>
	</section>

	<section class="section soft" id="market">
		<div class="wrap">
			<p class="kicker">{t.marketKicker}</p>
			<h2 class="h-wide">{t.marketH2}</h2>
			<div class="stats">
				{#each t.market as s}
					<div class="stat">
						<p class="stat-v">{s.value}<span>{s.unit}</span></p>
						<p class="stat-l">{s.label}</p>
					</div>
				{/each}
			</div>
			<p class="note">{t.marketNote}</p>
			<ul class="sources">
				{#each sources as s}<li><a href={s.url} target="_blank" rel="noopener">{s.label}</a></li>{/each}
			</ul>
		</div>
	</section>

	<section class="section" id="how">
		<div class="wrap">
			<p class="kicker">{t.howKicker}</p>
			<h2 class="h-wide">{t.howH2}</h2>
			<ol class="steps steps-4">
				{#each t.steps as s, i}
					<li class="card">
						<div class="step-top">
							<span class="step-icon"><PixelIcon name={s.icon} size={28} color="#3b4ae0" /></span>
							<span class="step-n">0{i + 1}</span>
						</div>
						<h3>{s.title}</h3>
						<p>{s.text}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="section soft">
		<div class="wrap">
			<p class="kicker">{t.funcKicker}</p>
			<h2 class="h-wide">{t.funcH2}</h2>
			<div class="steps">
				{#each t.func as col}
					<article class="card">
						<h3 class="col-h">{col.title}</h3>
						<ul class="list">{#each col.items as it}<li>{it}</li>{/each}</ul>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="section">
		<div class="wrap">
			<p class="kicker">{t.diffKicker}</p>
			<h2 class="h-wide">{t.diffH2}</h2>
			<div class="diff">
				<article class="card">
					<h3 class="col-h">{t.diffThem}</h3>
					<ul class="list">{#each t.diffThemItems as it}<li>{it}</li>{/each}</ul>
				</article>
				<article class="card card-blue">
					<h3 class="col-h">{t.diffUs}</h3>
					<ul class="list">{#each t.diffUsItems as it}<li>{@html it}</li>{/each}</ul>
				</article>
			</div>
		</div>
	</section>

	<section class="section soft">
		<div class="wrap">
			<p class="kicker">{t.scoreKicker}</p>
			<h2 class="h-wide">{t.scoreH2}</h2>
			<ol class="steps">
				{#each t.score as s, i}
					<li class="card">
						<span class="step-n step-n-blue">0{i + 1}</span>
						<h3>{s.title}</h3>
						<p>{s.text}</p>
					</li>
				{/each}
			</ol>
			<div class="limits">
				<div>
					<h3>{t.limitH}</h3>
					<p>{t.limitText}</p>
				</div>
				<figure class="bars">
					{#each t.limitBars as b, i}
						<div class="bar-col"><span class="bar" class:first={i === 0} style="height:{35 + i * 20}%"></span><small>{b}</small></div>
					{/each}
					<figcaption>{t.limitNote}</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section class="section" id="model">
		<div class="wrap">
			<p class="kicker">{t.modelKicker}</p>
			<h2 class="h-wide">{t.modelH2}</h2>
			<div class="table card">
				{#each t.model as m}
					<div class="trow"><strong>{m.name}</strong><span>{m.who}</span><em>{m.what}</em></div>
				{/each}
			</div>
			<div class="seed"><span>€325k</span><p>{t.seed}</p></div>
		</div>
	</section>

	<section class="section soft">
		<div class="wrap">
			<p class="kicker">{t.riskKicker}</p>
			<h2 class="h-wide">{t.riskH2}</h2>
			<ol class="risks">
				{#each t.risks as r, i}<li><span>0{i + 1}</span>{r}</li>{/each}
			</ol>
			<p class="goal">{t.riskGoal}</p>
			<div class="diff">
				<article class="card"><h3 class="col-h">{t.feasH}</h3><p>{t.feas}</p></article>
				<article class="card"><h3 class="col-h">{t.keyRisksH}</h3><p>{t.keyRisks}</p></article>
			</div>
		</div>
	</section>

	<section class="section blue-sec">
		<div class="wrap">
			<p class="kicker kicker-light">{t.visionKicker}</p>
			<h2 class="vision">{t.vision}</h2>
			<p>{t.visionText}</p>
			<h3>{t.missionH}</h3>
			<p>{t.mission}</p>
			<h3>{t.valuesH}</h3>
			<ul class="values">{#each t.values as v}<li>{v}</li>{/each}</ul>
			<h3>{t.nameH}</h3>
			<p>{t.nameText}</p>
		</div>
	</section>
</main>

<PixelEdge color="#0a1033" flip rows={5} seed={7} />
<section class="contact" id="contact">
	<div class="wrap contact-grid">
		<div>
			<p class="kicker kicker-light">{t.contactKicker}</p>
			<h2>{t.contactH2}</h2>
			<p class="muted-light">{t.contactText}</p>
			<ul class="contact-list">
				{#each students as s}
					<li><span>{s.name}</span><a href="mailto:{s.email}">{s.email}</a></li>
				{/each}
			</ul>
		</div>
		<form class="form" onsubmit={submit}>
			{#if sent}
				<div class="sent">
					<PixelIcon name="check" size={56} color="#3b4ae0" />
					<h3>{t.sentH}</h3>
					<p>{t.sentP}</p>
				</div>
			{:else}
				<div class="row2">
					<label>{t.fName} <input required name="name" autocomplete="name" placeholder={t.phName} /></label>
					<label>{t.fCompany} <input name="company" autocomplete="organization" placeholder={t.phCompany} /></label>
				</div>
				<label>{t.fEmail} <input required type="email" name="email" autocomplete="email" placeholder={t.phEmail} /></label>
				<label>
					{t.fType}
					<select name="type">
						{#each t.fTypes as o}<option>{o}</option>{/each}
					</select>
				</label>
				<label>{t.fMsg} <textarea name="message" rows="3" placeholder={t.fMsgPh}></textarea></label>
				<button type="submit" class="btn btn-block">{t.cta}</button>
			{/if}
		</form>
	</div>

	<footer class="footer">
		<div class="wrap">
			<div class="footer-top">
				<a href="#top" class="logo logo-light"><PixelWordmark color="#6d7bff" shadow="#2834b8" height="0.9em" /></a>
				<p>{@html t.footerNote}</p>
			</div>
			<p class="copy">{t.copy}</p>
		</div>
	</footer>
</section>

<style>
	:global(*, *::before, *::after) { box-sizing: border-box; }
	:global(html) { scroll-behavior: smooth; }
	:global(:root) {
		--blue: #3b4ae0;
		--blue-dark: #2834b8;
		--ink: #0a1033;
		--body: #425071;
		--muted: #6b7794;
		--line: #e3e8f2;
		--soft: #f6f8fc;
		--px: 4px;
		--pixel: 'Silkscreen', monospace;
		--mono: 'JetBrains Mono', ui-monospace, monospace;
	}
	:global(body) {
		margin: 0;
		background: #fff;
		color: var(--body);
		font-family: 'Inter', system-ui, sans-serif;
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
	}
	:global(::selection) { background: var(--blue); color: #fff; }

	h1, h2, h3 { color: var(--ink); letter-spacing: -0.03em; }
	h2 { font-size: clamp(2rem, 5vw, 3.25rem); line-height: 1.05; margin: 0.3em 0 0.7em; font-weight: 700; }
	h3 { font-size: 1.1rem; margin: 0.9em 0 0.3em; font-weight: 600; letter-spacing: -0.01em; }
	p { margin: 0; }
	a { color: var(--blue); }
	.wrap { width: min(1120px, 100% - 2.5rem); margin-inline: auto; }
	.h-wide { max-width: 16ch; }
	.kicker { font-family: var(--mono); font-size: 0.85rem; color: var(--blue); font-weight: 500; }
	.kicker-light { color: #aeb8ff; }

	/* logo */
	.logo { display: inline-flex; align-items: center; gap: 0.55rem; font-family: var(--pixel); font-weight: 700; font-size: 1.4rem; color: var(--ink); text-decoration: none; }
	.mark {
		width: 18px; height: 18px; flex-shrink: 0;
		background:
			linear-gradient(var(--blue) 0 0) 0 0 / 6px 6px no-repeat,
			linear-gradient(var(--blue) 0 0) 12px 0 / 6px 6px no-repeat,
			linear-gradient(var(--blue) 0 0) 6px 6px / 6px 6px no-repeat,
			linear-gradient(#8fb7ff 0 0) 0 12px / 6px 6px no-repeat,
			linear-gradient(#8fb7ff 0 0) 12px 12px / 6px 6px no-repeat;
	}
	.logo.small { font-size: 1rem; }

	/* nav */
	.nav {
		position: fixed; inset: 0 0 auto; z-index: 20;
		display: flex; justify-content: space-between; align-items: center;
		padding: 0.85rem clamp(1rem, 4vw, 2.5rem);
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: saturate(1.6) blur(14px);
		border-bottom: 1px solid rgba(227, 232, 242, 0.8);
	}
	.links { display: flex; gap: 1.75rem; align-items: center; }
	.links a { color: var(--ink); text-decoration: none; font-size: 0.92rem; font-weight: 500; opacity: 0.8; }
	.links a:hover { opacity: 1; }
	.links .nav-cta { opacity: 1; background: var(--ink); color: #fff; padding: 0.45rem 0.95rem; border-radius: 999px; font-weight: 600; }
	.links .nav-cta:hover { background: var(--blue); }
	@media (max-width: 720px) { .links a:not(.nav-cta) { display: none; } .links { gap: 0.75rem; } }
	.lang { display: inline-flex; padding: 3px; border: 1px solid var(--line); border-radius: 999px; background: #fff; }
	.lang button { font: 600 0.75rem var(--mono); color: var(--muted); background: none; border: 0; padding: 0.25rem 0.55rem; border-radius: 999px; cursor: pointer; }
	.lang button.active { background: var(--blue); color: #fff; }

	/* hero */
	.hero { position: relative; min-height: 100svh; display: grid; place-items: center; overflow: hidden; background: #fff; }
	.grid-bg {
		position: absolute; inset: 0;
		background-image:
			linear-gradient(var(--line) 1px, transparent 1px),
			linear-gradient(90deg, var(--line) 1px, transparent 1px);
		background-size: 64px 64px;
		mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%);
		opacity: 0.7;
	}
	.glow {
		position: absolute; inset: -20% -10% auto; height: 80%;
		background:
			radial-gradient(40% 50% at 78% 20%, rgba(59, 74, 224, 0.22), transparent 70%),
			radial-gradient(35% 45% at 18% 10%, rgba(80, 200, 255, 0.2), transparent 70%),
			radial-gradient(30% 40% at 55% 0%, rgba(160, 110, 255, 0.14), transparent 70%);
		filter: blur(20px);
	}
	.hero-content { position: relative; z-index: 1; text-align: center; padding: 7rem 1.25rem 10rem; display: flex; flex-direction: column; align-items: center; }
	.pill {
		display: inline-flex; align-items: center; gap: 0.6rem;
		padding: 0.3rem 0.85rem 0.3rem 0.3rem; border-radius: 999px;
		background: rgba(255, 255, 255, 0.85); border: 1px solid var(--line);
		box-shadow: 0 1px 2px rgba(10, 16, 51, 0.06);
		color: var(--ink); font-size: 0.85rem; font-weight: 500; text-decoration: none;
	}
	.pill-tag { font-family: var(--pixel); font-size: 0.7rem; background: var(--blue); color: #fff; padding: 0.15rem 0.5rem; border-radius: 999px; }
	.wordmark {
		font-family: var(--pixel); font-weight: 700;
		font-size: clamp(4.5rem, 18vw, 10rem); line-height: 1;
		margin: 0.4em 0 0.1em; color: var(--blue);
		text-shadow: 6px 6px 0 #c9d4ff;
	}
	h1 { font-size: clamp(2.6rem, 8vw, 5.25rem); line-height: 1; margin: 0.15em 0 0.35em; font-weight: 800; letter-spacing: -0.045em; }
	.br-m { display: none; }
	@media (max-width: 420px) { .br-m { display: inline; } }
	.lead { max-width: 34rem; font-size: clamp(1rem, 2.2vw, 1.2rem); color: var(--body); background: rgba(255, 255, 255, 0.6); }
	.ctas { display: flex; gap: 1.5rem; align-items: center; margin-top: 2.25rem; flex-wrap: wrap; justify-content: center; }
	.cta-anchor { display: inline-block; }
	.link-arrow { color: var(--ink); font-weight: 600; text-decoration: none; background: rgba(255,255,255,0.7); }
	.link-arrow:hover { color: var(--blue); }

	.btn {
		display: inline-block;
		font-family: var(--pixel); font-weight: 700;
		font-size: clamp(1rem, 3vw, 1.2rem);
		color: #fff; background: var(--blue);
		text-decoration: none; border: 0; cursor: pointer;
		padding: 0.85em 1.7em;
		box-shadow:
			0 calc(var(--px) * -1) 0 var(--blue),
			0 var(--px) 0 var(--blue),
			calc(var(--px) * -1) 0 0 var(--blue),
			var(--px) 0 0 var(--blue),
			0 calc(var(--px) * 2) 0 var(--blue-dark),
			var(--px) var(--px) 0 var(--blue-dark),
			calc(var(--px) * -1) var(--px) 0 var(--blue-dark),
			0 18px 40px -12px rgba(59, 74, 224, 0.6);
	}
	.btn:hover { filter: brightness(1.1); }
	.btn:focus-visible { outline: 3px solid var(--ink); outline-offset: 10px; }
	.btn-block { width: 100%; margin-top: 0.5rem; }

	/* blue product band */
	.blue { background: var(--blue); color: #e3e8ff; padding: 2rem 0 5rem; }
	.product { display: grid; grid-template-columns: 1fr 1.05fr; gap: 3rem; align-items: center; margin-top: 5rem; }
	@media (max-width: 880px) { .product { grid-template-columns: 1fr; margin-top: 3.5rem; } }
	.product h2 { color: #fff; }
	.product-copy p { color: #d4daff; font-size: 1.05rem; }
	.strike { text-decoration: line-through; text-decoration-color: #ff6b81; text-decoration-thickness: 0.12em; opacity: 0.75; }

	.mock { position: relative; min-height: 400px; }
	.terminal {
		position: absolute; left: 0; top: 10px; width: 58%;
		background: linear-gradient(160deg, #4b4f58, #24262c 60%, #17181c);
		border-radius: 22px 22px 32px 32px; padding: 18px 18px 26px;
		box-shadow: inset 0 2px 1px rgba(255, 255, 255, 0.18), inset 0 -6px 12px rgba(0, 0, 0, 0.5), 0 40px 60px -20px rgba(10, 16, 51, 0.7);
		transform: rotate(-8deg);
	}
	.term-screen {
		display: flex; gap: 0.8rem; align-items: center;
		background: linear-gradient(180deg, #e9ecef, #cfd4da); border-radius: 8px; padding: 1rem;
		box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.35);
		font-family: var(--mono); color: #222;
	}
	.term-screen strong { display: block; font-size: 0.85rem; letter-spacing: 0.04em; }
	.term-screen span { font-size: 0.72rem; }
	.term-screen .x { flex-shrink: 0; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: #e5484d; color: #fff; font-weight: 700; }
	.keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
	.keys span { height: 22px; border-radius: 6px; background: linear-gradient(#6a6e78, #3d4048); box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 0 #111; }
	.keys .red { background: linear-gradient(#d9534f, #8f2422); }
	.keys .green { background: linear-gradient(#3fb36b, #1d6d3c); }

	.checkout {
		position: absolute; right: 0; top: 70px; width: 64%;
		background: #fff; color: var(--body);
		border-radius: 16px; padding: 1.4rem;
		box-shadow: 0 50px 100px -20px rgba(10, 16, 51, 0.45), 0 30px 60px -30px rgba(0, 0, 0, 0.4);
	}
	.checkout::before {
		/* pixel water dripping off the card edge */
		content: ''; position: absolute; left: -10px; top: -10px; width: 60px; height: 40px;
		background:
			linear-gradient(#fff 0 0) 10px 0 / 30px 10px no-repeat,
			linear-gradient(#cfe4ff 0 0) 0 10px / 20px 10px no-repeat,
			linear-gradient(#fff 0 0) 20px 10px / 30px 10px no-repeat;
		outline: 0;
		filter: drop-shadow(2px 0 0 var(--blue-dark)) drop-shadow(-2px 0 0 var(--blue-dark)) drop-shadow(0 -2px 0 var(--blue-dark));
	}
	.co-head { display: flex; justify-content: space-between; align-items: center; }
	.badge { display: inline-flex; gap: 0.35rem; align-items: center; font-size: 0.75rem; font-weight: 600; color: #0e9f6e; background: #e7f8f0; padding: 0.2rem 0.6rem; border-radius: 999px; }
	.co-label { margin-top: 1.1rem; font-size: 0.8rem; color: var(--muted); }
	.co-amount { font-size: 2rem; font-weight: 700; color: var(--ink); letter-spacing: -0.03em; }
	.co-rows { margin-top: 0.9rem; border-top: 1px solid var(--line); }
	.co-rows div { display: flex; justify-content: space-between; padding: 0.55rem 0; border-bottom: 1px solid var(--line); font-size: 0.88rem; }
	.co-rows strong { color: var(--ink); font-variant-numeric: tabular-nums; }
	.co-bar { height: 8px; background: var(--soft); margin: 1rem 0; overflow: hidden; }
	.co-bar span {
		display: block; height: 100%; transition: width 0.4s steps(6);
		background: repeating-linear-gradient(90deg, var(--blue) 0 8px, #6d7bff 8px 16px);
	}
	.co-btn { width: 100%; font: 600 0.95rem 'Inter', sans-serif; color: #fff; background: var(--ink); border: 0; border-radius: 10px; padding: 0.8rem; cursor: default; }
	@media (max-width: 520px) {
		.mock { min-height: 470px; }
		.terminal { width: 78%; }
		.checkout { width: 86%; top: 130px; }
	}

	/* content sections */
	.section { padding: clamp(4rem, 9vw, 7rem) 0; }
	.soft { background: var(--soft); border-block: 1px solid var(--line); }

	.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; border-top: 1px solid var(--line); padding-top: 2rem; }
	@media (max-width: 960px) { .stats { grid-template-columns: 1fr; gap: 1.5rem; } }
	.stat { padding-left: 1rem; border-left: var(--px) solid var(--blue); }
	.stat-v { font-weight: 700; font-size: clamp(2.2rem, 4vw, 3rem); line-height: 1; letter-spacing: -0.04em; color: var(--ink); }
	.stat-v span { display: inline-block; letter-spacing: 0; font-size: 1rem; color: var(--muted); margin-left: 0.4rem; font-weight: 500; }
	.stat-l { margin-top: 0.6rem; max-width: 24ch; }

	.card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 1.6rem; box-shadow: 0 1px 2px rgba(10, 16, 51, 0.04), 0 12px 32px -16px rgba(10, 16, 51, 0.15); transition: transform 0.2s, box-shadow 0.2s; }
	.card:hover { transform: translateY(-4px); box-shadow: 0 1px 2px rgba(10, 16, 51, 0.04), 0 24px 48px -20px rgba(59, 74, 224, 0.35); }
	.steps { list-style: none; padding: 0; margin: 0; display: grid; gap: 1.5rem; grid-template-columns: repeat(3, 1fr); }
	@media (max-width: 860px) { .steps { grid-template-columns: 1fr; } }
	.step-top { display: flex; justify-content: space-between; align-items: center; }
	.step-icon { display: grid; place-items: center; width: 52px; height: 52px; background: #eef0ff; border-radius: 12px; }
	.step-n { font-family: var(--pixel); color: #c9d0f5; font-size: 1.6rem; }



	.avatar { flex-shrink: 0; width: 42px; height: 42px; display: grid; place-items: center; background: var(--blue); color: #fff; font-family: var(--pixel); font-size: 0.85rem; box-shadow: 4px 4px 0 #c9d4ff; }

	/* contact + footer (dark) */
	.contact { background: var(--ink); color: #c7cdea; padding-top: clamp(3rem, 7vw, 5rem); }
	.contact h2 { color: #fff; }
	.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; padding-bottom: 5rem; }
	@media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr; } }
	.muted-light { color: #a9b1d6; font-size: 1.05rem; }
	.contact-list { list-style: none; padding: 0; margin: 2rem 0 0; }
	.contact-list li { display: flex; gap: 1rem; padding: 0.8rem 0; border-bottom: 1px solid #1f2752; }
	.contact-list span { width: 5rem; flex-shrink: 0; font-family: var(--mono); font-size: 0.85rem; color: #7f8cff; }
	.contact-list a { color: #fff; text-decoration: none; }
	.form { display: grid; gap: 1rem; background: #fff; color: var(--body); border-radius: 16px; padding: clamp(1.25rem, 4vw, 2rem); box-shadow: 0 50px 100px -30px rgba(0, 0, 0, 0.6); }
	.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	@media (max-width: 480px) { .row2 { grid-template-columns: 1fr; } }
	label { display: grid; gap: 0.35rem; font-size: 0.82rem; font-weight: 500; color: var(--ink); }
	input, select, textarea {
		font: 400 0.95rem 'Inter', sans-serif; color: var(--ink);
		background: #fff; border: 1px solid #d5dbe8; border-radius: 8px;
		padding: 0.7rem 0.8rem; width: 100%;
		box-shadow: 0 1px 2px rgba(10, 16, 51, 0.05);
		transition: border-color 0.15s, box-shadow 0.15s;
	}
	input:focus, select:focus, textarea:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 4px rgba(59, 74, 224, 0.15); }
	.sent { text-align: center; padding: 3rem 0; display: grid; justify-items: center; }

	.footer { border-top: 1px solid #1f2752; padding: 3.5rem 0 2rem; font-size: 0.85rem; }
	.logo-light { color: #fff; }
	.footer-top { display: flex; gap: 2rem; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 2.5rem; }
	.footer-top p { max-width: 520px; color: #8d96c0; }
	.copy { color: #5d6796; margin-top: 2.5rem; text-align: center; }

	.stat-word { font-size: clamp(1.8rem, 4vw, 2.4rem); }
	.trap { margin-top: 3rem; padding: 2rem; background: var(--blue); color: #e3e8ff; border-radius: 14px; }
	.trap h3 { color: #ffd23f; font-family: var(--pixel); margin-top: 0; font-size: 1.4rem; }
	.note { margin-top: 2.5rem; font-size: 0.9rem; }
	.sources { margin: 0.5rem 0 0; padding-left: 1.2rem; font-size: 0.85rem; }
	.steps-4 { grid-template-columns: repeat(4, 1fr); }
	@media (max-width: 1000px) { .steps-4 { grid-template-columns: repeat(2, 1fr); } }
	@media (max-width: 600px) { .steps-4 { grid-template-columns: 1fr; } }
	.col-h { font-family: var(--pixel); color: var(--blue); margin-top: 0; }
	.list { margin: 0; padding-left: 1.1rem; display: grid; gap: 0.6rem; }
	.diff { display: grid; grid-template-columns: 1fr 1.6fr; gap: 1.5rem; margin-top: 1.5rem; }
	@media (max-width: 800px) { .diff { grid-template-columns: 1fr; } }
	.card-blue { background: var(--blue); color: #e3e8ff; border-color: var(--blue); }
	.card-blue .col-h { color: #ffd23f; }
	.card-blue :global(strong) { color: #fff; }
	.step-n-blue { color: var(--blue); }
	.limits { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem; align-items: center; }
	@media (max-width: 800px) { .limits { grid-template-columns: 1fr; } }
	.bars { margin: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; align-items: end; height: 260px; background: var(--blue); border-radius: 14px; padding: 2.5rem 1.5rem 0.75rem; position: relative; }
	.bar-col { display: flex; flex-direction: column; justify-content: flex-end; height: 100%; text-align: center; gap: 0.4rem; }
	.bar { display: block; background: #eef0ff; border-radius: 6px 6px 0 0; }
	.bar.first { background: #ffd23f; }
	.bar-col small { color: #d4daff; font-size: 0.7rem; line-height: 1.2; min-height: 2.4em; }
	.bars figcaption { position: absolute; top: 0.8rem; left: 1.5rem; color: #c3cbff; font-size: 0.75rem; }
	.table { padding: 0.5rem 1.6rem; }
	.table:hover { transform: none; }
	.trow { display: grid; grid-template-columns: 1fr 1.3fr 1.3fr; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--line); }
	.trow:last-child { border-bottom: 0; }
	.trow strong { color: var(--ink); }
	.trow em { font-style: normal; font-weight: 600; color: var(--blue); text-align: right; }
	@media (max-width: 640px) { .trow { grid-template-columns: 1fr; gap: 0.2rem; } .trow em { text-align: left; } }
	.seed { display: flex; gap: 2rem; align-items: center; margin-top: 1.5rem; background: var(--blue); color: #e3e8ff; border-radius: 14px; padding: 1.5rem 2rem; }
	.seed span { font-size: clamp(2.2rem, 5vw, 3rem); font-weight: 800; color: #fff; letter-spacing: -0.03em; }
	@media (max-width: 560px) { .seed { flex-direction: column; align-items: flex-start; gap: 0.5rem; } }
	.risks { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.6rem; }
	.risks li { background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 0.8rem 1.2rem; color: var(--ink); }
	.risks span { font-weight: 700; color: var(--blue); margin-right: 1.2rem; }
	.goal { margin-top: 1.2rem; background: var(--blue); color: #fff; border-radius: 12px; padding: 1.2rem 1.5rem; }
	.blue-sec { background: var(--blue); color: #e3e8ff; }
	.blue-sec h3 { color: #ffd23f; margin-top: 2.5rem; }
	.vision { color: #fff; font-family: var(--pixel); font-size: clamp(1.6rem, 4vw, 2.6rem); line-height: 1.25; max-width: 28ch; }
	.values { list-style: none; padding: 0; margin: 0.5rem 0 0; display: flex; flex-wrap: wrap; gap: 0.6rem; }
	.values li { font-family: var(--pixel); background: #fff; color: var(--blue); padding: 0.4rem 0.9rem; border-radius: 8px; }
	.contact-list span { width: 6rem; }

	@media (prefers-reduced-motion: reduce) {
		:global(html) { scroll-behavior: auto; }
		.card, .co-bar span { transition: none; }
	}
</style>
