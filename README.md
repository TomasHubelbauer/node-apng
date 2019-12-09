# Node APNG

A Node library for stitching `Buffer`s containing PNG image data together to
form an APNG image.

This library is based on code by [Józef Sokołowski](https://github.com/qzb).
I've fixed two bugs in it:

- IDAT chunk CRC calculation was being passed slice range, not the slice buffer
- PNGs with multiple IDAT chunks only had their first IDAT chunk considered

## APNG on GitHub

GitHub repository file preview page will only preview images with a PNG
extension, but will animate properly (depending on browser support) if animated.

GitHub MarkDown renderer allows image sources with both PNG and APNG extensions.
Will animate properly subject to browser support.
