import { spawn } from 'node:child_process';

// Tauri accepts the literal strings "true" and "false" for --ci. Some CI
// providers set CI=1, which Tauri forwards as an invalid flag value.
if (process.env.CI === '1') process.env.CI = 'true';

const child = spawn(process.execPath, ['node_modules/@tauri-apps/cli/tauri.js', ...process.argv.slice(2)], { stdio: 'inherit' });
child.on('exit', (code, signal) => process.exitCode = code ?? (signal ? 1 : 0));
child.on('error', (error) => { console.error(error); process.exitCode = 1; });
