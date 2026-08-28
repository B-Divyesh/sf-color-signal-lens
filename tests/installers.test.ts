import assert from 'node:assert/strict';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('@claim:installer-checksums install scripts refuse a release without checksums and hash before success', () => {
  const shell = readFileSync('public/install.sh', 'utf8');
  const powershell = readFileSync('public/install.ps1', 'utf8');
  assert.ok(shell.indexOf('SHA256SUMS') < shell.indexOf('Verified $name.'), 'shell installer verifies before its success message');
  assert.match(shell, /sha256sum -c/);
  assert.ok(powershell.indexOf('Get-FileHash') < powershell.indexOf('Verified $($asset.name).'), 'Windows installer verifies before its success message');
  assert.match(powershell, /Checksum did not match/);

  const fixture = mkdtempSync(join(tmpdir(), 'color-signal-lens-installer-'));
  const bin = join(fixture, 'bin');
  mkdirSync(bin);
  const curl = join(bin, 'curl');
  const uname = join(bin, 'uname');
  writeFileSync(curl, '#!/usr/bin/env sh\nprintf \'{"assets":[{"browser_download_url":"https://example.invalid/ColorSignalLens.deb"}]}\'\n');
  writeFileSync(uname, '#!/usr/bin/env sh\nprintf Linux\n');
  chmodSync(curl, 0o755);
  chmodSync(uname, 0o755);
  const result = spawnSync('sh', ['public/install.sh'], { cwd: process.cwd(), env: { ...process.env, PATH: `${bin}:${process.env.PATH}` }, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /matching download is not published yet/);

  writeFileSync(curl, `#!/usr/bin/env sh
out=''
for arg in "$@"; do
  if [ "$previous" = '-o' ]; then out="$arg"; fi
  previous="$arg"
done
if [ -z "$out" ]; then
  printf '%s' '{"assets":[{"browser_download_url":"https://example.invalid/ColorSignalLens.deb"},{"browser_download_url":"https://example.invalid/SHA256SUMS"}]}'
elif printf '%s' "$*" | grep -q SHA256SUMS; then
  printf '%s\\n' '0a8a8bddf749d0449697528faac979fec3fbe1c01ed2853f6353802f2f218f9c  ColorSignalLens.deb' > "$out"
else
  printf '%s\\n' 'fixture installer' > "$out"
fi
`);
  chmodSync(curl, 0o755);
  const verified = spawnSync('sh', ['public/install.sh'], { cwd: process.cwd(), env: { ...process.env, PATH: `${bin}:${process.env.PATH}` }, encoding: 'utf8' });
  assert.equal(verified.status, 0, verified.stderr);
  assert.match(verified.stdout, /Verified ColorSignalLens\.deb/);
});
