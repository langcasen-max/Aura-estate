import fs from 'node:fs';
import path from 'node:path';

const filesToRemove = [
  'bun.lock',
  'bun.lockb',
  '.bun',
];

let removedCount = 0;

for (const target of filesToRemove) {
  const fullPath = path.resolve(process.cwd(), target);
  if (fs.existsSync(fullPath)) {
    try {
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(fullPath);
      }
      removedCount++;
      console.log(`[Cloudflare Pre-Build] Automatically removed: ${target}`);
    } catch (err) {
      console.warn(`[Cloudflare Pre-Build] Notice: Unable to remove ${target}:`, err.message);
    }
  }
}

if (removedCount === 0) {
  console.log('[Cloudflare Pre-Build] Workspace clean: No bun.lock files detected.');
}
