import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('@claim:installer-checksums Linux install verifies the AppImage and leaves an executable on PATH', () => {
  const shell = readFileSync('public/install.sh', 'utf8');
  const powershell = readFileSync('public/install.ps1', 'utf8');
  assert.ok(shell.indexOf('SHA256SUMS') < shell.indexOf('Verified $name.'), 'shell installer verifies before its success message');
  assert.match(shell, /sha256sum "\$work\/\$name"/);
  assert.ok(powershell.indexOf('Get-FileHash') < powershell.indexOf('Verified $($asset.name).'), 'Windows installer verifies before its success message');
  assert.match(powershell, /Checksum did not match/);

  const fixture = mkdtempSync(join(tmpdir(), 'color-signal-lens-installer-'));
  const bin = join(fixture, 'bin');
  mkdirSync(bin);
  const curl = join(bin, 'curl');
  const uname = join(bin, 'uname');
  writeFileSync(curl, '#!/usr/bin/env sh\nprintf \'{"assets":[{"browser_download_url":"https://example.invalid/ColorSignalLens.AppImage"}]}\'\n');
  writeFileSync(uname, '#!/usr/bin/env sh\nprintf Linux\n');
  chmodSync(curl, 0o755);
  chmodSync(uname, 0o755);
  const installDir = join(fixture, 'installed-bin');
  const result = spawnSync('sh', ['public/install.sh'], { cwd: process.cwd(), env: { ...process.env, COLOR_SIGNAL_LENS_INSTALL_DIR: installDir, PATH: `${bin}:${process.env.PATH}` }, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /matching download is not published yet/);

  writeFileSync(curl, `#!/usr/bin/env sh
out=''
for arg in "$@"; do
  if [ "$previous" = '-o' ]; then out="$arg"; fi
  previous="$arg"
done
if [ -z "$out" ]; then
  printf '%s' '{"assets":[{"browser_download_url":"https://example.invalid/ColorSignalLens.AppImage"},{"browser_download_url":"https://example.invalid/SHA256SUMS"}]}'
elif printf '%s' "$*" | grep -q SHA256SUMS; then
  printf '%s\\n' 'fixture installer' | sha256sum | sed 's/  -$/  ColorSignalLens.AppImage/' > "$out"
else
  printf '%s\\n' 'fixture installer' > "$out"
fi
`);
  chmodSync(curl, 0o755);
  const verified = spawnSync('sh', ['public/install.sh'], { cwd: process.cwd(), env: { ...process.env, COLOR_SIGNAL_LENS_INSTALL_DIR: installDir, PATH: `${bin}:${process.env.PATH}` }, encoding: 'utf8' });
  assert.equal(verified.status, 0, verified.stderr);
  assert.match(verified.stdout, /Verified ColorSignalLens\.AppImage/);
  const installed = join(installDir, 'color-signal-lens');
  assert.match(verified.stdout, new RegExp(`Installed Color Signal Lens at ${installed}`));
  assert.equal(existsSync(installed), true, 'the installed AppImage survives temporary download cleanup');
  assert.equal(readFileSync(installed, 'utf8'), 'fixture installer\n');
  assert.notEqual(statSync(installed).mode & 0o111, 0, 'the installed AppImage is executable');
});

test('@claim:macos-shell-installer-architecture install.sh selects the DMG that matches uname -m', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'color-signal-lens-macos-installer-'));
  const bin = join(fixture, 'bin');
  mkdirSync(bin);
  const curl = join(bin, 'curl');
  const uname = join(bin, 'uname');

  writeFileSync(curl, `#!/usr/bin/env sh
out=''
for arg in "$@"; do
  if [ "$previous" = '-o' ]; then out="$arg"; fi
  previous="$arg"
done
if [ -z "$out" ]; then
  printf '%s' '{"assets":[{"browser_download_url":"https://example.invalid/Color.Signal.Lens_0.1.7_aarch64.dmg"},{"browser_download_url":"https://example.invalid/Color.Signal.Lens_0.1.7_x64.dmg"},{"browser_download_url":"https://example.invalid/SHA256SUMS"}]}'
elif printf '%s' "$*" | grep -q SHA256SUMS; then
  { printf '%s\\n' 'Apple fixture installer' | sha256sum | sed 's/  -$/  Color.Signal.Lens_0.1.7_aarch64.dmg/'; printf '%s\\n' 'Intel fixture installer' | sha256sum | sed 's/  -$/  Color.Signal.Lens_0.1.7_x64.dmg/'; } > "$out"
elif printf '%s' "$*" | grep -q aarch64.dmg; then
  printf '%s\\n' 'Apple fixture installer' > "$out"
elif printf '%s' "$*" | grep -q x64.dmg; then
  printf '%s\\n' 'Intel fixture installer' > "$out"
else
  exit 1
fi
`);
  chmodSync(curl, 0o755);

  for (const [cpu, expected] of [
    ['x86_64', 'Color.Signal.Lens_0.1.7_x64.dmg'],
    ['i386', 'Color.Signal.Lens_0.1.7_x64.dmg'],
    ['arm64', 'Color.Signal.Lens_0.1.7_aarch64.dmg'],
    ['aarch64', 'Color.Signal.Lens_0.1.7_aarch64.dmg'],
  ]) {
    writeFileSync(uname, `#!/usr/bin/env sh\nif [ "$1" = '-s' ]; then printf Darwin; else printf '${cpu}'; fi\n`);
    chmodSync(uname, 0o755);
    const result = spawnSync('sh', ['public/install.sh'], {
      cwd: process.cwd(),
      env: { ...process.env, COLOR_SIGNAL_LENS_INSTALL_DIR: fixture, COLOR_SIGNAL_LENS_NO_LAUNCH: '1', PATH: `${bin}:${process.env.PATH}` },
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, `${cpu}: ${result.stderr}`);
    assert.match(result.stdout, new RegExp(`Verified ${expected.replaceAll('.', '\\.')}`), `${cpu} selects ${expected}`);
  }

  writeFileSync(uname, "#!/usr/bin/env sh\nif [ \"$1\" = '-s' ]; then printf Darwin; else printf mips64; fi\n");
  chmodSync(uname, 0o755);
  const unknown = spawnSync('sh', ['public/install.sh'], {
    cwd: process.cwd(),
    env: { ...process.env, COLOR_SIGNAL_LENS_INSTALL_DIR: fixture, COLOR_SIGNAL_LENS_NO_LAUNCH: '1', PATH: `${bin}:${process.env.PATH}` },
    encoding: 'utf8',
  });
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /Unsupported macOS CPU: mips64/);
});
