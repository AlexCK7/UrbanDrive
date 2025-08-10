#!/usr/bin/env node
/* Ultra-safe reset utility: never deletes, single-use backup folder */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

if (process.env.CI) {
  console.error("❌ Refusing to run in CI.");
  process.exit(1);
}

// Ensure git is clean
try {
  const status = execSync("git status --porcelain", { stdio: ["ignore","pipe","pipe"] }).toString().trim();
  if (status) {
    console.error("❌ Git working tree is not clean. Commit or stash before running.");
    process.exit(1);
  }
} catch (e) {
  console.error("❌ Unable to read git status. Is this a git repo?");
  process.exit(1);
}

const root = process.cwd();
const srcDirs = ["app", "components", "hooks", "constants", "scripts"]; // adjust if you like
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = path.join(root, `backup-before-reset-${stamp}`);
const newAppDir = path.join(root, "app");

function rlq(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(res => rl.question(q, (ans) => { rl.close(); res(ans); }));
}

(async () => {
  console.log("⚠️  DANGEROUS OPERATION (safe-guarded) ⚠️");
  console.log("This will MOVE the listed folders to:", backupRoot);
  console.log("Folders:", srcDirs.join(", "));
  console.log();

  const phrase = await rlq("Type EXACTLY 'RESET URBANDRIVE' to proceed: ");
  if (phrase.trim() !== "RESET URBANDRIVE") {
    console.error("❌ Aborted (phrase mismatch).");
    process.exit(1);
  }

  await fs.promises.mkdir(backupRoot, { recursive: true });

  for (const d of srcDirs) {
    const p = path.join(root, d);
    if (fs.existsSync(p)) {
      const dest = path.join(backupRoot, d);
      await fs.promises.mkdir(path.dirname(dest), { recursive: true });
      await fs.promises.rename(p, dest);
      console.log(`➡️  Moved /${d} -> ${path.relative(root, dest)}`);
    }
  }

  // Re-seed minimal app
  await fs.promises.mkdir(newAppDir, { recursive: true });
  await fs.promises.writeFile(path.join(newAppDir, "index.tsx"),
`import { Text, View } from "react-native";
export default function Index() {
  return (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Text>Blank app</Text></View>);
}
`);
  await fs.promises.writeFile(path.join(newAppDir, "_layout.tsx"),
`import { Stack } from "expo-router";
export default function RootLayout(){ return <Stack /> }
`);

  console.log("\n✅ Done. Review the backup directory before deleting:");
  console.log(backupRoot);
})();
