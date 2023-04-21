const os = require('os');

const getMacAddress = () => {
    const macRegex = /[^\w]/g;
    const networkInterfaces = os.networkInterfaces();
    const interfaces = Object.values(networkInterfaces);
    const interfaceArr = interfaces.reduce((acc, val) => acc.concat(val), []);
    const interfaceObj = interfaceArr.find(obj => obj.mac !== '00:00:00:00:00:00' && obj.internal === false);
  
    if (interfaceObj) {
      return interfaceObj.mac.toUpperCase().replace(/:/g, '').replace(macRegex, '').toUpperCase();
    } else {
      return null;
    }
  }

  module.exports = {getMacAddress};