import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const targets = ['fetchApi', 'intercep', 'Request.bind', 'accses-key'];

for (const t of targets) {
  let idx = 0;
  while ((idx = content.indexOf(t, idx)) !== -1) {
    console.log(`Found "${t}" at index ${idx}:`);
    console.log(content.substring(idx - 100, idx + 300));
    idx += t.length;
  }
}
