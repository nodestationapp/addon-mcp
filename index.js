#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { runCommand } from "@nstation/utils";

if (process.argv[2] === "generate") {
  console.log(process.env);
  try {
    const mcpFolderDir = path.join("./", "mcp-server");

    if (fs.existsSync(mcpFolderDir)) {
      fs.rmSync(mcpFolderDir, { recursive: true });
    }

    await runCommand({
      cmd: "npm",
      args: ["run", "generate-mcp"],
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
