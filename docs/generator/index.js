const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

async function generator(docs, config) {
  const docsPath = path.join(process.cwd(), "docs/custom");
  const componentsPath = path.join(docsPath, "components");

  if (fs.existsSync(docsPath)) {
    fs.rmdirSync(docsPath, { recursive: true });
  }
  if (fs.existsSync(componentsPath)) {
    fs.rmdirSync(componentsPath, { recursive: true });
  }

  fs.mkdirSync(docsPath, { recursive: true });
  fs.mkdirSync(componentsPath);

  const cheatsheet = {};
  const writeFile = promisify(fs.writeFile);

  for (const component of docs.components) {
    const componentPath = path.join(componentsPath, `${component.tag}.json`);

    delete component.dirPath;
    delete component.readmePath;
    delete component.usagesDir;
    
    try {
      await writeFile(componentPath, JSON.stringify(component, null, 2));

      cheatsheet[component.tag] = {
        source: config.component
      };

      if (component.docsTags) {
        for (const { name, text } of component.docsTags) {
          if (name === 'disable' && text.trim() === 'cheatsheet') {
            cheatsheet[component.tag].disableCheatsheet = true;
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }

    // fs.writeFileSync(path.join(docsPath, "cheatsheet.json"), JSON.stringify(cheatsheet));
    fs.writeFileSync(path.join(docsPath, "cheatsheet.json"), JSON.stringify(cheatsheet, null, 2));
  }
}

module.exports = { generator };
