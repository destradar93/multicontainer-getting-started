const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path')
const routes = require('./routes');
const {
  exec
} = require('child_process');


let app = express();

let server = http.createServer(app);
let io = socketio(server);
app.use('', routes);

const getCpuLoad = (socket) => {
  exec('cat /proc/loadavg', (err, text) => {
    if (err) {
      throw err;
    }
    // Get overall average from last minute
    const matchLoad = text.match(/(\d+\.\d+)\s+/);
    if (matchLoad) {
      const load = parseFloat(matchLoad[1]);
      socket.emit('loadavg', {
        onemin: load
      });
    }
  });
};

const getMemoryInfo = (socket) => {
  exec('cat /proc/meminfo', (err, text) => {
    if (err) {
      throw err;
    }
    // Get overall average from last minute
    const matchTotal = text.match(/MemTotal:\s+([0-9]+)/);
    const matchFree = text.match(/MemFree:\s+([0-9]+)/);
    if (matchTotal && matchFree) {
      const total = parseInt(matchTotal[1], 10);
      const free = parseInt(matchFree[1], 10);
      const percentageUsed = (total - free) / total * 100;
      socket.emit('memory', {
        used: percentageUsed
      });
    }
  });
};

io.on('connection', function(socket) {
  'use strict';
  console.log('a user connected');
  let dataLoop = setInterval(function() {
    getCpuLoad(socket);
    getMemoryInfo(socket);
  }, 1000);
	socket.on('disconnect', function() {
      console.log('a user disconnected');
			clearInterval(dataLoop);
   });
});

const collectMetricsData = () => {
  const timestamp = Date.now();
  const cpuLoad = os.loadavg()[0];
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const dataPoint = {timestamp, cpuLoad, usedMemory};

  const folderPath = path.join(process.env.VOLUME_PATH, process.env.METRICS_FOLDER_NAME)

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  
  const filePath = `${folderPath}/${timestamp}.json`;
  try {
    fs.writeFileSync(filePath, JSON.stringify(dataPoint));
    console.log(`Metrics data written to file at ${filePath}`);
  } catch (error) {
    console.error(`Error writing data to file: ${error}`);
  }
};

setInterval(collectMetricsData, 60000);
server.listen(8080);
