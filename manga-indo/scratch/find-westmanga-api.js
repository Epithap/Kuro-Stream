import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const regex = /\/api\/[a-zA-Z0-9_\-/]+/g;
const matches = [...new Set(content.match(regex))];

console.log('--- Found API Routes ---');
console.log(matches);
