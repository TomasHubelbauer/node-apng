# Node APNG

A Node library for stitching `Buffer`s containing PNG image data together to
form an APNG image.

This library is based on code by [Józef Sokołowski](https://github.com/qzb).
I've fixed two bugs in it:

- IDAT chunk CRC calculation was being passed slice range, not the slice buffer
- PNGs with multiple IDAT chunks only had their first IDAT chunk considered

## Usage

`npm install tomashubelbauer/node-apng`

```js
import apng from 'node-apng';
import fs from 'fs';

void async function () {
  const buffers = [/* … */]; // Buffers of PNG image data
  // The callback is for frame duration: `numeration/denominator` seconds
  const buffer = apng(buffers, index => ({ numerator: 1, denominator: 10 }));
  await fs.promises.writeFile('apng.png', buffer);
}()
```

## Development

Use Node 16+ (ESM, TLA)

```sh
npm install
cd test
npm start
```

## To-Do

### Add a GitHub Action for tests

### Refactor as per the code comment

### Add support for "skip first frame" to allow "warning this is animated" frame

The first frame should be skipped in the animation and should be a preview with
a subtitle which says this is an animated image and your browser doesn't support
APNG so you're getting only a preview.

## APNG on GitHub

GitHub repository file preview page will only preview images with a PNG
extension, but will animate properly (depending on browser support) if animated.

GitHub MarkDown renderer allows image sources with both PNG and APNG extensions.
Will animate properly subject to browser support.

## APNG in VS Code

VS Code will correctly preview and animate images as long as they have a PNG
extension, not APNG extension.
