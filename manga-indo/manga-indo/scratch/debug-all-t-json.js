import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all-t-decrypted.json', 'utf8'));
console.log('Total entries:', data.length);
console.log('Entry at index 0:', data[0]);
console.log('Entries containing x-wm:', data.filter(d => d.val.includes('x-wm')));
console.log('Entries with e=184:', data.filter(d => d.e === 184));
