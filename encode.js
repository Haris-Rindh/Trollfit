const fs = require('fs');
const src = 'C:\\Users\\Global\\.gemini\\antigravity-ide\\brain\\a2bdb463-82b1-42e8-aecd-6214e11a9d9c\\magical_torn_tee_1779540869822.png';
const base64 = fs.readFileSync(src).toString('base64');
fs.writeFileSync('base64.txt', base64);
console.log('done');
