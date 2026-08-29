import './style.css';
import { containedBitmapPoint, detectStatusName, parseHex, rgbToHex, sampleSvg, svgDataUrl, type LensMode, type Rgb } from './lens';

declare const __SITE_BUILD__: boolean;

type Source = { url: string; name: string; kind: 'sample' | 'file' | 'capture' };
type LicenseVerdict = { checked: number; valid: boolean; license: string };
type LicenseResult = 'valid' | 'invalid' | 'unavailable';
type Preset = { id: string; name: string; colour: string; mode: LensMode; mapping: 'blue' | 'orange' };
type NativeTauri = { core?: { invoke?: <T>(command: string, args: Record<string, string>) => Promise<T> } };
const app = document.querySelector<HTMLDivElement>('#app')!;
const siteBuild = __SITE_BUILD__;
const nativeTauri = (window as Window & { __TAURI__?: NativeTauri }).__TAURI__;
const licenseKey = 'sb_license:color-signal-lens';
const licenseCheckKey = 'sb_license_check:color-signal-lens';
let source: Source | null = null;
let mode: LensMode = 'patterns';
let target: Rgb = parseHex('#9c2d20');
let mapping: 'blue' | 'orange' = 'blue';
let imageReady = false;
let selectedPoint: { x: number; y: number } | null = null;
let demo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
let focusAfterRender = false;
let downloadHydration: AbortController | null = null;

const esc = (text: string) => text.replace(/[&<>"]/g, (v) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[v]!));
const lensName = () => detectStatusName(target);
const asset = (path: string) => siteBuild ? `./${path.replace(/^\//, '')}` : path;

const siteUrl = 'https://color-signal-lens.sociobot.in';
const pageMetadata: Record<string, { description: string }> = {
  '/': { description: 'Make screenshot status colors easier to tell apart with labels, patterns, and blue-orange colors.' },
  '/demo': { description: 'Try Color Signal Lens with a sample checkout screenshot. Demo data stays separate from your settings.' },
  '/lens': { description: 'Open a screenshot and mark one status color with a label, pattern, or blue-orange colors.' },
  '/privacy': { description: 'Read how Color Signal Lens handles screenshots, local storage, and screen permission.' },
  '/terms': { description: 'Read Color Signal Lens terms, product limits, and Lens Plus purchase details.' },
  '/404': { description: 'This Color Signal Lens page was not found. Return home to open a screenshot.' },
};
function pageTitle(title: string, path = location.pathname) {
  document.title = title;
  const meta = pageMetadata[path] || pageMetadata['/404'];
  const canonical = `${siteUrl}${path === '/404' ? '/404.html' : path}`;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = meta.description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = canonical;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = meta.description;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = title;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = meta.description;
  const heading = document.querySelector<HTMLElement>('h1');
  heading?.setAttribute('tabindex', '-1');
  if (focusAfterRender) heading?.focus();
  focusAfterRender = false;
  document.querySelector('#route-announcement')!.textContent = title;
}

function layout(content: string, route: string, path = location.pathname) {
  const howHref = siteBuild ? '/#how' : '/lens#how';
  app.innerHTML = `
    <a class="skip" href="#main">Skip to main content</a>
    <header class="topbar"><a class="wordmark" href="/" data-nav>Color<br>Signal<br>Lens</a>
      <nav aria-label="Main navigation"><a href="/demo" data-nav>Demo</a><a href="${howHref}" data-nav>How it works</a><a href="/privacy" data-nav>Privacy</a></nav>
    </header>
    <div id="route-announcement" class="sr-only" aria-live="polite"></div>
    <main id="main" tabindex="-1">${content}</main>
    <footer><p>Color Signal Lens makes screenshot status colors easier to read.</p><p><a href="/privacy" data-nav>Privacy</a> · <a href="/terms" data-nav>Terms</a> · Built by Param Factory · v0.1.10</p></footer>`;
  wireNavigation();
  document.querySelector<HTMLAnchorElement>('.skip')?.addEventListener('click', (event) => {
    event.preventDefault();
    const main = document.querySelector<HTMLElement>('#main');
    main?.scrollIntoView({ block: 'start' });
    main?.focus({ preventScroll: true });
  });
  pageTitle(route, path);
}

function renderLanding() {
  layout(`
  <section class="hero paper-edge"><div class="hero-copy"><p class="eyebrow">PRIVATE DESKTOP UTILITY</p><h1>Make status colors distinct.</h1><p class="lede">For people who cannot rely on red and green during code reviews, charts, or status screens.</p>
  <div class="hero-actions"><a class="button primary" href="/demo" data-nav>Try it with sample data</a><span>See a sample screenshot with an overlay. Nothing is saved.</span></div>
  <ul class="facts"><li>Screenshots are not uploaded</li><li>Free reader works offline after install</li><li>Lens Plus: $12 once</li></ul></div>
  <figure class="hero-art"><img src="${asset('/paper-cut-lens.webp')}" width="1200" height="800" fetchpriority="high" decoding="async" alt="A paper-cut software panel viewed through a large circular lens with blue and orange status marks."></figure></section>
  <section class="live-preview" aria-labelledby="preview-title"><div><p class="eyebrow">SCREENSHOT PREVIEW</p><h2 id="preview-title">Preview the screenshot changes.</h2><p>Open a screenshot, choose a status color, then add a label, pattern, or blue-orange colors.</p><a class="text-link" href="/demo" data-nav>Open the sample screenshot →</a></div><div class="preview-swatch"><span class="dot orange"></span><span class="stripe"></span><b>Removed</b><span class="dot blue"></span><span class="dots"></span><b>Added</b></div></section>
  <section id="how" class="how"><p class="eyebrow">HOW IT WORKS</p><h2>How Color Signal Lens works</h2><ol><li><span>01</span><img src="${asset('/walkthrough-open.png')}" width="640" height="400" loading="lazy" decoding="async" alt="Color Signal Lens with a sample checkout screenshot open."><h3>Open a screenshot</h3><p>Open a file, paste an image, or capture a screen region when you choose.</p></li><li><span>02</span><img src="${asset('/walkthrough-select.png')}" width="640" height="400" loading="lazy" decoding="async" alt="A green status color selected in the sample checkout screenshot."><h3>Choose a status color</h3><p>Click the color that is hard to tell apart.</p></li><li><span>03</span><img src="${asset('/walkthrough-remap.png')}" width="640" height="400" loading="lazy" decoding="async" alt="The selected green status color shown in blue with a pattern cue."><h3>Choose a reading cue</h3><p>Add a label, a pattern, or blue-orange colors over that status color.</p></li></ol></section>
  <section class="limits paper-edge"><div><p class="eyebrow">PRIVACY AND LIMITS</p><h2>It changes neither the screenshot nor your display.</h2><p>It processes only the image you open. It does not filter your whole display.</p></div><a class="button secondary" href="/privacy" data-nav>Read privacy details</a></section>
  <section class="plus"><p class="eyebrow">LENS PLUS</p><h2>Save named presets for $12 once.</h2><p>The free app includes screenshot reading, labels, patterns, and blue-orange colors. Lens Plus saves named presets.</p><p>Sociobot/Dodo is the merchant of record. Refunds are handled by Sociobot/Dodo. A refund revokes the license automatically.</p><a class="button primary" href="https://api.sociobot.in/api/v1/products/color-signal-lens/checkout">Buy Lens Plus</a><button class="link-button" id="restore-license">Restore license</button><div id="license-area"></div></section>
  <section class="install"><p class="eyebrow">DESKTOP APP</p><h2>Install Color Signal Lens.</h2><p id="download-state">Choose a download from the Releases page.</p><a id="download-button" class="button secondary" href="https://github.com/B-Divyesh/sf-color-signal-lens/releases">Open release downloads</a></section>`, 'Color Signal Lens — Make status colors distinct');
  wireLicenseActions();
  void acceptLicense();
  hydrateDownload();
}

function renderDemo() {
  demo = true;
  if (!source) source = { url: svgDataUrl, name: 'checkout-totals.diff.png', kind: 'sample' };
  localStorage.setItem('demo:color-signal-lens:started', '1');
  layout(`<aside class="demo-banner" role="status"><b>Demo — sample data, nothing is saved</b><span><button id="reset-demo">Reset demo</button><button id="start-real">Start for real</button></span></aside>${workspace(true)}`, 'Demo — Color Signal Lens', '/demo');
  wireWorkspace();
}

function workspace(isDemo = false) {
  const sourceActions = `<div class="source-actions">${isDemo ? '' : '<button class="button primary" id="load-sample">Load sample screenshot</button>'}<label class="button secondary file-picker" for="file-input">Open screenshot<input id="file-input" type="file" accept="image/png,image/jpeg,image/webp"></label><button class="button secondary" id="capture-screen">Capture screen region</button><p id="source-status" role="status" aria-live="polite">${esc(source?.name || 'No screenshot loaded.')}</p></div><p class="permission-note">Capture asks for screen permission only when you press it. Select a region before it is added. The screenshot stays on this device.</p>`;
  return `<section class="lens-shell ${isDemo ? 'demo-workspace' : ''}"><div class="lens-heading"><p class="eyebrow">${isDemo ? 'SAMPLE CHECKOUT SCREENSHOT' : 'SCREENSHOT READER'}</p><h1>${isDemo ? 'See the sample status colors.' : 'Inspect a screenshot status color.'}</h1><p id="demo-active-cue">${isDemo ? `Active cue: ${mode === 'patterns' ? 'Pattern for the removed status color.' : meaningCopy()}` : 'Click a status color in the image. Then choose how the overlay marks it.'}</p></div>
  ${isDemo ? '' : sourceActions}${isDemo ? '' : '<section id="how" class="desktop-how" aria-labelledby="desktop-how-title"><h2 id="desktop-how-title">How Color Signal Lens works</h2><ol><li>Open or paste a screenshot.</li><li>Choose the status color that is hard to read.</li><li>Add a label, pattern, or blue-orange colors.</li></ol></section>'}<div class="work-grid"><section class="canvas-paper" aria-label="Screenshot overlay"><div class="canvas-wrap"><canvas id="lens-canvas" width="1200" height="720" aria-label="Screenshot. Click a color to select it." tabindex="0"></canvas><div id="canvas-empty" class="canvas-empty" ${source ? 'hidden' : ''}><p>No screenshot is open.</p><button id="empty-sample">Load sample screenshot</button></div></div><p class="canvas-help">Keyboard: use the color field below, then press Apply selected color.</p></section>
  <aside class="controls paper-edge" aria-label="Overlay controls"><h2>Overlay controls</h2><label for="color-input">Selected color</label><div class="colour-input"><input id="color-input" type="color" value="${rgbToHex(target)}"><output id="color-value">${rgbToHex(target).toUpperCase()}</output></div><button class="button secondary full" id="apply-colour">Apply selected color</button>
  <fieldset><legend>Reading cue</legend><label><input type="radio" name="mode" value="labels" ${mode === 'labels' ? 'checked' : ''}> Add a label</label><label><input type="radio" name="mode" value="patterns" ${mode === 'patterns' ? 'checked' : ''}> Add a pattern</label><label><input type="radio" name="mode" value="remap" ${mode === 'remap' ? 'checked' : ''}> Use blue-orange colors</label></fieldset>
  <fieldset id="mapping-options" ${mode === 'remap' ? '' : 'hidden'}><legend>Remap to</legend><label><input type="radio" name="mapping" value="blue" ${mapping === 'blue' ? 'checked' : ''}> Blue</label><label><input type="radio" name="mapping" value="orange" ${mapping === 'orange' ? 'checked' : ''}> Orange</label></fieldset>
  <div class="meaning"><span class="cue-icon ${mode}"></span><div><b id="meaning-name">${mode === 'none' ? 'No reading cue' : lensName()}</b><p id="meaning-copy">${meaningCopy()}</p></div></div>${premiumPanel()}<button id="clear-lens" class="link-button">Clear overlay</button></aside></div>${isDemo ? sourceActions : ''}</section>`;
}

function meaningCopy() {
  if (mode === 'none') return 'The original screenshot is shown without an overlay.';
  if (mode === 'labels') return 'A text label marks the selected status color.';
  if (mode === 'patterns') return 'A pattern marks the selected status color.';
  return 'The selected status color uses blue-orange colors.';
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
    if (mode === 'none') return;
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
  canvas.addEventListener('click', (event) => {
    const bounds = canvas.getBoundingClientRect();
    const point = containedBitmapPoint(event, bounds, canvas);
    if (point) pickAt(point.x, point.y);
  });
  canvas.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); document.querySelector<HTMLInputElement>('#color-input')?.focus(); } });
  document.querySelector('#load-sample')?.addEventListener('click', loadSample);
  document.querySelector('#empty-sample')?.addEventListener('click', loadSample);
  document.querySelector<HTMLInputElement>('#file-input')?.addEventListener('change', (event) => { void openFile(event); });
  document.querySelector('#capture-screen')?.addEventListener('click', captureScreen);
  document.querySelector<HTMLInputElement>('#color-input')?.addEventListener('input', (event) => { target = parseHex((event.target as HTMLInputElement).value); document.querySelector('#color-value')!.textContent = rgbToHex(target).toUpperCase(); });
  document.querySelector('#apply-colour')?.addEventListener('click', () => { selectedPoint = null; refreshLens(); });
  document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach((input) => input.addEventListener('change', () => { mode = input.value as LensMode; refreshLens(); }));
  document.querySelectorAll<HTMLInputElement>('input[name="mapping"]').forEach((input) => input.addEventListener('change', () => { mapping = input.value as 'blue' | 'orange'; refreshLens(); }));
  document.querySelector('#clear-lens')?.addEventListener('click', () => { mode = 'none'; selectedPoint = null; refreshLens(); });
  wirePresetActions();
  wireLicenseActions();
  document.querySelector('#reset-demo')?.addEventListener('click', () => { localStorage.removeItem('demo:color-signal-lens:started'); localStorage.removeItem('demo:color-signal-lens:presets'); source = { url: svgDataUrl, name: 'checkout-totals.diff.png', kind: 'sample' }; target = parseHex('#9c2d20'); mode = 'patterns'; renderDemo(); });
  document.querySelector('#start-real')?.addEventListener('click', () => { localStorage.removeItem('demo:color-signal-lens:started'); source = null; selectedPoint = null; demo = false; focusAfterRender = true; history.pushState({}, '', '/lens'); renderLens(); });
  ensurePasteListener();
}

function pickAt(x: number, y: number) {
  if (!source) return;
  const canvas = document.querySelector<HTMLCanvasElement>('#lens-canvas')!;
  const original = new Image();
  original.onload = () => { const reader = document.createElement('canvas'); reader.width = original.naturalWidth; reader.height = original.naturalHeight; const context = reader.getContext('2d')!; context.drawImage(original, 0, 0); const bitmapX = Math.max(0, Math.min(Math.floor(x), canvas.width - 1)); const bitmapY = Math.max(0, Math.min(Math.floor(y), canvas.height - 1)); const p = context.getImageData(bitmapX, bitmapY, 1, 1).data; target = { r: p[0], g: p[1], b: p[2] }; selectedPoint = { x: bitmapX, y: bitmapY }; if (mode === 'none') mode = 'patterns'; refreshLens(); };
  original.src = source.url;
}

function refreshLens() {
  const colour = document.querySelector<HTMLInputElement>('#color-input');
  if (colour) colour.value = rgbToHex(target);
  const value = document.querySelector('#color-value');
  if (value) value.textContent = rgbToHex(target).toUpperCase();
  document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach((input) => { input.checked = input.value === mode; });
  const mappingOptions = document.querySelector<HTMLFieldSetElement>('#mapping-options');
  if (mappingOptions) mappingOptions.hidden = mode !== 'remap';
  const cue = document.querySelector<HTMLElement>('.cue-icon');
  if (cue) cue.className = `cue-icon ${mode}`;
  const name = document.querySelector('#meaning-name');
  if (name) name.textContent = mode === 'none' ? 'No reading cue' : lensName();
  const copy = document.querySelector('#meaning-copy');
  if (copy) copy.textContent = meaningCopy();
  const demoCue = document.querySelector('#demo-active-cue');
  if (demoCue && demo) demoCue.textContent = `Active cue: ${mode === 'patterns' ? 'Pattern for the selected status color.' : meaningCopy()}`;
  draw();
}
function rerenderWorkspace() { demo ? renderDemo() : renderLens(); }
function loadSample() { source = { url: svgDataUrl, name: 'checkout-totals.diff.png', kind: 'sample' }; rerenderWorkspace(); }
function setSourceStatus(message: string) { const status = document.querySelector('#source-status'); if (status) status.textContent = message; }
function isReadableImage(url: string) { return new Promise<boolean>((resolve) => { const image = new Image(); image.onload = () => resolve(true); image.onerror = () => resolve(false); image.src = url; }); }
async function useImage(url: string, name: string, kind: Source['kind']) {
  if (!await isReadableImage(url)) { if (url.startsWith('blob:')) URL.revokeObjectURL(url); setSourceStatus(`Could not open ${name}. Choose a valid PNG, JPEG, or WebP image.`); return false; }
  source = { url, name, kind }; rerenderWorkspace(); return true;
}
async function openFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  await useImage(url, file.name, 'file');
  input.value = '';
}
async function pasteImage(event: ClipboardEvent) {
  if (!document.querySelector('#lens-canvas')) return;
  const active = document.activeElement;
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active?.getAttribute('contenteditable') === 'true') return;
  const item = [...event.clipboardData!.items].find((candidate) => candidate.type.startsWith('image/'));
  const file = item?.getAsFile();
  if (file) await useImage(URL.createObjectURL(file), 'Pasted screenshot', 'file');
}
let pasteListenerAttached = false;
function ensurePasteListener() {
  if (pasteListenerAttached) return;
  document.addEventListener('paste', pasteImage);
  pasteListenerAttached = true;
}
function chooseCaptureRegion(video: HTMLVideoElement, width: number, height: number) {
  return new Promise<{ x: number; y: number; width: number; height: number } | null>((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'capture-dialog';
    dialog.innerHTML = `<form><h2 id="capture-region-title">Select the screen region to inspect</h2><p>Drag on the preview to select a region. You can also enter its pixel coordinates.</p><canvas id="capture-preview" width="${width}" height="${height}" aria-label="Screen capture preview. Drag to select a region." tabindex="0"></canvas><div class="capture-coordinates"><label>X <input id="capture-x" type="number" min="0" required></label><label>Y <input id="capture-y" type="number" min="0" required></label><label>Width <input id="capture-width" type="number" min="1" required></label><label>Height <input id="capture-height" type="number" min="1" required></label></div><p id="capture-region-note" role="status">Choose a region before adding it.</p><div class="capture-actions"><button id="cancel-capture-region" type="button">Cancel</button><button class="button primary" id="use-capture-region" type="button" disabled>Use selected region</button></div></form>`;
    document.body.append(dialog);
    const canvas = dialog.querySelector<HTMLCanvasElement>('#capture-preview')!;
    const context = canvas.getContext('2d')!;
    const use = dialog.querySelector<HTMLButtonElement>('#use-capture-region')!;
    const note = dialog.querySelector<HTMLElement>('#capture-region-note')!;
    const fields = ['x', 'y', 'width', 'height'].map((name) => dialog.querySelector<HTMLInputElement>(`#capture-${name}`)!);
    let start: { x: number; y: number } | null = null;
    let region: { x: number; y: number; width: number; height: number } | null = null;
    const draw = () => { context.drawImage(video, 0, 0, width, height); if (region) { context.save(); context.fillStyle = 'rgba(7,90,134,.2)'; context.strokeStyle = '#fff8e8'; context.lineWidth = Math.max(3, width / 300); context.fillRect(region.x, region.y, region.width, region.height); context.strokeRect(region.x, region.y, region.width, region.height); context.restore(); } };
    const valid = (next: { x: number; y: number; width: number; height: number }) => next.x >= 0 && next.y >= 0 && next.width > 0 && next.height > 0 && next.x + next.width <= width && next.y + next.height <= height;
    const setRegion = (next: { x: number; y: number; width: number; height: number } | null) => { region = next && valid(next) ? next : null; fields.forEach((field, index) => { if (region) field.value = String([region.x, region.y, region.width, region.height][index]); }); use.disabled = !region; note.textContent = region ? `Selected region: ${region.width} by ${region.height} pixels.` : 'Choose a region within the preview.'; draw(); };
    const point = (event: PointerEvent) => { const bounds = canvas.getBoundingClientRect(); return { x: Math.max(0, Math.min(width, Math.round((event.clientX - bounds.left) * width / bounds.width))), y: Math.max(0, Math.min(height, Math.round((event.clientY - bounds.top) * height / bounds.height))) }; };
    canvas.addEventListener('pointerdown', (event) => { start = point(event); canvas.setPointerCapture(event.pointerId); setRegion(null); });
    canvas.addEventListener('pointermove', (event) => { if (!start) return; const end = point(event); setRegion({ x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), width: Math.abs(end.x - start.x), height: Math.abs(end.y - start.y) }); });
    canvas.addEventListener('pointerup', () => { start = null; });
    fields.forEach((field) => field.addEventListener('input', () => { const [x, y, selectedWidth, selectedHeight] = fields.map((input) => Number.parseInt(input.value, 10)); setRegion({ x, y, width: selectedWidth, height: selectedHeight }); }));
    dialog.querySelector('#cancel-capture-region')?.addEventListener('click', () => dialog.close('cancel'));
    use.addEventListener('click', () => { if (region) dialog.close('confirm'); });
    dialog.addEventListener('close', () => { const result = dialog.returnValue === 'confirm' ? region : null; dialog.remove(); resolve(result); }, { once: true });
    draw(); dialog.showModal();
  });
}
async function captureScreen() {
  try {
    if (!navigator.mediaDevices?.getDisplayMedia) throw new Error('Screen capture is not available here. Open a screenshot instead.');
    setSourceStatus('Choose a screen or window, then select the part to inspect.');
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    const video = document.createElement('video');
    video.srcObject = stream; video.muted = true;
    await video.play();
    const width = settings.width || video.videoWidth;
    const height = settings.height || video.videoHeight;
    const selection = await chooseCaptureRegion(video, width, height);
    if (!selection) { track.stop(); setSourceStatus('Screen capture was cancelled. Open a screenshot instead.'); return; }
    const { x, y, width: selectedWidth, height: selectedHeight } = selection;
    const canvas = document.createElement('canvas'); canvas.width = selectedWidth; canvas.height = selectedHeight;
    canvas.getContext('2d')!.drawImage(video, x, y, selectedWidth, selectedHeight, 0, 0, selectedWidth, selectedHeight);
    track.stop();
    await useImage(canvas.toDataURL('image/png'), 'Selected screen region', 'capture');
  } catch { setSourceStatus('Screen capture did not start. Check screen-sharing permission, then try again or open a screenshot.'); }
}
function renderLens() {
  demo = false;
  layout(workspace(), 'Color Signal Lens — Inspect screenshot colors');
  wireWorkspace();
  void acceptLicense((result) => {
    const message = result === 'invalid'
      ? 'This license is no longer active. Buy Lens Plus to save named presets.'
      : result === 'unavailable'
        ? 'The license could not be checked. Connect to the internet and reload.'
        : undefined;
    refreshPremiumPanel(message);
  });
}

function cachedLicenseVerdict(license: string) {
  try {
    const verdict = JSON.parse(localStorage.getItem(licenseCheckKey) || 'null') as Partial<LicenseVerdict> | null;
    if (!verdict || verdict.license !== license || typeof verdict.checked !== 'number' || typeof verdict.valid !== 'boolean') return null;
    return verdict as LicenseVerdict;
  } catch {
    localStorage.removeItem(licenseCheckKey);
    return null;
  }
}

function hasValidLicense() {
  if (demo) return false;
  const license = localStorage.getItem(licenseKey);
  return Boolean(license && cachedLicenseVerdict(license)?.valid);
}

function readPresets(): Preset[] {
  try {
    const key = demo ? 'demo:color-signal-lens:presets' : 'color-signal-lens:presets';
    const value = JSON.parse(localStorage.getItem(key) || '[]') as Partial<Preset>[];
    if (!Array.isArray(value)) return [];
    return value.flatMap((preset, index) => {
      if (typeof preset.name !== 'string' || typeof preset.colour !== 'string' || !['none', 'labels', 'patterns', 'remap'].includes(String(preset.mode))) return [];
      const savedMapping: 'blue' | 'orange' = preset.mapping === 'orange' ? 'orange' : 'blue';
      return [{ id: typeof preset.id === 'string' ? preset.id : `saved-${index}`, name: preset.name.slice(0, 32), colour: preset.colour, mode: preset.mode as LensMode, mapping: savedMapping }];
    }).slice(-12);
  } catch {
    localStorage.removeItem(demo ? 'demo:color-signal-lens:presets' : 'color-signal-lens:presets');
    return [];
  }
}

function writePresets(presets: Preset[]) {
  localStorage.setItem(demo ? 'demo:color-signal-lens:presets' : 'color-signal-lens:presets', JSON.stringify(presets.slice(-12)));
}

function presetList() {
  const presets = readPresets();
  if (!presets.length) return '<p id="preset-empty">No presets saved yet.</p>';
  return `<ul id="preset-list" class="preset-list">${presets.map((preset) => `<li data-preset-id="${esc(preset.id)}"><label for="preset-${esc(preset.id)}">Preset name</label><input id="preset-${esc(preset.id)}" value="${esc(preset.name)}" maxlength="32"><span>${esc(preset.colour.toUpperCase())} · ${esc(preset.mode === 'none' ? 'clear' : preset.mode)}</span><div><button class="preset-apply" type="button">Apply ${esc(preset.name)}</button><button class="preset-rename" type="button">Rename ${esc(preset.name)}</button><button class="preset-delete" type="button">Delete ${esc(preset.name)}</button></div></li>`).join('')}</ul>`;
}

function premiumContent(message?: string) {
  if (demo) return '<p class="plus-note">Lens Plus presets are unavailable in the demo. The reading controls stay free.</p>';
  if (hasValidLicense()) return `<section class="preset" aria-labelledby="preset-title"><h3 id="preset-title">Saved presets</h3><label for="preset-name">New preset name</label><div class="preset-row"><input id="preset-name" maxlength="32" placeholder="Code review"><button id="save-preset" class="button secondary">Save preset</button></div><p id="preset-note" aria-live="polite">${esc(message || 'Saved presets stay on this device.')}</p>${presetList()}</section>`;
  const checking = localStorage.getItem(licenseKey) ? 'Checking the Lens Plus license. The reading controls stay free.' : 'Lens Plus saves named presets. The reading controls stay free.';
  return `<section class="preset" aria-labelledby="lens-plus-title"><h3 id="lens-plus-title">Lens Plus</h3><p class="plus-note" role="status" aria-live="polite">${esc(message || checking)}</p><p class="plus-note">$12 once. Sociobot/Dodo is the merchant of record. Refunds are handled by Sociobot/Dodo and revoke the license automatically.</p><a class="button primary" href="https://api.sociobot.in/api/v1/products/color-signal-lens/checkout" target="_blank" rel="noopener">Buy Lens Plus</a><button class="link-button" id="restore-license" type="button">Restore license</button><div id="license-area"></div></section>`;
}

function premiumPanel() { return `<div id="premium-panel">${premiumContent()}</div>`; }
function refreshPremiumPanel(message?: string) {
  const panel = document.querySelector<HTMLElement>('#premium-panel');
  if (!panel) return;
  panel.innerHTML = premiumContent(message);
  wirePresetActions();
  wireLicenseActions(panel);
  wireNavigation(panel);
}
function wirePresetActions() {
  document.querySelector('#save-preset')?.addEventListener('click', savePreset);
  document.querySelectorAll<HTMLElement>('[data-preset-id]').forEach((row) => {
    const id = row.dataset.presetId!;
    row.querySelector('.preset-apply')?.addEventListener('click', () => applyPreset(id));
    row.querySelector('.preset-rename')?.addEventListener('click', () => renamePreset(id, row));
    row.querySelector('.preset-delete')?.addEventListener('click', () => deletePreset(id));
  });
}
function savePreset() {
  if (!hasValidLicense()) { refreshPremiumPanel('Check an active Lens Plus license before saving a preset.'); return; }
  const name = (document.querySelector<HTMLInputElement>('#preset-name')?.value || '').trim();
  const note = document.querySelector('#preset-note')!;
  if (!name) { note.textContent = 'Name the preset, then save it.'; return; }
  const presets = readPresets();
  const id = globalThis.crypto?.randomUUID?.() || `preset-${Date.now()}`;
  presets.push({ id, name, colour: rgbToHex(target), mode, mapping });
  writePresets(presets);
  refreshPremiumPanel(`${name} is saved on this device.`);
}

function applyPreset(id: string) {
  const preset = readPresets().find((item) => item.id === id);
  if (!preset) return;
  target = parseHex(preset.colour); mode = preset.mode; mapping = preset.mapping; selectedPoint = null;
  refreshLens();
  const note = document.querySelector('#preset-note');
  if (note) note.textContent = `${preset.name} is applied.`;
}

function renamePreset(id: string, row: HTMLElement) {
  const name = (row.querySelector<HTMLInputElement>('input')?.value || '').trim();
  const note = document.querySelector('#preset-note');
  if (!name) { if (note) note.textContent = 'Enter a preset name, then rename it.'; return; }
  const presets = readPresets();
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;
  preset.name = name;
  writePresets(presets);
  refreshPremiumPanel(`${name} is renamed.`);
}

function deletePreset(id: string) {
  const presets = readPresets();
  const removed = presets.find((item) => item.id === id);
  if (!removed) return;
  writePresets(presets.filter((item) => item.id !== id));
  refreshPremiumPanel(`${removed.name} is deleted.`);
}

function renderPrivacy() { layout(`<article class="legal paper-edge"><p class="eyebrow">PRIVACY</p><h1>Your screenshot stays on this device.</h1><p>Color Signal Lens processes the screenshot you open in the app. It does not upload screenshot data or use analytics.</p><h2>Local storage</h2><p>The demo uses separate browser keys beginning with demo:. Reset demo deletes those keys. A paid license is stored in your browser only when you add it.</p><h2>Screen permission</h2><p>The app asks for screen permission only after you press Capture screen region. You choose the region before it is added. You can use files or pasted screenshots instead.</p><p>Last updated: 29 August 2026.</p></article>`, 'Privacy — Color Signal Lens'); }
function renderTerms() { layout(`<article class="legal paper-edge"><p class="eyebrow">TERMS</p><h1>Use the overlay to read your own screen.</h1><p>Color Signal Lens helps you inspect screenshots that you choose.</p><h2>Lens Plus</h2><p>Lens Plus costs $12 as a one-time purchase through the registered Sociobot checkout.</p><p>Sociobot/Dodo is the merchant of record. Refunds are handled by Sociobot/Dodo. A refund revokes the license automatically.</p><h2>Limits</h2><p>You are responsible for the screenshots you open.</p><p>Last updated: 29 August 2026.</p></article>`, 'Terms — Color Signal Lens'); }
function render404() { layout(`<article class="legal paper-edge"><p class="eyebrow">NOT FOUND</p><h1>Page not found</h1><p>Return to Color Signal Lens to open a screenshot.</p><a class="button primary" href="/" data-nav>Return home</a></article>`, 'Page not found — Color Signal Lens', '/404'); }

function storeLicense(license: string) {
  if (localStorage.getItem(licenseKey) !== license) localStorage.removeItem(licenseCheckKey);
  localStorage.setItem(licenseKey, license);
}
function wireLicenseActions(root: ParentNode = document) {
  root.querySelector<HTMLButtonElement>('#restore-license')?.addEventListener('click', showRestore);
}
function showRestore() {
  const area = document.querySelector('#license-area')!;
  area.innerHTML = `<label for="license-input">Paste your license</label><div class="restore"><input id="license-input" autocomplete="off"><button class="button secondary" id="save-license">Restore license</button></div><p id="license-note" aria-live="polite"></p>`;
  document.querySelector('#save-license')?.addEventListener('click', () => {
    const value = (document.querySelector<HTMLInputElement>('#license-input')?.value || '').trim();
    if (!value) return;
    storeLicense(value);
    const note = document.querySelector('#license-note')!;
    note.textContent = 'Checking the license.';
    void verifyLicense(value, note);
  });
}
async function acceptLicense(onResult?: (result: LicenseResult) => void) {
  if (demo) return;
  const params = new URLSearchParams(location.search);
  const value = params.get('license');
  if (value) {
    storeLicense(value);
    params.delete('license');
    history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}`);
  }
  const stored = localStorage.getItem(licenseKey);
  if (stored) onResult?.(await verifyLicense(stored));
}
async function verifyLicense(license: string, note?: Element): Promise<LicenseResult> {
  const cached = cachedLicenseVerdict(license);
  if (cached && Date.now() - cached.checked < 86_400_000) {
    if (!cached.valid) {
      localStorage.removeItem(licenseKey);
      if (note) note.textContent = 'This license is no longer active. You can buy Lens Plus again.';
      return 'invalid';
    }
    if (note) note.textContent = 'License is active.';
    return 'valid';
  }
  try {
    const nativeVerify = nativeTauri?.core?.invoke;
    const result = nativeVerify
      ? await nativeVerify<{ valid?: boolean }>('verify_license', { license })
      : await (async () => {
        const response = await fetch(`https://api.sociobot.in/api/v1/products/color-signal-lens/verify?license=${encodeURIComponent(license)}`);
        if (!response.ok) throw new Error('License check failed');
        return response.json() as Promise<{ valid?: boolean }>;
      })();
    if (localStorage.getItem(licenseKey) !== license) return 'unavailable';
    const valid = result.valid === true;
    localStorage.setItem(licenseCheckKey, JSON.stringify({ checked: Date.now(), valid, license } satisfies LicenseVerdict));
    if (!valid) {
      localStorage.removeItem(licenseKey);
      if (note) note.textContent = 'This license is no longer active. You can buy Lens Plus again.';
      return 'invalid';
    }
    if (note) note.textContent = 'License is active.';
    return 'valid';
  } catch {
    if (note) note.textContent = cached?.valid ? 'License check is offline. The last active check is in use.' : 'The license could not be checked. Connect to the internet and try again.';
    return cached?.valid ? 'valid' : 'unavailable';
  }
}
type ReleaseAsset = { name: string; browser_download_url: string };
type CachedRelease = { cached: number; assets: ReleaseAsset[] };

function macDownload(assets: ReleaseAsset[], architecture: 'aarch64' | 'x64') {
  return assets.find((item) => new RegExp(`_${architecture}\\.dmg$`, 'i').test(item.name));
}

function showMacChoices(state: Element, button: HTMLAnchorElement, assets: ReleaseAsset[]) {
  const intel = macDownload(assets, 'x64');
  const appleSilicon = macDownload(assets, 'aarch64');
  if (!intel || !appleSilicon) return false;
  state.textContent = 'Choose the macOS installer that matches your chip.';
  button.replaceWith(Object.assign(document.createElement('span'), {
    id: 'download-button',
    className: 'download-choices',
    innerHTML: `<a class="button secondary" href="${esc(intel.browser_download_url)}">Download for Intel Mac</a><a class="button secondary" href="${esc(appleSilicon.browser_download_url)}">Download for Apple Silicon</a>`,
  }));
  return true;
}

function isMobileDevice(agent: string) {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(agent);
}

function showMobileDownloads(state: Element, button: HTMLAnchorElement) {
  state.textContent = 'Downloads require macOS, Windows, or Linux.';
  button.href = 'https://github.com/B-Divyesh/sf-color-signal-lens/releases';
  button.textContent = 'Open desktop downloads';
}

function cancelDownloadHydration() {
  downloadHydration?.abort();
  downloadHydration = null;
}

function canApplyDownloadHydration(controller: AbortController, state: Element, button: HTMLAnchorElement) {
  return downloadHydration === controller
    && !controller.signal.aborted
    && !demo
    && location.pathname === '/'
    && document.contains(state)
    && document.contains(button);
}

async function hydrateDownload() {
  const state = document.querySelector('#download-state');
  const button = document.querySelector<HTMLAnchorElement>('#download-button');
  if (!state || !button || demo || location.pathname !== '/') return;
  cancelDownloadHydration();
  const controller = new AbortController();
  downloadHydration = controller;
  const cacheKey = 'color-signal-lens:release';
  let release: CachedRelease | null = null;
  try {
    release = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (!release || Date.now() - release.cached > 3_600_000) {
      const response = await fetch('https://api.github.com/repos/B-Divyesh/sf-color-signal-lens/releases?per_page=1', { signal: controller.signal });
      if (!response.ok) throw new Error('Could not list releases');
      const releases = await response.json() as { assets: ReleaseAsset[] }[];
      if (!canApplyDownloadHydration(controller, state, button) || !releases[0]) return;
      release = { cached: Date.now(), assets: releases[0].assets };
      localStorage.setItem(cacheKey, JSON.stringify(release));
    }
    if (!canApplyDownloadHydration(controller, state, button)) return;
    const agent = navigator.userAgent;
    if (isMobileDevice(agent)) {
      showMobileDownloads(state, button);
      return;
    }
    if (agent.includes('Mac')) {
      showMacChoices(state, button, release.assets);
      return;
    }
    const wanted = agent.includes('Windows') ? /\.msi$|\.exe$|windows.*\.zip$/i : /\.appimage$|\.deb$/i;
    const download = release.assets.find((item) => wanted.test(item.name));
    if (!download) return;
    button.href = download.browser_download_url;
    const platform = agent.includes('Windows') ? 'Windows' : 'Linux';
    button.textContent = `Download for ${platform}`;
    state.textContent = `Download the ${platform} installer.`;
  } catch {
    // Keep the Releases-page fallback when metadata is unavailable or navigation cancels this lookup.
  } finally {
    if (downloadHydration === controller) downloadHydration = null;
  }
}

function focusHashTarget(hash = location.hash) {
  if (!hash) return false;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return false;
  const focusTarget = target.matches('h1, h2, h3, h4, h5, h6')
    ? target
    : target.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6') || target;
  target.scrollIntoView({ block: 'start' });
  focusTarget.setAttribute('tabindex', '-1');
  focusTarget.focus({ preventScroll: true });
  const announcement = document.querySelector<HTMLElement>('#route-announcement');
  if (announcement) announcement.textContent = focusTarget.textContent?.trim() || 'Section opened';
  return true;
}

function wireNavigation(root: ParentNode = document) {
  root.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((anchor) => anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href')!;
    if (!href.startsWith('/')) return;
    const target = new URL(href, location.origin);
    const sameDocument = target.pathname === location.pathname && target.search === location.search;
    event.preventDefault();
    focusAfterRender = !target.hash;
    history.pushState({}, '', href);
    if (sameDocument && target.hash) {
      requestAnimationFrame(() => focusHashTarget(target.hash));
      return;
    }
    renderRoute();
  }));
}
function renderRoute() {
  const params = new URLSearchParams(location.search);
  if (location.pathname !== '/' || params.get('demo') === '1') cancelDownloadHydration();
  if (location.pathname === '/demo' || params.get('demo') === '1') { demo = true; renderDemo(); }
  else if (!siteBuild && (location.pathname === '/' || location.pathname === '/lens')) { demo = false; renderLens(); }
  else if (location.pathname === '/') renderLanding();
  else if (location.pathname === '/lens') renderLens();
  else if (location.pathname === '/privacy') renderPrivacy();
  else if (location.pathname === '/terms') renderTerms();
  else render404();
  if (location.hash) requestAnimationFrame(() => focusHashTarget());
}
window.addEventListener('popstate', () => { focusAfterRender = true; renderRoute(); });
renderRoute();
