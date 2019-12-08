# Node APNG

A Node library for stitching `Buffer`s containing PNG image data together to
form an APNG image.

This repository contains an example animated image. It is uploaded with both
the APNG and the PNG extension. GitHub will display image preview only for
the variant with the PNG extension when accessing the file directly.

When embedded in MarkDown, such as in this readme, both extensions work as
image sources. Here's the APNG variant as an image source:

![](example.apng)

## To-Do

### Fix the issues

Right now the library generates a cropped image on the first frame and the
subsequent frames show up completely blank.

I aim to fix it by generating an APNG online from a few simple frames,
generating one using this library from the same frames, comparing the
binary of both and fixing the bugs resulting in the discrepancies.

Note that http://entropymine.com/jason/tweakpng is very helpful for viewing
contents of a PNG.
