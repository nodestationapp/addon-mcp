#!/usr/bin/env node

import fs from "fs";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { runCommand, rootPath } from "@nstation/utils";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[2] === "generate") {
  const baseUrl = process.env?.PUBLIC_URL;

  try {
    let swaggerPath;
    let mcpBinPath;

    const nodeModulesPath = path.join(
      rootPath,
      "node_modules",
      "@nstation",
      "addon-documentation",
      "server",
      "swagger.json"
    );

    const pluginsPath = path.join(
      rootPath,
      "plugins",
      "docs",
      "server",
      "swagger.json"
    );

    if (fs.existsSync(nodeModulesPath)) {
      swaggerPath = nodeModulesPath;
      mcpBinPath = path.join(
        rootPath,
        "node_modules",
        ".bin",
        "openapi-mcp-generator"
      );
    } else if (fs.existsSync(pluginsPath)) {
      swaggerPath = pluginsPath;
      mcpBinPath = path.join(
        rootPath,
        "plugins",
        "mcp",
        "node_modules",
        ".bin",
        "openapi-mcp-generator"
      );
    } else {
      throw new Error("Documentation plugin not found");
    }

    const mcpFolderDir = path.join(__dirname, "mcp-server");

    if (fs.existsSync(mcpFolderDir)) {
      fs.rmSync(mcpFolderDir, { recursive: true });
    }

    await runCommand({
      cmd: mcpBinPath,
      __dirname: __dirname,
      args: [
        "--input",
        swaggerPath,
        "--output",
        "./mcp-server",
        "--base-url",
        baseUrl,
      ],
    });

    await runCommand({
      cmd: "npm",
      args: ["install"],
      __dirname: mcpFolderDir,
    });

    await runCommand({
      cmd: "npm",
      args: ["run", "build"],
      __dirname: mcpFolderDir,
    });
  } catch (err) {
    console.error(err);
  }
}
