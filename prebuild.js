// prebuild.js
const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, 'node_modules/tesseract.js-core/tesseract-core-simd.wasm');
const destDir = path.resolve(__dirname, '.vercel/output/functions/app/api/reasoning');
const destPath = path.join(destDir, 'tesseract-core-simd.wasm');

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy the .wasm file
fs.copyFileSync(sourcePath, destPath);
console.log(`Copied ${sourcePath} to ${destPath}`);