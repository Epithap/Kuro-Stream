import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const target = 'async[Fb(428';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log(`Found "${target}" at index ${idx}:`);
  console.log(content.substring(idx - 100, idx + 3000));
} else {
  // Try searching for "async[Fb(" or just "async["
  let idx2 = 0;
  while ((idx2 = content.indexOf('async[', idx2)) !== -1) {
    console.log(`Found "async[" at index ${idx2}:`);
    console.log(content.substring(idx2 - 50, idx2 + 400));
    idx2 += 6;
  }
}
