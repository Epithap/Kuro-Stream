import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const idx = content.indexOf('STqXd');
if (idx !== -1) {
  console.log('--- OBJ DEF ---');
  console.log(content.substring(idx - 500, idx + 1500));
}
