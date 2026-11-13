// Copy program with validation for make.fun entry
// Node 22 standard library only. No deps, no network.
const fs = require('node:fs');
const path = require('node:path');

const srcPath = path.join(__dirname, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const destPath = path.join(outDir, 'entry.png');

// Read source bytes first to validate
const data = fs.readFileSync(srcPath);

// Validation: size limit 1 MiB
const MAX_BYTES = 1048576; // 1 * 1024 * 1024
if (data.length > MAX_BYTES) {
  throw new Error(`Source file too large: ${data.length} bytes > ${MAX_BYTES}`);
}

// Validation: must start with PNG or JPEG magic
// PNG: 0x89 0x50 0x4E 0x47
// JPEG: 0xFF 0xD8 0xFF
const isPng = data.length >= 4 && data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47;
const isJpeg = data.length >= 3 && data[0] === 0xFF && data[1] === 0xD8 && data[2] === 0xFF;
if (!isPng && !isJpeg) {
  throw new Error('Source file is neither PNG nor JPEG (invalid magic bytes)');
}

// Ensure output directory exists and write exact bytes
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(destPath, data, { encoding: 'binary' });

console.log(`Wrote ${destPath} (${data.length} bytes)`);
