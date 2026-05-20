const b64 = 'U2FsdGVkX1/d15RGXgbiDR9ygJcJxQUttNV4ws+Uzzw=';
const buf = Buffer.from(b64, 'base64');
console.log('Decoded bytes size:', buf.length);
console.log('Decoded ASCII prefix:', buf.slice(0, 8).toString('ascii'));
console.log('Hex representation:', buf.toString('hex'));
