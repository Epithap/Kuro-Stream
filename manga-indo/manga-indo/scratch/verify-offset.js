import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all-t-decrypted.json', 'utf8'));

const match = data.find(d => d.e === 226 && d.key === '0cSO');
console.log('e=226 with key 0cSO:', match);
