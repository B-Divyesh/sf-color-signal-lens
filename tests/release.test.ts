import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('@claim:desktop-release Windows has a native icon and the workflow keeps incomplete releases private', () => {
  const config = JSON.parse(readFileSync('src-tauri/tauri.conf.json', 'utf8')) as { bundle: { icon: string[] } };
  const workflow = readFileSync('.github/workflows/release.yml', 'utf8');

  // This is the exact missing input reported by the failed Windows Tauri build.
  assert.equal(existsSync('src-tauri/icons/icon.ico'), true, 'Windows Tauri builds require icons/icon.ico');
  assert.ok(config.bundle.icon.includes('icons/icon.ico'));
  assert.match(workflow, /- os: windows-latest/);
  assert.match(workflow, /releaseDraft: true/);
  assert.match(workflow, /needs: release/);
  assert.match(workflow, /No Windows installer was attached/);
  assert.match(workflow, /No macOS installer was attached/);
  assert.match(workflow, /No Linux installer was attached/);
  assert.match(workflow, /SHA256SUMS latest\.json --clobber/);
  assert.match(workflow, /gh release edit "\$GITHUB_REF_NAME" --draft=false/);
  assert.ok(workflow.indexOf('SHA256SUMS latest.json --clobber') < workflow.indexOf('gh release edit'), 'release must be public only after the manifest upload');
});
