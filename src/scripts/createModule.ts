import fs from "fs";
import path from "path";

const createModule = (moduleName: string): void => {
    const baseDir = path.join(__dirname, "../", "app", "modules", moduleName);
    console.log(__dirname, " dir name");

    const files = [
        `${moduleName}.routes.ts`,
        `${moduleName}.controller.ts`,
        `${moduleName}.model.ts`,
        `${moduleName}.service.ts`,
        `${moduleName}.interface.ts`,
        `${moduleName}.validation.ts`,
    ];

    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
        console.log(`Directory created: ${baseDir}`);
    } else {
        console.log(`Directory already exists: ${baseDir}`);
    }

    files.forEach((file) => {
        const filePath = path.join(baseDir, file);
        if (!fs.existsSync(filePath)) {
            let content = "";

            if (file.endsWith(".routes.ts")) {
                content = `import { Router } from 'express';\nimport { ${moduleName}Controller } from './${moduleName}.controller';\n\nconst router = Router();\n\n// Define routes\nrouter.get('/', ${moduleName}Controller.getAll);\n\nexport default router;\n`;
            } else if (file.endsWith(".controller.ts")) {
                content = `import { Request, Response } from 'express';\nimport { ${moduleName}Service } from './${moduleName}.service';\n\nexport const ${moduleName}Controller = {\n  async getAll(req: Request, res: Response) {\n    const data = await ${moduleName}Service.getAll();\n    res.json(data);\n  },\n};\n`;
            } else if (file.endsWith(".service.ts")) {
                content = `export const ${moduleName}Service = {\n  async getAll() {\n    // Example service logic\n    return [{ message: 'Service logic here' }];\n  },\n};\n`;
            } else if (file.endsWith(".interface.ts")) {
                content = `export interface I${capitalize(
                    moduleName
                )} {\n  id: string;\n  name: string;\n}\n`;
            } else if (file.endsWith(".validation.ts")) {
                content = `import { z } from 'zod';\n\nexport const ${moduleName}Validation = {\n  create: z.object({\n    name: z.string().min(1, 'Name is required'),\n  }),\n  update: z.object({\n    id: z.string().uuid('Invalid ID format'),\n    name: z.string().optional(),\n  }),\n};\n`;
            } else if (file.endsWith(".model.ts")) {
                content = `import { Schema, model, Document } from 'mongoose';\n\nexport interface I${capitalize(
                    moduleName
                )}Model extends Document {\n  name: string;\n  // add more fields here\n}\n\nconst ${moduleName}Schema = new Schema<I${capitalize(
                    moduleName
                )}Model>({\n  name: { type: String, required: true },\n  // add more fields here\n});\n\nconst ${moduleName}Model = model<I${capitalize(
                    moduleName
                )}Model>('${capitalize(
                    moduleName
                )}', ${moduleName}Schema);\n\nexport default ${moduleName}Model;\n`;
            }

            fs.writeFileSync(filePath, content, "utf-8");
            console.log(`File created: ${filePath}`);
        } else {
            console.log(`File already exists: ${filePath}`);
        }
    });
};

const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

const moduleName = process.argv[2];
if (!moduleName) {
    console.error("Please provide a module name.");
    process.exit(1);
}

createModule(moduleName);
