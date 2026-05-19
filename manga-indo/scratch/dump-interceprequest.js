import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

// Find intercepRequest inside the file
const startIdx = content.indexOf('intercepRequest');
if (startIdx !== -1) {
  console.log('intercepRequest found! Content:');
  console.log(content.substring(startIdx, startIdx + 3000));
} else {
  console.log('intercepRequest not found');
}
