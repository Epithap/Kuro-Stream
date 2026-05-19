import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all-t-decrypted.json', 'utf8'));

console.log('Entries with e=117:', data.filter(d => d.e === 117));
console.log('Entries with e=-94:', data.filter(d => d.e === -94));
console.log('Entries with e=248:', data.filter(d => d.e === 248));
console.log('Entries with e=159:', data.filter(d => d.e === 159));
console.log('Entries with e=723:', data.filter(d => d.e === 723));
console.log('Entries with e=301:', data.filter(d => d.e === 301));
console.log('Entries with e=74:', data.filter(d => d.e === 74));
console.log('Entries with e=671:', data.filter(d => d.e === 671));
console.log('Entries with e=223:', data.filter(d => d.e === 223));
console.log('Entries with e=257:', data.filter(d => d.e === 257));
