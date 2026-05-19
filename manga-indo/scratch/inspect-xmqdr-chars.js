import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const target = 'XMQDR:';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log('XMQDR found! Substring:');
  console.log(content.substring(idx, idx + 200));
  // Let's print individual characters/charCodes to see if there's any hidden character or different number
  const slice = content.substring(idx, idx + 200);
  for (let i = 0; i < slice.length; i++) {
    console.log(`${i}: "${slice[i]}" (code: ${slice.charCodeAt(i)})`);
  }
} else {
  console.log('XMQDR not found');
}
