import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const target = 'function t(e,t){return Fb(e- -309,t)}';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log('t function found! Context:');
  console.log(content.substring(idx - 100, idx + 200));
} else {
  // Let's search for "return Fb(" or "e- -309"
  let idx2 = 0;
  while ((idx2 = content.indexOf('e- -309', idx2)) !== -1) {
    console.log('Found "e- -309" at index:', idx2);
    console.log(content.substring(idx2 - 100, idx2 + 100));
    idx2 += 7;
  }
}
