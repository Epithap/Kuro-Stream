import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const targets = ['_hmac(', '_hmac:async(', '_hmac=async', '_hmac'];

for (const t of targets) {
  let idx = 0;
  while ((idx = content.indexOf(t, idx)) !== -1) {
    console.log(`Found "${t}" at index ${idx}:`);
    console.log(content.substring(idx - 100, idx + 300));
    idx += t.length;
  }
}
