const AmiClient = require('asterisk-ami-client');
require('dotenv').config();

const ami = new AmiClient();

async function connectAMI() {

  try {

    await ami.connect(
      process.env.AMI_USER,
      process.env.AMI_PASS,
      { host: '127.0.0.1', port: 5038 }
    );

    console.log('AMI Connected');

  } catch (err) {

    console.log('AMI reconnecting...');
    setTimeout(connectAMI, 5000);
  }
}

ami.on('disconnect', connectAMI);

connectAMI();

module.exports = ami;