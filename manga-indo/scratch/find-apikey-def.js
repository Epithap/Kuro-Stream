import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const targets = ['apiKey', 'x-wm-accses-key', 'WM_WEB_FRONT_END'];

for (const t of targets) {
  let idx = 0;
  while ((idx = content.indexOf(t, idx)) !== -1) {
    console.log(`Found "${t}" at index ${idx}`);
    console.log('Context:\n', content.substring(Math.max(0, idx - 200), Math.min(content.length, idx + 400)));
    idx += t.length;
  }
}
