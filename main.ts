// make.fun entry for cutest-picture-01: writes the picture to /output/entry.png.
// The picture ships beside this file as entry.png. Its bytes are a JPEG under a
// .png name, which the gate accepts: it tells PNG from JPEG by the first bytes,
// never by the extension.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
const bytes = readFileSync(src);

// Fail loudly rather than submit a file the gate would mark invalid.
const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
if (!isPng && !isJpeg) throw new Error('entry.png is neither PNG nor JPEG');
if (bytes.length > 1_048_576) throw new Error('entry.png exceeds the 1 MiB cap');

mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, 'entry.png'));
console.log(`wrote ${join(outDir, 'entry.png')} (${isPng ? 'PNG' : 'JPEG'}, ${bytes.length} bytes)`);
