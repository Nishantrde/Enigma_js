// worker.js
const fs = require('fs');
const path = require('path');

const TASK_DIR = path.join(__dirname, 'tasks');
const PROCESSED_DIR = path.join(__dirname, 'processed');
const LOCK_FILE = path.join(__dirname, 'worker.lock');

// ensure dirs exist
if (!fs.existsSync(TASK_DIR)) fs.mkdirSync(TASK_DIR);
if (!fs.existsSync(PROCESSED_DIR)) fs.mkdirSync(PROCESSED_DIR);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create lock file (simple)
function setLock() {
  fs.writeFileSync(LOCK_FILE, String(process.pid), { flag: 'w' });
}
function removeLock() {
  try { fs.unlinkSync(LOCK_FILE); } catch (e) {}
}
function isLocked() {
  return fs.existsSync(LOCK_FILE);
}

// Atomically claim a task by renaming <name>.json -> <name>.processing
function claimTask() {
  const entries = fs.readdirSync(TASK_DIR).filter(f => !f.endsWith('.processing') && !f.startsWith('.'));
  if (entries.length === 0) return null;

  const file = entries[0]; // process oldest first (filesystem order)
  const src = path.join(TASK_DIR, file);
  const dest = path.join(TASK_DIR, file + '.processing');

  try {
    fs.renameSync(src, dest); // atomic on same fs
    return dest;
  } catch (err) {
    // couldn't rename -> probably raced with another process
    return null;
  }
}

async function processTaskFile(processingPath) {
  try {
    // mark worker busy
    setLock();
    console.log(`[worker] claimed ${processingPath}`);

    // read task
    const raw = fs.readFileSync(processingPath, 'utf8');
    const task = JSON.parse(raw);

    console.log(`[worker] processing task ${task.id} - start ${new Date().toISOString()}`);

    // Simulate 10s work with per-second logs
    for (let i = 1; i <= 10; i++) {
      console.log(`[task ${task.id}] ${i * 10}%`);
      await sleep(1000);
    }

    console.log(`[worker] finished task ${task.id} - ${new Date().toISOString()}`);

    // Move to processed
    const dest = path.join(PROCESSED_DIR, path.basename(processingPath).replace('.processing',''));
    fs.renameSync(processingPath, dest);
  } catch (err) {
    console.error('[worker] error processing task', err);
    // Attempt to clean up: if processing file exists, remove or move it back.
    try {
      if (fs.existsSync(processingPath)) {
        const failedDest = path.join(PROCESSED_DIR, 'failed-' + path.basename(processingPath).replace('.processing',''));
        fs.renameSync(processingPath, failedDest);
      }
    } catch (e) {
      console.error('[worker] cleanup error', e);
    }
  } finally {
    removeLock();
  }
}

async function mainLoop() {
  console.log('[worker] started, watching', TASK_DIR);
  while (true) {
    // If locked (another worker or previous run), wait
    if (isLocked()) {
      await sleep(500); // poll
      continue;
    }

    const claimed = claimTask();
    if (!claimed) {
      // no task or failed to claim — wait a bit and re-check
      await sleep(500);
      continue;
    }

    // We successfully claimed a task — process it synchronously
    await processTaskFile(claimed);
    // loop continues to check for next task
  }
}

// Start
mainLoop().catch(err => {
  console.error('Worker crashed', err);
  process.exit(1);
});
