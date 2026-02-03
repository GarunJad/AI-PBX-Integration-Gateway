const WebSocket = require('ws');
const axios = require('axios');
const db = require('./db');
require('dotenv').config();

const ARI_URL = 'http://localhost:8088/asterisk/ari';

function auth() {
  return {
    username: process.env.ARI_USER,
    password: process.env.ARI_PASS
  };
}

const activeRecordings = new Map();

function connectARI() {

  const ws = new WebSocket(
    `ws://127.0.0.1:8088/asterisk/ari/events?app=ai-bridge&subscribeAll=true`,
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.ARI_USER}:${process.env.ARI_PASS}`)
          .toString('base64')
      }
    }
  );

  ws.on('open', () => {
    console.log('ARI Connected (ai-bridge active)');
  });

  ws.on('message', async msg => {

    const e = JSON.parse(msg);

    if (e.type === 'StasisStart') {

      const ch = e.channel.id;

      console.log('AI Call:', ch);

      try {

        await axios.post(
          `${ARI_URL}/channels/${ch}/answer`,
          {},
          { auth: auth() }
        );

        await axios.post(
          `${ARI_URL}/channels/${ch}/play`,
          { media: 'sound:demo-congrats' },
          { auth: auth() }
        );

        const recName = `rec-${Date.now()}`;

        activeRecordings.set(recName, ch);

        await axios.post(
          `${ARI_URL}/channels/${ch}/record`,
          {
            name: `/var/spool/asterisk/recording/${recName}`,
            format: 'wav',
            maxDurationSeconds: 10,
            beep: true
          },
          { auth: auth() }
        );

        console.log('Recording Started:', recName);

      } catch (err) {
        console.error('ARI Action Error:', err.message);
      }
    }

    if (e.type === 'RecordingFinished') {

      const recFile =
        e.recording.name.replace(/^.*\//, '');

      const ch = activeRecordings.get(recFile);

      if (!ch) return;

      console.log('Recording Finished:', recFile);

      const transcript =
        'Mock AI: Caller greeting detected';

      try {

        await db.query(`
          UPDATE calls
          SET transcript=$1,status='ai_done'
          WHERE uniqueid=$2
        `, [transcript, ch]);

        console.log('AI Done');

        activeRecordings.delete(recFile);

      } catch (err) {
        console.error('DB Error:', err.message);
      }
    }
  });

  ws.on('close', () => {
    console.log('ARI Disconnected. Reconnecting...');
    setTimeout(connectARI, 5000);
  });

  ws.on('error', err => {
    console.error('WS Error:', err.message);
  });
}

connectARI();
