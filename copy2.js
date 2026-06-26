const fs = require('fs');

const src = 'C:\\Users\\Global\\.gemini\\antigravity-ide\\brain\\a2bdb463-82b1-42e8-aecd-6214e11a9d9c\\magical_torn_tee_1779540869822.png';
const dest = 'c:\\Users\\Global\\OneDrive\\Documents\\Doc\\Web\\TrollFit\\src\\animated-tee.png';

fs.copyFileSync(src, dest);
console.log('Copied successfully!');
