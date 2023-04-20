const express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');

const router = express.Router();
metricsDir = path.join(process.env.VOLUME_PATH, process.env.METRICS_FOLDER_NAME, '/')

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

router.get('/data/cpu/historic', (req, res) => {
  fs.readdir(metricsDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving metrics');
    }

    const cpuMetrics = files.map((file) => {
      const data = fs.readFileSync(path.join(metricsDir, file));
      metric = JSON.parse(data)
      const timestamp = metric.timestamp;
      const cpuLoad = metric.cpuLoad;

      return {timestamp, cpuLoad};
    });
    res.json(cpuMetrics);
  });
});

router.get('/data/memory/historic', (req, res) => {
  fs.readdir(metricsDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving metrics');
    }

    const memoryMetrics = files.map((file) => {
      const data = fs.readFileSync(path.join(metricsDir, file));
      metric = JSON.parse(data)
      const timestamp = metric.timestamp;
      const usedMemory = metric.usedMemory;

      return {timestamp, usedMemory};
    });
    res.json(memoryMetrics);
  });
});

module.exports = router;