const fs = require('fs');
const path = require('path');
const whatsappDir = 'WhatsApp Unknown 2026-07-04 at 16.35.48';
const files = fs.readdirSync(whatsappDir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg'));

let html = '<html><body><h1>Images</h1>';
for (const file of files) {
  html += '<div style="margin-bottom: 50px;">';
  html += '<h2>' + file + '</h2>';
  html += '<img src="' + path.join(whatsappDir, file) + '" style="max-width: 600px;" />';
  html += '</div>';
}
html += '</body></html>';

fs.writeFileSync('view_images.html', html);
console.log('Created view_images.html');
