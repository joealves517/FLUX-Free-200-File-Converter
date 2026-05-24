import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDirs = [
  path.join(__dirname, 'messages'),
  path.join(__dirname, 'src'),
];

const targetFiles = [
  path.join(__dirname, 'package.json'),
  path.join(__dirname, 'wxt.config.ts'),
  path.join(__dirname, 'README.md'),
];

// Rename VERT_Feature.webp to FLUX_Feature.webp
const oldImagePath = path.join(__dirname, 'src', 'lib', 'assets', 'VERT_Feature.webp');
const newImagePath = path.join(__dirname, 'src', 'lib', 'assets', 'FLUX_Feature.webp');

if (fs.existsSync(oldImagePath)) {
  try {
    fs.renameSync(oldImagePath, newImagePath);
    console.log(`[Renamed Asset] VERT_Feature.webp -> FLUX_Feature.webp`);
  } catch (error) {
    console.error('Error renaming VERT_Feature.webp:', error);
  }
}

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Temporarily protect VERTD-related uppercase constants
    content = content.replace(/GITHUB_URL_VERTD/g, '__GITHUB_URL_VERTD__');
    content = content.replace(/PUB_VERTD_URL/g, '__PUB_VERTD_URL__');

    // 2. Replace VERT_NAME to FLUX_NAME
    content = content.replace(/VERT_NAME/g, 'FLUX_NAME');
    
    // 3. Replace GITHUB_URL_VERT to GITHUB_URL_FLUX
    content = content.replace(/GITHUB_URL_VERT/g, 'GITHUB_URL_FLUX');

    // 4. Replace VERT_Feature.webp reference
    content = content.replace(/VERT_Feature\.webp/g, 'FLUX_Feature.webp');

    // 5. Replace standalone "VERT" (case sensitive, global) to "FLUX"
    content = content.replace(/VERT/g, 'FLUX');
    content = content.replace(/vert\.sh/g, 'flux.sh');
    content = content.replace(/hello@vert\.sh/g, 'hello@flux.sh');

    // 6. Restore VERTD-related constants
    content = content.replace(/__GITHUB_URL_VERTD__/g, 'GITHUB_URL_VERTD');
    content = content.replace(/__PUB_VERTD_URL__/g, 'PUB_VERTD_URL');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[Replaced] ${path.relative(__dirname, filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

function scanDir(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules, .wxt, .output, .git, paraglide compiled folders
        if (file === 'node_modules' || file === '.wxt' || file === '.output' || file === '.git' || file === 'paraglide') {
          continue;
        }
        scanDir(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(file);
        if (['.json', '.svelte', '.ts', '.js', '.scss', '.css', '.html', '.md'].includes(ext)) {
          replaceInFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
}

console.log('Starting renaming process from VERT to FLUX...');

// Scan target directories
for (const dir of targetDirs) {
  if (fs.existsSync(dir)) {
    scanDir(dir);
  }
}

// Process target files
for (const file of targetFiles) {
  if (fs.existsSync(file)) {
    replaceInFile(file);
  }
}

console.log('Renaming process completed successfully!');
