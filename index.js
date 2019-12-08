// https://stackoverflow.com/a/39244362/2715716
// This renders the first frame clipped and the subsequence ones blank :-(
// TODO: Fix this and refactor it so that it allocates one buffer at the start
// which is sized approximately so that it fits the signature, IHDR from the 1st
// frame, ACTL, the entire total of the buffers' sizes and IEND, then gets
// written to: the signature, the IHDR from the initial frame, the FCTL and FDAT
// of all the buffers in a for-of loop and then an IEND after the loop and after
// this, slice the buffer from zero to the actual length it got written to to
// get rid of the excess (which wouldn't break the PNG, there can be anything
// after IEND, but would make it larger than necessary, albeit not by very much
// at all)
module.exports = function makeApng(buffers) {
  const crc32 = require('crc').crc32;

  function findChunk(buffer, type) {
    let offset = 8;

    while (offset < buffer.length) {
      const chunkLength = buffer.readUInt32BE(offset);
      const chunkType = buffer.slice(offset + 4, offset + 8).toString('ascii');

      if (chunkType === type) {
        return buffer.slice(offset, offset + chunkLength + 12);
      }

      offset += 4 + 4 + chunkLength + 4;
    }

    throw new Error(`Chunk "${type}" not found`);
  }

  const actl = Buffer.alloc(20);
  actl.writeUInt32BE(8, 0); // Length of chunk
  actl.write('acTL', 4); // Type of chunk
  actl.writeUInt32BE(buffers.length, 8); // Number of frames
  actl.writeUInt32BE(0, 12); // Number of times to loop (0 - infinite)
  actl.writeUInt32BE(crc32(actl.slice(4, 16)), 16); // CRC

  const frames = buffers.map((data, index) => {
    const ihdr = findChunk(data, 'IHDR');

    const fctl = Buffer.alloc(38);
    fctl.writeUInt32BE(26, 0); // Length of chunk
    fctl.write('fcTL', 4); // Type of chunk
    fctl.writeUInt32BE(index > 0 ? index * 2 - 1 : 0, 8); // Sequence number
    fctl.writeUInt32BE(ihdr.readUInt32BE(8), 12); // Width
    fctl.writeUInt32BE(ihdr.readUInt32BE(12), 16); // Height
    fctl.writeUInt32BE(0, 20); // X offset
    fctl.writeUInt32BE(0, 24); // Y offset
    fctl.writeUInt16BE(1, 28); // Frame delay - fraction numerator
    fctl.writeUInt16BE(1, 30); // Frame delay - fraction denominator
    fctl.writeUInt8(0, 32); // Dispose mode
    fctl.writeUInt8(0, 33); // Blend mode
    fctl.writeUInt32BE(crc32(fctl.slice(4, 34)), 34); // CRC

    const idat = findChunk(data, 'IDAT');

    // All IDAT chunks except first one are converted to fdAT chunks
    let fdat;
    if (index === 0) {
      fdat = idat;
    } else {
      const length = idat.length + 4;

      fdat = Buffer.alloc(length);
      fdat.writeUInt32BE(length - 12, 0); // Length of chunk
      fdat.write('fdAT', 4); // Type of chunk
      fdat.writeUInt32BE(index * 2, 8); // Sequence number
      idat.copy(fdat, 12, 8); // Image data
      fdat.writeUInt32BE(crc32(fdat.slice(4, length - 4)), length - 4); // CRC
    }

    return Buffer.concat([fctl, fdat]);
  });

  const signature = Buffer.from('\211PNG\r\n\032\n', 'ascii');
  const ihdr = findChunk(buffers[0], 'IHDR');
  const iend = Buffer.from('0000000049454e44ae426082', 'hex');
  return Buffer.concat([signature, ihdr, actl, ...frames, iend]);
}
