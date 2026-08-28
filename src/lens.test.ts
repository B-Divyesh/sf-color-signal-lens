import test from 'node:test';
import assert from 'node:assert/strict';
import { detectStatusName, isNear, parseHex, remapPixel, rgbToHex } from './lens.ts';

test('recognises close pixels', () => {
  assert.equal(isNear(parseHex('#9c2d20'), parseHex('#a02e22')), true);
  assert.equal(isNear(parseHex('#9c2d20'), parseHex('#075a86')), false);
});

test('remaps a selected colour', () => {
  assert.equal(rgbToHex(remapPixel(parseHex('#9c2d20'), parseHex('#9c2d20'), 'blue')), '#075a86');
});

test('provides a redundant signal name', () => {
  assert.equal(detectStatusName(parseHex('#16714a')), 'Added / ready');
});
