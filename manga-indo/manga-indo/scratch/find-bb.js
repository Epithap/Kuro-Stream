import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

// Let's find "bb" imports or definitions
let idx = 0;
while (true) {
  idx = code.indexOf('bb', idx);
  if (idx === -1) break;
  // Print surrounding
  console.log(`Found 'bb' at index ${idx}:`);
  console.log(code.substring(idx - 100, idx + 100));
  idx += 2;
}
