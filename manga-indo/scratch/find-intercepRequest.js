import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

// Find all occurrences of _intercepRequest (with or without underscore)
const targets = ['_intercepRequest', 'interceptRequest', 'intercepRequest'];
for (const t of targets) {
  let idx = 0;
  while (true) {
    idx = code.indexOf(t, idx);
    if (idx === -1) break;
    console.log(`Found ${t} at index ${idx}:`);
    console.log(code.substring(idx - 100, idx + 300));
    idx += t.length;
  }
}
