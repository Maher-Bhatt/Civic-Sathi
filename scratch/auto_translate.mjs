import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';

const APPS = ["admin", "contractor", "municipality", "public"];
const TARGET_LANGS = {
  hi: "hi",
  gu: "gu",
  kn: "kn"
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function processTranslations() {
  for (const app of APPS) {
    const filePath = path.resolve(`apps/${app}/src/lib/translations.ts`);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf-8');

    // Extract the 'en: {' block
    const enBlockMatch = content.match(/en:\s*\{([\s\S]*?)\n  \},/);
    if (!enBlockMatch) {
      console.log(`Could not find 'en' block in ${app}`);
      continue;
    }

    const enKeys = {};
    const regex = /"([^"]+)"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let match;
    while ((match = regex.exec(enBlockMatch[1])) !== null) {
      enKeys[match[1]] = match[2];
    }

    let modifiedContent = content;

    for (const [langCode, gTranslateCode] of Object.entries(TARGET_LANGS)) {
      const blockRegex = new RegExp(`${langCode}:\\s*\\{([\\s\\S]*?)\\n  \\},?`);
      const langBlockMatch = modifiedContent.match(blockRegex);
      if (!langBlockMatch) {
        console.log(`Could not find '${langCode}' block in ${app}`);
        continue;
      }

      const existingKeys = new Set();
      let match2;
      while ((match2 = regex.exec(langBlockMatch[1])) !== null) {
        existingKeys.add(match2[1]);
      }

      const missingKeys = Object.keys(enKeys).filter(k => !existingKeys.has(k));
      if (missingKeys.length === 0) {
        console.log(`[${app}] '${langCode}' is up to date.`);
        continue;
      }

      console.log(`[${app}] Translating ${missingKeys.length} missing keys for '${langCode}'...`);
      
      const newItems = [];
      // Translate in small batches to avoid rate limits
      const BATCH_SIZE = 5;
      for (let i = 0; i < missingKeys.length; i += BATCH_SIZE) {
        const batchKeys = missingKeys.slice(i, i + BATCH_SIZE);
        const promises = batchKeys.map(async (k) => {
          const originalText = enKeys[k].replace(/\\"/g, '"').replace(/\\n/g, '\n');
          try {
            const res = await translate(originalText, { to: gTranslateCode });
            return { key: k, text: res.text };
          } catch (e) {
            console.error(`Error translating key ${k}:`, e.message);
            return { key: k, text: originalText }; // Fallback to English on error
          }
        });

        const results = await Promise.all(promises);
        for (const res of results) {
          const safeText = res.text.replace(/"/g, '\\"').replace(/\n/g, '\\n');
          newItems.push(`    "${res.key}": "${safeText}",`);
        }
        await delay(500); // 500ms delay between batches
      }

      // Insert into content
      const insertIdx = langBlockMatch.index + langBlockMatch[0].lastIndexOf('  }');
      modifiedContent = 
        modifiedContent.slice(0, insertIdx) + 
        newItems.join('\n') + '\n' + 
        modifiedContent.slice(insertIdx);
      
      console.log(`[${app}] Inserted ${newItems.length} keys for '${langCode}'.`);
    }

    if (modifiedContent !== content) {
      fs.writeFileSync(filePath, modifiedContent, 'utf-8');
      console.log(`[${app}] Saved translations.ts`);
    }
  }
}

processTranslations().then(() => console.log("Done."));
