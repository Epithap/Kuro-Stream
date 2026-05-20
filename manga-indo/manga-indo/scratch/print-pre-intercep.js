import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const target = 'async[Fb(428';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log('--- Code before intercepRequest ---');
  console.log(content.substring(idx - 500, idx));
}
