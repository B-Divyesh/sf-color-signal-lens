import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const audit = readFileSync('.factory/copy-audit.md', 'utf8');

function visibleMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/<((?:https?:\/\/)[^>]+)>/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();
}

function wordCount(value: string) {
  const text = visibleMarkdown(value);
  return text ? text.split(/\s+/).length : 0;
}

test('copy audit records mechanically correct whitespace word counts', () => {
  const rows = [...audit.matchAll(/^\| (.*?) \| (\d+) \|.*$/gm)]
    .filter((match) => match[1] !== 'Copy');
  assert.ok(rows.length > 100, 'expected a complete copy audit, not a sample');
  for (const row of rows) {
    assert.equal(Number(row[2]), wordCount(row[1]), `wrong word count for: ${row[1]}`);
  }
});

test('copy audit contains every README heading and prose unit', () => {
  const readme = readFileSync('README.md', 'utf8');
  const withoutCode = readme.replace(/```[\s\S]*?```/g, '');
  const units: string[] = [];
  let paragraph = '';
  const flush = () => {
    if (paragraph) {
      const visible = visibleMarkdown(paragraph);
      units.push(...visible.split(/(?<=[.!?])\s+(?=[A-Z])/));
    }
    paragraph = '';
  };
  for (const rawLine of withoutCode.split('\n')) {
    const line = rawLine.trim();
    if (!line) { flush(); continue; }
    const heading = line.match(/^#{1,6}\s+(.+)$/);
    if (heading) { flush(); units.push(visibleMarkdown(heading[1])); continue; }
    const listItem = line.match(/^\d+\.\s+(.+)$/);
    if (listItem) { flush(); paragraph = listItem[1]; continue; }
    paragraph += `${paragraph ? ' ' : ''}${line}`;
  }
  flush();
  for (const unit of units) assert.ok(audit.includes(`| ${unit} |`), `README copy missing from audit: ${unit}`);
});

test('every declared claim has exactly one tagged test', () => {
  const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as { id: string; test: string }[];
  assert.equal(new Set(claims.map(({ id }) => id)).size, claims.length, 'claim ids must be unique');
  const testSource = [
    ...readdirSync('tests').filter((name) => name.endsWith('.ts')).map((name) => readFileSync(`tests/${name}`, 'utf8')),
    readFileSync('src/lens.test.ts', 'utf8'),
  ].join('\n');
  for (const claim of claims) {
    const tag = `@claim:${claim.id}`;
    assert.equal(testSource.split(tag).length - 1, 1, `${tag} must occur in exactly one test`);
    assert.ok(claim.test.includes(tag), `${claim.id} command must select its own tag`);
  }
});
