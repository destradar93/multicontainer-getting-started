const express = require('express');
const os = require('os');

const router = express.Router();

router.get('/data/cpu', (req, res) => {
  const cpuLoad = os.loadavg()[0];

  res.json({ cpuLoad: cpuLoad });
});

module.exports = router;