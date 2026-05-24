const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.svelte') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;
    
    // Replace $app/environment
    if (content.includes('import { browser } from "$app/environment";')) {
        content = content.replace(/import\s+{\s*browser\s*}\s+from\s+"\$app\/environment";/g, 'const browser = typeof window !== "undefined";');
        changed = true;
    } else if (content.includes('$app/environment')) {
        content = content.replace(/import\s+{\s*([^}]+)\s*}\s+from\s+"\$app\/environment";/g, 'const $1 = typeof window !== "undefined"; /* MOCKED */');
        changed = true;
    }

    // Replace $app/navigation
    if (content.includes('$app/navigation')) {
        content = content.replace(/import\s+.*?\s+from\s+"\$app\/navigation";/g, '/* Removed $app/navigation */\nconst goto = (url) => { window.location.href = url; };');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(f, content, 'utf8');
        console.log('Updated ' + f);
    }
});
