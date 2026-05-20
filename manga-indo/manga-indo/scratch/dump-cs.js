import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const idx = content.indexOf('function cs(){');
if (idx !== -1) {
  // Find the closing brace of function cs()
  // Since it starts with let e=`...`, let's find where it ends.
  // We can just dump 15000 characters from idx.
  console.log('--- cs ARRAY SOURCE ---');
  console.log(content.substring(idx, idx + 10000));
}
