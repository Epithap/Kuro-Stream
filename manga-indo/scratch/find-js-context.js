import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const targets = ['accses-key', 'signature', 'accsesKey', 'x-wm-request-signature'];

for (const t of targets) {
  const idx = content.indexOf(t);
  if (idx !== -1) {
    console.log(`Found "${t}" at index ${idx}`);
    console.log('Context:\n', content.substring(Math.max(0, idx - 300), Math.min(content.length, idx + 300)));
  } else {
    console.log(`"${t}" not found`);
  }
}
