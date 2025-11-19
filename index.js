// index.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const TASK_DIR = path.join(__dirname, 'tasks');
const PROCESSED_DIR = path.join(__dirname, 'processed');
const LOCK_FILE = path.join(__dirname, 'worker.lock');

// ensure dirs exist
if (!fs.existsSync(TASK_DIR)) fs.mkdirSync(TASK_DIR);
if (!fs.existsSync(PROCESSED_DIR)) fs.mkdirSync(PROCESSED_DIR);

// helper to check worker lock
function isWorkerBusy() {
  return fs.existsSync(LOCK_FILE);
}

// list queue (only files, not .processing)
function listQueue() {
  return fs.readdirSync(TASK_DIR)
    .filter(f => !f.endsWith('.processing') && !f.startsWith('.'));
}

app.post('/test', (req, res) => {
  // If worker busy -> respond "task in progress"
  if (isWorkerBusy()) {
    return res.status(409).json({ status: 'task in progress' });
  }

  // create a unique task file
  const id = Date.now() + '-' + Math.floor(Math.random() * 10000);
  const fileName = `${id}.json`;
  const filePath = path.join(TASK_DIR, fileName);

  const task = {
    id,
    createdAt: new Date().toISOString(),
    payload: req.body || {}
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(task), { flag: 'wx' });
  } catch (err) {
    console.error('Failed to write task file', err);
    return res.status(500).json({ status: 'error', error: 'could not create task' });
  }

  // Kick: worker will pick it up (it's separate process)
  return res.status(201).json({ status: 'task created', taskId: id });
});

app.get('/status', (req, res) => {
  const busy = isWorkerBusy();
  const queueFiles = listQueue();
  res.json({
    workerBusy: busy,
    queueLength: queueFiles.length,
    nextTask: queueFiles.length ? queueFiles[0] : null
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express server running: http://localhost:${PORT}`);
  console.log(`Task dir: ${TASK_DIR}`);
});
