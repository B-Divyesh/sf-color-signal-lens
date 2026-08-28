import './style.css';
import { detectStatusName, parseHex, rgbToHex, sampleSvg, svgDataUrl, type LensMode, type Rgb } from './lens';

declare const __SITE_BUILD__: boolean;

type Source = { url: string; name: string; kind: 'sample' | 'file' | 'capture' };
const app = document.querySelector<HTMLDivElement>('#app')!;
const siteBuild = __SITE_BUILD__;
let source: Source | null = null;
let mode: LensMode = 'patterns';
let target: Rgb = parseHex('#9c2d20');
let mapping: 'blue' | 'orange' = 'blue';
let imageReady = false;
let selectedPoint: { x: number; y: number } | null = null;
let demo = location.pathname === '/demo' || location.search.includes('demo=1');

const esc = (text: string) => text.replace(/[&<>"]/g, (v) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[v]!));
const lensName = () => detectStatusName(target);
const asset = (path: string) => siteBuild ? `./${path.replace(/^\//, '')}` : path;

function pageTitle(title: string) {
  document.title = title;
  const heading = document.querySelector<HTMLElement>('h1');
  heading?.focus();
  document.querySelector('#route-announcement')!.textContent = title;
}

function layout(content: string, route: string) {
  app.innerHTML = `
    <a class="skip" href="#main">Skip to main content</a>
    <header class="topbar"><a class="wordmark" href="/" data-nav>Color<br>Signal<br>Lens</a>
      <nav aria-label="Main navigation"><a href="/demo" data-nav>Demo</a><a href="/#how" data-nav>How it works</a><a href="/privacy" data-nav>Privacy</a></nav>
    </header>
    <div id="route-announcement" class="sr-only" aria-live="polite"></div>
    <main id="main" tabindex="-1">${content}</main>
    <footer><p>Color Signal Lens makes screenshot status signals easier to read.</p><p><a href="/privacy" data-nav>Privacy</a> · <a href="/terms" data-nav>Terms</a> · Built by Param Factory · v0.1.0</p></footer>`;
  wireNavigation();
  pageTitle(route);
}

function renderLanding() {
  layout(`
  <section class="hero paper-edge"><div class="hero-copy"><p class="eyebrow">PRIVATE DESKTOP UTILITY</p><h1>Make status colors distinct.</h1><p class="lede">For people who cannot rely on red and green during code reviews, charts, or status screens.</p>
  <div class="hero-actions"><a class="button primary" href="/demo" data-nav>Try it with sample data</a><span>See a diff lens open with nothing saved.</span></div>
  <ul class="facts"><li>Works from a screenshot</li><li>Runs on your device</li><li>Lens Plus: $12 once</li></ul></div>
  <figure class="hero-art"><img src="${asset('/paper-cut-lens.webp')}" width="1200" height="800" fetchpriority="high" decoding="async" alt="A paper-cut software panel viewed through a large circular lens with blue and orange status marks."></figure></section>
  <section class="live-preview" aria-labelledby="preview-title"><div><p class="eyebrow">A SMALL, LOCAL LAYER</p><h2 id="preview-title">Pick one signal. Make it readable.</h2><p>Open a screenshot, click a colour, then add labels, patterns, or a blue-orange remap.</p><a class="text-link" href="/demo" data-nav>Open the sample diff →</a></div><div class="preview-swatch"><span class="dot orange"></span><span class="stripe"></span><b>Removed</b><span class="dot blue"></span><span class="dots"></span><b>Added</b></div></section>
  <section id="how" class="how"><p class="eyebrow">HOW IT WORKS</p><h2>Read the signal, not a global filter.</h2><ol><li><span>01</span><h3>Open a screenshot</h3><p>Use a file, paste an image, or capture a screen only when you choose.</p></li><li><span>02</span><h3>Choose a colour</h3><p>Click the signal that is hard to read. The original image stays in place.</p></li><li><span>03</span><h3>Add another cue</h3><p>Show a plain label, a pattern, or a blue-orange remap over that signal.</p></li></ol></section>
  <section class="limits paper-edge"><div><p class="eyebrow">WHAT IT DOES NOT DO</p><h2>It does not correct vision or change other apps.</h2><p>It helps you inspect a selected image or capture. Screen content stays on your device unless you choose a file yourself.</p></div><a class="button secondary" href="/privacy" data-nav>Read privacy details</a></section>
  <section class="plus"><p class="eyebrow">LENS PLUS</p><h2>Save custom lenses for $12 once.</h2><p>The free lens includes screenshot reading, labels, patterns, and remapping. Plus saves named presets.</p><a class="button primary" href="https://api.sociobot.in/api/v1/products/color-signal-lens/checkout">Buy Lens Plus</a><button class="link-button" id="restore-license">Have a license?</button><div id="license-area"></div></section>
  <section class="install"><p class="eyebrow">DESKTOP APP</p><h2>Install the lens on your computer.</h2><p id="download-state">Downloads are being published. <a href="https://github.com/B-Divyesh/sf-color-signal-lens/releases">Open the release page</a>.</p><a id="download-button" class="button secondary" href="https://github.com/B-Divyesh/sf-color-signal-lens/releases">See downloads</a><p class="download-note">Installers are unsigned. Your computer may ask you to confirm the app.</p></section>`, 'Color Signal Lens — Make status colors distinct');
  document.querySelector('#restore-license')?.addEventListener('click', showRestore);
  acceptLicense();
  hydrateDownload();
}

function renderDemo() {
  if (!source) source = { url: svgDataUrl, name: 'checkout-totals.diff.png', kind: 'sample' };
  localStorage.setItem('demo:color-signal-lens:started', '1');
  layout(`<aside class="demo-banner" role="status"><b>Demo — sample data, nothing is saved</b><span><button id="reset-demo">Reset demo</button><button id="start-real">Start for real</button></span></aside>${workspace()}`, 'Demo — Color Signal Lens');
  wireWorkspace();
}

function workspace() {
  return `<section class="lens-shell"><div class="lens-heading"><p class="eyebrow">READING LAYER</p><h1>Inspect a screenshot signal.</h1><p>Click a colour in the image. Then choose how the lens marks it.</p></div>
  <div class="source-actions"><button class="button primary" id="load-sample">Load sample diff</button><label class="button secondary" for="file-input">Open screenshot<input id="file-input" type="file" accept="image/png,image/jpeg,image/webp" hidden></label><button class="button secondary" id="capture-screen">Capture screen region</button><p id="source-status" aria-live="polite">${esc(source?.name || 'No screenshot loaded.')}</p></div>
  <p class="permission-note">Capture asks for screen permission only when you press it. The image stays on this device.</p>
  <div class="work-grid"><section class="canvas-paper" aria-label="Screenshot lens"><div class="canvas-wrap"><canvas id="lens-canvas" width="1200" height="720" aria-label="Screenshot. Click a colour to select it." tabindex="0"></canvas><div id="canvas-empty" class="canvas-empty" ${source ? 'hidden' : ''}><p>No screenshot is open.</p><button id="empty-sample">Load sample diff</button></div></div><p class="canvas-help">Keyboard: use the colour field below, then press Apply selected colour.</p></section>
  <aside class="controls paper-edge" aria-label="Lens controls"><h2>Lens controls</h2><label for="color-input">Selected colour</label><div class="colour-input"><input id="color-input" type="color" value="${rgbToHex(target)}"><output id="color-value">${rgbToHex(target).toUpperCase()}</output></div><button class="button secondary full" id="apply-colour">Apply selected colour</button>
  <fieldset><legend>Reading cue</legend><label><input type="radio" name="mode" value="labels" ${mode === 'labels' ? 'checked' : ''}> Label the signal</label><label><input type="radio" name="mode" value="patterns" ${mode === 'patterns' ? 'checked' : ''}> Add a pattern</label><label><input type="radio" name="mode" value="remap" ${mode === 'remap' ? 'checked' : ''}> Remap the colour</label></fieldset>
  <fieldset id="mapping-options" ${mode === 'remap' ? '' : 'hidden'}><legend>Remap to</legend><label><input type="radio" name="mapping" value="blue" ${mapping === 'blue' ? 'checked' : ''}> Blue</label><label><input type="radio" name="mapping" value="orange" ${mapping === 'orange' ? 'checked' : ''}> Orange</label></fieldset>
  <div class="meaning"><span class="cue-icon ${mode}"></span><div><b id="meaning-name">${lensName()}</b><p id="meaning-copy">${mode === 'labels' ? 'A text label marks the selected signal.' : mode === 'patterns' ? 'A pattern sits over the selected signal.' : 'The selected signal is remapped.'}</p></div></div>${premiumPanel()}<button id="clear-lens" class="link-button">Clear lens</button></aside></div></section>`;
}

function draw() {
  const canvas = document.querySelector<HTMLCanvasElement>('#lens-canvas');
  if (!canvas || !source) return;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  const image = new Image();
  image.onload = () => {
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    context.drawImage(image, 0, 0);
    imageReady = true;
    applyLens(context, canvas);
  };
  image.src = source.url;
}

function applyLens(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  if (!imageReady || !source) return;
  const image = new Image();
  image.onload = () => {
    context.clearRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    const targetDistance = 76;
    if (mode === 'remap') {
      const next = mapping === 'blue' ? [7, 90, 134] : [169, 73, 0];
      for (let i = 0; i < data.data.length; i += 4) { const dr = data.data[i] - target.r; const dg = data.data[i + 1] - target.g; const db = data.data[i + 2] - target.b; if (Math.sqrt(dr * dr + dg * dg + db * db) < targetDistance) { data.data[i] = next[0]; data.data[i + 1] = next[1]; data.data[i + 2] = next[2]; } }
      context.putImageData(data, 0, 0);
    } else {
      context.save(); context.globalAlpha = 0.68;
      for (let y = 0; y < canvas.height; y += 6) for (let x = 0; x < canvas.width; x += 6) { const i = (y * canvas.width + x) * 4; const dr = data.data[i] - target.r; const dg = data.data[i + 1] - target.g; const db = data.data[i + 2] - target.b; if (Math.sqrt(dr * dr + dg * dg + db * db) < targetDistance) { context.fillStyle = mode === 'patterns' ? ((x + y) % 18 < 9 ? '#fff8e8' : '#17232e') : '#fff8e8'; context.fillRect(x, y, 6, 6); } }
      context.restore();
      if (mode === 'labels' && selectedPoint) { context.fillStyle = '#17232e'; context.fillRect(selectedPoint.x, Math.max(0, selectedPoint.y - 48), 270, 40); context.fillStyle = '#fff8e8'; context.font = 'bold 22px Arial'; context.fillText(lensName(), selectedPoint.x + 12, Math.max(27, selectedPoint.y - 21)); }
    }
  };
  image.src = source.url;
}

function wireWorkspace() {
  draw();
  const canvas = document.querySelector<HTMLCanvasElement>('#lens-canvas')!;
  canvas.addEventListener('click', (event) => pickAt(event.offsetX, event.offsetY));
  canvas.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); document.querySelector<HTMLInputElement>('#color-input')?.focus(); } });
  document.querySelector('#load-sample')?.addEventListener('click', loadSample);
  document.querySelector('#empty-sample')?.addEventListener('click', loadSample);
  document.querySelector<HTMLInputElement>('#file-input')?.addEventListener('change', openFile);
  document.querySelector('#capture-screen')?.addEventListener('click', captureScreen);
  document.querySelector<HTMLInputElement>('#color-input')?.addEventListener('input', (event) => { target = parseHex((event.target as HTMLInputElement).value); document.querySelector('#color-value')!.textContent = rgbToHex(target).toUpperCase(); });
  document.querySelector('#apply-colour')?.addEventListener('click', () => { selectedPoint = null; refreshLens(); });
  document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach((input) => input.addEventListener('change', () => { mode = input.value as LensMode; refreshLens(true); }));
  document.querySelectorAll<HTMLInputElement>('input[name="mapping"]').forEach((input) => input.addEventListener('change', () => { mapping = input.value as 'blue' | 'orange'; refreshLens(); }));
  document.querySelector('#clear-lens')?.addEventListener('click', () => { source && (mode = 'patterns'); selectedPoint = null; target = parseHex('#9c2d20'); refreshLens(true); });
  document.querySelector('#save-preset')?.addEventListener('click', savePreset);
  document.querySelector('#reset-demo')?.addEventListener('click', () => { localStorage.removeItem('demo:color-signal-lens:started'); source = { url: svgDataUrl, name: 'checkout-totals.diff.png', kind: 'sample' }; target = parseHex('#9c2d20'); mode = 'patterns'; renderDemo(); });
  document.querySelector('#start-real')?.addEventListener('click', () => { localStorage.removeItem('demo:color-signal-lens:started'); demo = false; history.pushState({}, '', '/lens'); renderLens(); });
  document.addEventListener('paste', pasteImage, { once: true });
}

function pickAt(x: number, y: number) {
  if (!source) return;
  const canvas = document.querySelector<HTMLCanvasElement>('#lens-canvas')!;
  const original = new Image();
  original.onload = () => { const reader = document.createElement('canvas'); reader.width = original.naturalWidth; reader.height = original.naturalHeight; const context = reader.getContext('2d')!; context.drawImage(original, 0, 0); const p = context.getImageData(Math.min(x, canvas.width - 1), Math.min(y, canvas.height - 1), 1, 1).data; target = { r: p[0], g: p[1], b: p[2] }; selectedPoint = { x, y }; refreshLens(); };
  original.src = source.url;
}

function refreshLens(repaint = false) { if (repaint) renderDemo(); else { document.querySelector('#color-input') && ((document.querySelector('#color-input') as HTMLInputElement).value = rgbToHex(target)); document.querySelector('#color-value')!.textContent = rgbToHex(target).toUpperCase(); document.querySelector('#meaning-name')!.textContent = lensName(); document.querySelector('#meaning-copy')!.textContent = mode === 'labels' ? 'A text label marks the selected signal.' : mode === 'patterns' ? 'A pattern sits over the selected signal.' : 'The selected signal is remapped.'; draw(); } }
function rerenderWorkspace() { demo ? renderDemo() : renderLens(); }
function loadSample() { source = { url: svgDataUrl, name: 'checkout-totals.diff.png', kind: 'sample' }; rerenderWorkspace(); }
function openFile(event: Event) { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; source = { url: URL.createObjectURL(file), name: file.name, kind: 'file' }; rerenderWorkspace(); }
function pasteImage(event: ClipboardEvent) { const item = [...event.clipboardData!.items].find((candidate) => candidate.type.startsWith('image/')); if (!item) return; const file = item.getAsFile(); if (file) { source = { url: URL.createObjectURL(file), name: 'Pasted screenshot', kind: 'file' }; rerenderWorkspace(); } }
async function captureScreen() { const status = document.querySelector('#source-status')!; try { const tauri = (window as unknown as { __TAURI__?: { core: { invoke: (s: string) => Promise<string> } } }).__TAURI__; if (!tauri) throw new Error('Screen capture is available in the installed desktop app. Open a screenshot here instead.'); const url = await tauri.core.invoke('capture_primary_screen'); source = { url, name: 'Screen capture', kind: 'capture' }; renderDemo(); } catch (error) { status.textContent = error instanceof Error ? error.message : 'Capture did not complete. Open a screenshot instead.'; } }
function renderLens() { layout(workspace(), 'Color Signal Lens — Inspect a screenshot signal'); wireWorkspace(); }

function premiumPanel() { return localStorage.getItem('sb_license:color-signal-lens') ? `<div class="preset"><label for="preset-name">Lens Plus preset name</label><div class="preset-row"><input id="preset-name" maxlength="32" placeholder="Code review"><button id="save-preset" class="button secondary">Save preset</button></div><p id="preset-note" aria-live="polite">Saved presets stay on this device.</p></div>` : `<p class="plus-note"><a href="/" data-nav>Lens Plus</a> saves named presets. The reading controls stay free.</p>`; }
function savePreset() { const name = (document.querySelector<HTMLInputElement>('#preset-name')?.value || '').trim(); const note = document.querySelector('#preset-note')!; if (!name) { note.textContent = 'Name the preset, then save it.'; return; } const presets = JSON.parse(localStorage.getItem('color-signal-lens:presets') || '[]') as { name: string; colour: string; mode: LensMode; mapping: string }[]; presets.push({ name, colour: rgbToHex(target), mode, mapping }); localStorage.setItem('color-signal-lens:presets', JSON.stringify(presets.slice(-12))); note.textContent = `${name} is saved on this device.`; }

function renderPrivacy() { layout(`<article class="legal paper-edge"><p class="eyebrow">PRIVACY</p><h1>Your screenshot stays on this device.</h1><p>Color Signal Lens reads pixels in the image you open. It does not upload screenshots, record your screen, or use analytics.</p><h2>Local storage</h2><p>The demo uses a separate local browser key. Reset demo deletes it. A paid license, if you add one, is stored only in your browser so the app can remember it.</p><h2>Screen permission</h2><p>The installed app requests screen permission only after you press Capture screen region. You can use files or pasted screenshots instead.</p><p>Last updated: 28 August 2026.</p></article>`, 'Privacy — Color Signal Lens'); }
function renderTerms() { layout(`<article class="legal paper-edge"><p class="eyebrow">TERMS</p><h1>Use the lens to read your own screen.</h1><p>Color Signal Lens is an accessibility aid for inspecting images. It does not diagnose or correct colour vision.</p><h2>Lens Plus</h2><p>Lens Plus costs $12 as a one-time purchase. Sociobot and Dodo are the merchant of record. A refunded purchase may lose access to saved presets.</p><h2>Limits</h2><p>You are responsible for the screenshots you open. The app does not alter data in other apps.</p><p>Last updated: 28 August 2026.</p></article>`, 'Terms — Color Signal Lens'); }
function render404() { layout(`<article class="legal paper-edge"><p class="eyebrow">NOT FOUND</p><h1>This paper layer is missing.</h1><p>The page may have moved. Return to the lens and choose a screenshot.</p><a class="button primary" href="/" data-nav>Return home</a></article>`, 'Page not found — Color Signal Lens'); }

function showRestore() { const area = document.querySelector('#license-area')!; area.innerHTML = `<label for="license-input">Paste your license</label><div class="restore"><input id="license-input" autocomplete="off"><button class="button secondary" id="save-license">Restore license</button></div><p id="license-note" aria-live="polite"></p>`; document.querySelector('#save-license')?.addEventListener('click', () => { const value = (document.querySelector<HTMLInputElement>('#license-input')?.value || '').trim(); if (!value) return; localStorage.setItem('sb_license:color-signal-lens', value); document.querySelector('#license-note')!.textContent = 'License saved. It will be checked when you are online.'; void verifyLicense(value, document.querySelector('#license-note')!); }); }
function acceptLicense() { const params = new URLSearchParams(location.search); const value = params.get('license'); if (value) { localStorage.setItem('sb_license:color-signal-lens', value); params.delete('license'); history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}`); } const stored = localStorage.getItem('sb_license:color-signal-lens'); if (stored) void verifyLicense(stored); }
async function verifyLicense(license: string, note?: Element) { const key = 'sb_license_check:color-signal-lens'; const cache = JSON.parse(localStorage.getItem(key) || 'null') as { checked: number; valid: boolean } | null; if (cache && Date.now() - cache.checked < 86_400_000) { if (!cache.valid && note) note.textContent = 'This license is no longer active.'; return; } try { const response = await fetch(`https://api.sociobot.in/api/v1/products/color-signal-lens/verify?license=${encodeURIComponent(license)}`); const result = await response.json() as { valid: boolean }; localStorage.setItem(key, JSON.stringify({ checked: Date.now(), valid: result.valid })); if (!result.valid) { localStorage.removeItem('sb_license:color-signal-lens'); if (note) note.textContent = 'This license is no longer active. You can buy Lens Plus again.'; } else if (note) note.textContent = 'License is active.'; } catch { if (note) note.textContent = 'License saved. It will be checked when you are online.'; } }
async function hydrateDownload() { const state = document.querySelector('#download-state'); const button = document.querySelector<HTMLAnchorElement>('#download-button'); if (!state || !button) return; const cacheKey = 'color-signal-lens:release'; let release: { cached: number; assets: { name: string; browser_download_url: string }[] } | null = null; try { release = JSON.parse(localStorage.getItem(cacheKey) || 'null'); if (!release || Date.now() - release.cached > 3_600_000) { const response = await fetch('https://api.github.com/repos/B-Divyesh/sf-color-signal-lens/releases/latest'); if (!response.ok) throw new Error('No release'); const body = await response.json() as { assets: { name: string; browser_download_url: string }[] }; release = { cached: Date.now(), assets: body.assets }; localStorage.setItem(cacheKey, JSON.stringify(release)); } const agent = navigator.userAgent; const wanted = agent.includes('Windows') ? /\.msi$|\.exe$|windows.*\.zip$/i : agent.includes('Mac') ? /\.dmg$/i : /\.appimage$|\.deb$/i; const download = release.assets.find((item) => wanted.test(item.name)); if (!download) throw new Error('No matching download'); button.href = download.browser_download_url; button.textContent = `Download ${download.name}`; state.textContent = 'The current download matches your computer.'; } catch { /* The calm fallback remains visible while a release is unavailable. */ } }
function wireNavigation() { document.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((a) => a.addEventListener('click', (event) => { const href = a.getAttribute('href')!; if (!href.startsWith('/')) return; event.preventDefault(); history.pushState({}, '', href); renderRoute(); })); }
function renderRoute() { if (location.search.includes('demo=1')) { demo = true; renderDemo(); return; } if (!siteBuild && (location.pathname === '/' || location.pathname === '/lens')) { demo = false; renderLens(); return; } if (location.pathname === '/' ) renderLanding(); else if (location.pathname === '/demo') renderDemo(); else if (location.pathname === '/privacy') renderPrivacy(); else if (location.pathname === '/terms') renderTerms(); else render404(); }
window.addEventListener('popstate', renderRoute);
renderRoute();
