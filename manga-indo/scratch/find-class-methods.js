import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const startIdx = 582000;
const endIdx = 600000;

console.log('Searching for method definitions between 582000 and 600000...');

let idx = startIdx;
while (true) {
  idx = code.indexOf('async ', idx);
  if (idx === -1 || idx > endIdx) break;
  console.log(`Found 'async' at index ${idx}:`);
  console.log(code.substring(idx - 50, idx + 200));
  idx += 6;
}

idx = startIdx;
while (true) {
  idx = code.indexOf('get ', idx);
  if (idx === -1 || idx > endIdx) break;
  console.log(`Found 'get' at index ${idx}:`);
  console.log(code.substring(idx - 50, idx + 200));
  idx += 4;
}
