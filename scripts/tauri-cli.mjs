import { spawn } from 'node:child_process';

// Tauri accepts the literal strings "true" and "false" for --ci. Some CI
// providers set CI=1, which Tauri forwards as an invalid flag value.
if (process.env.CI === '1') process.env.CI = 'true';

const executable = process.platform === 'win32' ? 'node_modules/.bin/tauri.cmd' : 'node_modules/.bin/tauri';
const child = spawn(executable, process.argv.slice(2), { stdio: 'inherit', shell: process.platform === 'win32' });
child.on('exit', (code, signal) => process.exitCode = code ?? (signal ? 1 : 0));
child.on('error', (error) => { console.error(error); process.exitCode = 1; });
