import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all-t-decrypted.json', 'utf8'));

console.log('Entries with e=782:', data.filter(d => d.e === 782));
// Let's also search for all decrypted values that look like regex parts!
console.log('Entries with Z_$:');
console.log(data.filter(d => d.val.includes('Z_$')));
