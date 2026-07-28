
const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

const exceptions = [
  '.fab',
  '.celebration-checkmark',
  '.celebration-checkmark-small',
  '.rank-avatar',
  '.avatar-placeholder',
  '.progress-bar-container',
  '.progress-bar-fill',
  '.celebration-progress-bar',
  '.celebration-progress-previous',
  '.celebration-progress-new'
];

let lines = content.split('\n');
let currentSelectors = [];
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.includes('{')) {
    // try to get selector
    let selectorPart = line.split('{')[0].trim();
    if (selectorPart) {
      currentSelectors.push(selectorPart);
    }
  }
  
  if (line.match(/border(-[a-z]+)*-radius:/)) {
    let isException = false;
    for (const sel of exceptions) {
      if (currentSelectors.length > 0 && currentSelectors[currentSelectors.length - 1].includes(sel)) {
        isException = true;
        break;
      }
    }
    // Also, if it is 50%, the user said 'replace Npx', so we only replace numbers like 10px or 20px
    if (!isException && line.match(/[0-9]+px/)) {
      lines[i] = line.replace(/(border(-[a-z]+)*-radius:)[^;]+;/, '\ 0;');
    }
  }
  
  if (line.includes('}')) {
    currentSelectors.pop();
  }
}

content = lines.join('\n');

// 2. Remove linear-gradient
content = content.replace('.xp-section {\n  background: linear-gradient(135deg, rgba(196, 226, 245, 0.5) 0%, rgba(75, 184, 250, 0.1) 100%);', 
                          '.xp-section {\n  background-color: var(--secondary-light-blue);');
content = content.replace('.progress-bar-fill {\n  height: 100%;\n  background: linear-gradient(90deg, #10B981, var(--success-green), #4ADE80);',
                          '.progress-bar-fill {\n  height: 100%;\n  background-color: var(--primary-blue);');
content = content.replace('background: linear-gradient(135deg, var(--dark-nav) 0%, #1591DC 100%);', 'background-color: var(--dark-nav);');
content = content.replace('background: linear-gradient(135deg, rgba(196, 226, 245, 0.2), rgba(196, 226, 245, 0.08));', 'background-color: rgba(196, 226, 245, 0.15);');
content = content.replace('background: linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(245, 158, 11, 0.02));', 'background-color: rgba(245, 158, 11, 0.15);');
content = content.replace('background: linear-gradient(135deg, rgba(156, 163, 175, 0.06), rgba(156, 163, 175, 0.02));', 'background-color: rgba(156, 163, 175, 0.15);');
content = content.replace('background: linear-gradient(135deg, rgba(217, 119, 6, 0.06), rgba(217, 119, 6, 0.02));', 'background-color: rgba(217, 119, 6, 0.15);');
content = content.replace('background: linear-gradient(135deg, var(--dark-nav) 0%, var(--primary-accent) 100%);', 'background-color: var(--dark-nav);'); // 1139
content = content.replace('background: linear-gradient(135deg, var(--dark-nav) 0%, var(--primary-accent) 100%);', 'background-color: var(--dark-nav);'); // 1312
content = content.replace('background: linear-gradient(135deg, #1591DC 0%, #4BB8FA 100%);', 'background-color: #1591DC;');
content = content.replace('background: linear-gradient(180deg, #FFFFFF 0%, rgba(196, 226, 245, 0.15) 100%);', 'background-color: rgba(196, 226, 245, 0.15);');

// 3. Simplify XP section styles
content = content.replace('.level-badge {\n  background: #1591DC;\n  color: #fff;\n  padding: 4px 12px;\n  border-radius: 12px;\n  font-size: 12px;\n  font-weight: 700;\n}',
                          '.level-badge {\n  background: none;\n  color: var(--text-primary);\n  padding: 0;\n  font-size: 14px;\n  font-weight: 700;\n}');

// 4. Add .status-sob-analise style
if (!content.includes('.status-badge.sob-analise')) {
  content = content.replace('.status-badge.pendente {\n  background-color: rgba(59, 130, 246, 0.1);\n  color: var(--pending-blue);\n}', 
                            '.status-badge.pendente {\n  background-color: rgba(59, 130, 246, 0.1);\n  color: var(--pending-blue);\n}\n\n.status-badge.sob-analise {\n  background-color: rgba(21, 145, 220, 0.1);\n  color: var(--pending-blue);\n}');
}

fs.writeFileSync('src/index.css', content);
console.log('Done');

