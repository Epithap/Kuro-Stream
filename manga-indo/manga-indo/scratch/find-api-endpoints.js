import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

// Find all occurrences of /api/ or api/
let idx = 0;
while (true) {
  idx = code.indexOf('/api/', idx);
  if (idx === -1) break;
  console.log(`Found '/api/' at index ${idx}:`);
  console.log(code.substring(idx - 100, idx + 200));
  idx += 5;
}
