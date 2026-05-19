import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/decrypted-rb-strings.json', 'utf8'));
console.log('Decrypted Strings:');
console.log(JSON.stringify(data, null, 2));
