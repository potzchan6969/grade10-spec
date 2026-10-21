import assert from "node:assert/strict";
import test from "node:test";
import { diffPixels } from "@grade10/ui-verification/pixel-diff";

function solid(width, height, [r, g, b]) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let offset = 0; offset < data.length; offset += 4) {
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = 255;
  }
  return data;
}

function paint(data, width, box, [r, g, b]) {
  for (let y = box.y; y < box.y + box.height; y += 1) {
    for (let x = box.x; x < box.x + box.width; x += 1) {
      const offset = (y * width + x) * 4;
      data[offset] = r;
      data[offset + 1] = g;
      data[offset + 2] = b;
    }
  }
}

test("identical buffers report no difference", () => {
  const image = solid(40, 30, [240, 240, 240]);
  const result = diffPixels(image, image.slice(), 40, 30);
  assert.equal(result.differing, 0);
  assert.equal(result.ratio, 0);
  assert.deepEqual(result.regions, []);
});

test("a changed block is counted and boxed on the coarse grid", () => {
  const reference = solid(64, 64, [255, 255, 255]);
  const site = reference.slice();
  paint(site, 64, { x: 20, y: 20, width: 10, height: 8 }, [0, 0, 0]);
  const result = diffPixels(reference, site, 64, 64);
  assert.equal(result.differing, 80);
  assert.equal(result.ratio, 80 / (64 * 64));
  assert.equal(result.regions.length, 1);
  const [region] = result.regions;
  assert.ok(region.x <= 20 && region.y <= 20);
  assert.ok(region.x + region.width >= 30 && region.y + region.height >= 28);
  const marked = (20 * 64 + 20) * 4;
  assert.deepEqual(
    Array.from(result.diff.slice(marked, marked + 4)),
    [217, 45, 45, 255],
  );
});

test("separate blocks make separate regions and small colour drift is ignored", () => {
  const reference = solid(128, 64, [250, 250, 250]);
  const site = reference.slice();
  paint(site, 128, { x: 2, y: 2, width: 6, height: 6 }, [0, 0, 0]);
  paint(site, 128, { x: 100, y: 40, width: 6, height: 6 }, [0, 0, 0]);
  paint(site, 128, { x: 60, y: 10, width: 4, height: 4 }, [248, 248, 248]);
  const result = diffPixels(reference, site, 128, 64);
  assert.equal(result.regions.length, 2);
  assert.equal(result.differing, 72);
});

test("mismatched buffers are rejected", () => {
  assert.throws(
    () => diffPixels(solid(2, 2, [0, 0, 0]), solid(3, 2, [0, 0, 0]), 2, 2),
    RangeError,
  );
});
