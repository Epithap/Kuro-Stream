import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const regex = /function t\([a-zA-Z0-9,]*\)\{/g;
const matches = [...new Set(content.match(regex))];

console.log('--- Found t functions ---');
console.log(matches);

// Let's print occurrences and their surroundings
let idx = 0;
while ((idx = content.indexOf('function t(', idx)) !== -1) {
  console.log(`Found "function t(" at index ${idx}:`);
  console.log(content.substring(idx - 100, idx + 200));
  idx += 10;
}
