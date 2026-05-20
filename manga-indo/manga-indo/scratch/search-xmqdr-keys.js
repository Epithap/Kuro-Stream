import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all-t-decrypted.json', 'utf8'));

console.log('Entries with key l3mC:');
console.log(data.filter(d => d.key === 'l3mC'));
console.log('\nEntries with key DOuN:');
console.log(data.filter(d => d.key === 'DOuN'));
console.log('\nEntries with key 1JJx:');
console.log(data.filter(d => d.key === '1JJx'));
