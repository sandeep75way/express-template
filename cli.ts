import fs from "fs";
import path from "path";

function createModule(module: string) {
  const folderPath = path.join(__dirname, "app", module);

  // Check if the folder already exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`Created module: ${module}`);
  } else {
    console.log(`Module already exists: ${module}`);
  }

  // Define the files to create
  const files = ["schema", "dto", "service", "route", "validation"];

  // Create each file with a basic template
  files.forEach((file) => {
    const filePath = path.join(folderPath, `${module}.${file}.ts`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `// ${file} content`);
      console.log(`Created ${file}`);
    } else {
      console.log(`File already exists: ${filePath}`);
    }
  });
}

if (!process.argv[2]) {
  console.error("Please provide module name.");
  process.exit(1);
}

createModule(process.argv[2]);
