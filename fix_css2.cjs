
const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

// Fix the bad replacements
content = content.replace(/  0;\n  0;/g, '  border-top-left-radius: 0;\n  border-top-right-radius: 0;');
content = content.replace(/  0;\n/g, '  border-radius: 0;\n'); // There might be others that were messed up.

fs.writeFileSync('src/index.css', content);

