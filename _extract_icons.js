const fs = require('fs');
const icons = ['js','ts','python','cpp','react','cloudflare','github','docker','vercel','pr','ae'];
const result = {};
for (const name of icons) {
  const raw = fs.readFileSync('public/icons/' + name + '.svg', 'utf8').replace(/\r\n/g,'\n');
  // Extract inner <svg> from inside the <g transform="translate(0, 0)"> wrapper
  const match = raw.match(/<g[^>]*>\s*(<svg[\s\S]*?<\/svg>)\s*<\/g>/);
  const inner = match ? match[1] : raw;
  result[name] = inner.replace(/\s+/g, ' ').trim();
  console.log(name + ': ' + result[name].length + ' chars');
}
fs.writeFileSync('../_icon_data.json', JSON.stringify(result, null, 2));
console.log('Done.');
