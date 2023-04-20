const express = require('express');
const os = require('os');

const router = express.Router();

router.get('/data/cpu', (req, res) => {
  const cpuLoad = os.loadavg()[0];

  res.json({ cpuLoad: cpuLoad });
});

router.get('/data/memory', (req, res) => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const percentageUsed = (usedMemory / totalMemory) * 100;

  res.json({ totalMemory, freeMemory, usedMemory, percentageUsed });
});

module.exports = router;