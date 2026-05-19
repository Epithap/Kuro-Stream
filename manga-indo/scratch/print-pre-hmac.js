import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const idx = 598708;
console.log('--- Code before _hmac definition ---');
console.log(content.substring(idx - 1500, idx));
