import { Project, SyntaxKind, Node, JsxOpeningElement, JsxSelfClosingElement } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const apps = ["public", "municipality", "contractor", "admin"];
const project = new Project();
const extractedStrings: Record<string, string> = {};

function generateKey(text: string) {
  return "ui." + text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').substring(0, 30);
}

function processApp(appName: string) {
  const dir = path.join("c:/Users/maher/OneDrive/Desktop/JANMIND", `apps/${appName}/src`);
  project.addSourceFilesAtPaths([`${dir}/components/**/*.tsx`, `!${dir}/components/ui/**/*.tsx`]);
  project.addSourceFilesAtPaths(`${dir}/routes/**/*.tsx`);

  const sourceFiles = project.getSourceFiles();

  for (const sourceFile of sourceFiles) {
    let modified = false;
    let needsI18n = false;

    // 1. Process JSX Text
    const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
    for (const jsxText of jsxTexts) {
      const text = jsxText.getLiteralText();
      const trimmed = text.trim();
      // Heuristic: ignore short numeric strings or pure punctuation
      if (trimmed.length > 0 && /[a-zA-Z]/.test(trimmed)) {
        const key = generateKey(trimmed);
        extractedStrings[key] = trimmed;
        // Watch out for trailing spaces that we might lose?
        // Let's replace the whole text safely
        jsxText.replaceWithText(`{t('${key}')}`);
        needsI18n = true;
        modified = true;
      }
    }

    // 2. Process specific JSX Attributes
    const attrsToTranslate = ["placeholder", "title", "aria-label", "label"];
    const jsxAttributes = sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute);
    for (const attr of jsxAttributes) {
      const name = attr.getNameNode().getText();
      if (attrsToTranslate.includes(name)) {
        const initializer = attr.getInitializer();
        if (Node.isStringLiteral(initializer)) {
          const text = initializer.getLiteralValue();
          const trimmed = text.trim();
          if (trimmed.length > 0 && /[a-zA-Z]/.test(trimmed)) {
            const key = generateKey(trimmed);
            extractedStrings[key] = trimmed;
            initializer.replaceWithText(`{t('${key}')}`);
            needsI18n = true;
            modified = true;
          }
        }
      }
    }

    // 3. Inject useI18n
    if (needsI18n) {
      // Add import
      const importDeclarations = sourceFile.getImportDeclarations();
      const hasImport = importDeclarations.some(d => d.getModuleSpecifierValue() === "@/lib/i18n");
      if (!hasImport) {
        sourceFile.addImportDeclaration({
          namedImports: ["useI18n"],
          moduleSpecifier: "@/lib/i18n"
        });
      }

      // Add hook to functions returning JSX
      const functions = [
        ...sourceFile.getFunctions(),
        ...sourceFile.getVariableDeclarations()
          .filter(v => v.getInitializerIfKind(SyntaxKind.ArrowFunction))
          .map(v => v.getInitializerIfKind(SyntaxKind.ArrowFunction)!)
      ];

      for (const func of functions) {
        const hasJsx = func.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 || 
                       func.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0 ||
                       func.getDescendantsOfKind(SyntaxKind.JsxFragment).length > 0;
        
        if (hasJsx) {
          let bodyNode: Node | undefined = undefined;
          if (Node.isFunctionDeclaration(func) || Node.isFunctionExpression(func)) {
             bodyNode = func.getBody();
          } else if (Node.isArrowFunction(func)) {
             bodyNode = func.getBody();
             // If arrow function has no block body, e.g. `() => <div/>`, we need to wrap it.
             // ts-morph makes it easy, but for simplicity we might skip or do it manually.
             if (!Node.isBlock(bodyNode)) {
                 // wrap in block
                 const text = bodyNode.getText();
                 func.setBodyText(`const { t } = useI18n();\nreturn ${text};`);
                 continue;
             }
          }
          
          if (bodyNode && Node.isBlock(bodyNode)) {
            const hasHook = bodyNode.getStatements().some(s => s.getText().includes("useI18n()"));
            if (!hasHook) {
              bodyNode.insertStatements(0, `const { t } = useI18n();`);
            }
          }
        }
      }
    }

    if (modified) {
      sourceFile.saveSync();
      console.log(`Modified: ${sourceFile.getFilePath()}`);
    }
  }
}

for (const app of apps) {
  console.log(`Processing ${app}...`);
  processApp(app);
}

fs.writeFileSync("c:/Users/maher/OneDrive/Desktop/CivicSathi/extracted_strings.json", JSON.stringify(extractedStrings, null, 2));
console.log("Done extracting strings.");

