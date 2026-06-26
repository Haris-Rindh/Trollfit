const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('Starting Next.js dev server...');
  const output = execSync('node ./node_modules/next/dist/bin/next dev', { stdio: 'pipe' });
  fs.writeFileSync('server.log', output);
} catch (e) {
  console.log('Error occurred!');
  fs.writeFileSync('server.log', e.stdout || '');
  fs.appendFileSync('server.log', '\n\nERROR:\n' + e.stderr || e.message);
}
