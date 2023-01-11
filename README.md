# Node APNG

A Node library for stitching `Buffer`s containing PNG image data together to
form an APNG image.

This library is based on code by [Józef Sokołowski](https://github.com/qzb).
I've fixed two bugs in it:

- IDAT chunk CRC calculation was being passed slice range, not the slice buffer
- PNGs with multiple IDAT chunks only had their first IDAT chunk considered
- Auto gif to apng
## Usage

`npm install tomashubelbauer/node-apng`
# **Usage**

### CommonJS

```js
const apng = require("node-apng");
```

### ES6

```js
import apng from 'node-apng';
```
### Example
#### Merge Frames to apng
```js
import apng from 'node-apng';
import fs from 'fs';

const buffers = [/* … */]; // Buffers of PNG image data like ["./fram1.png","./fram2.png"...]

// The callback is for frame duration: `numeration/denominator` seconds
const buffer = await apng(buffers, index => ({ numerator: 1, denominator: 10 }));
await fs.promises.writeFile('apng.png', buffer);
```
#### url gif to apng
```js
import apng from 'node-apng';
import fs from 'fs';

// The callback is for frame duration: `numeration/denominator` seconds
const buffer = await apng("https://emojipedia-us.s3.amazonaws.com/source/noto-emoji-animations/344/winking-face_1f609.gif", index => ({ numerator: 1, denominator: 10 }));
await fs.promises.writeFile('apng.png', buffer);
```
#### local gif to apng
```js
import apng from 'node-apng';
import fs from 'fs';

// The callback is for frame duration: `numeration/denominator` seconds
const buffer = await apng("./Fun.gif", index => ({ numerator: 1, denominator: 10 }));
await fs.promises.writeFile('apng.png', buffer);
```

## Support

### APNG on GitHub

GitHub repository file preview page will only preview images with a PNG
extension, but will animate properly (depending on browser support) if animated.

GitHub MarkDown renderer allows image sources with both PNG and APNG extensions.
Will animate properly subject to browser support.

### APNG in VS Code

VS Code will correctly preview and animate images as long as they have a PNG
extension, not APNG extension.

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

### Implement dispose op and blend op to be able to do differential frames

This might cut down on APNG size where the input is a series of screenshots of a
screencast video. Most of the screen is likely to remain unchanged. Use Sharp
(already referenced) to do the frame comparison and generation of a frame which
only contains the changed pixels (and calculation of the change region). Note
that transparency support needs to be considered too, probably.

https://wiki.mozilla.org/APNG_Specification#.60fcTL.60:_The_Frame_Control_Chunk
