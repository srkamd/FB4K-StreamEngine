/**
 * Node.js Native Test Runner Bridge
 * Dispatches to Python test suite or executes Node assertion checks.
 */

const { spawn } = require('child_process');
const path = require('path');

const pyScript = path.join(__dirname, 'run_all_tests.py');
const pyProc = spawn('python', [pyScript], { stdio: 'inherit' });

pyProc.on('close', (code) => {
  process.exit(code);
});
