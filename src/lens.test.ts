import test from 'node:test';
import assert from 'node:assert/strict';
import { containedBitmapPoint, detectStatusName, isNear, parseHex, remapPixel, rgbToHex } from './lens.ts';

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

test('maps a click through object-fit contain letterboxing', () => {
  const point = containedBitmapPoint(
    { clientX: 408.0828125, clientY: 279 },
    { left: 0, top: 0, width: 927.765625, height: 558 },
    { width: 100, height: 400 },
  );
  assert.deepEqual(point, { x: 9, y: 200 });
  assert.equal(containedBitmapPoint({ clientX: 30, clientY: 279 }, { left: 0, top: 0, width: 927.765625, height: 558 }, { width: 100, height: 400 }), null);
});
