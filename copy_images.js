const fs = require('fs');
const path = require('path');

const src = 'WhatsApp Unknown 2026-07-04 at 16.35.48';
const dest = 'public/images/products';

// Exact mapping read from the product pack labels in each image
const mapping = [
  ['WhatsApp Image 2026-07-04 at 15.57.43.jpeg',       'sweetcorn.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.10 (1).jpeg',   'trial-pack.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.10 (2).jpeg',   'guava.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.10 (3).jpeg',   'carrot.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.10.jpeg',       'amla.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.11 (1).jpeg',   'papaya.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.11 (2).jpeg',   'jackfruit.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.11.jpeg',       'strawberry.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.12 (1).jpeg',   'pineapple.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.12 (2).jpeg',   'banana.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.12.jpeg',       'apple.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.13 (1).jpeg',   'mango.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.13 (2).jpeg',   'custard-apple.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.13.jpeg',       'beetroot.jpg'],
  ['WhatsApp Image 2026-07-04 at 16.06.14.jpeg',       'chikoo.jpg'],
];

for (const [srcFile, destFile] of mapping) {
  const srcPath = path.join(src, srcFile);
  const destPath = path.join(dest, destFile);
  fs.copyFileSync(srcPath, destPath);
  console.log(`✓  ${srcFile}  →  ${destFile}`);
}

console.log('\nAll images copied correctly!');
