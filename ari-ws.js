const WebSocket = require('ws');
const axios = require('axios');
const db = require('./db');
require('dotenv').config();

const ARI_URL = 'http://localhost:8088/ari';

function auth() {
  return {
    username: process.env.ARI_USER,
    password: process.env.ARI_PASS
  };
}

function connectARI() {

  const ws = new WebSocket(
    `ws://localhost:8088/ari/events?app=ai-bridge`,
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.ARI_USER}:${process.env.ARI_PASS}`
          ).toString('base64')
      }
    }
  );

  ws.on('open', () => {
    console.log('✅ ARI Connected');
  });

  ws.on('message', async msg => {

    const e = JSON.parse(msg);

    if (e.type === 'StasisStart') {

      const ch = e.channel.id;

      console.log('🤖 AI Call:', ch);

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

      await axios.post(
        `${ARI_URL}/channels/${ch}/record`,
        {
          name: `rec-${Date.now()}`,
          maxDurationSeconds: 10
        },
        { auth: auth() }
      );

      setTimeout(async () => {

        const transcript =
          'Mock AI: Caller greeting detected';

        await db.query(`
          UPDATE calls
          SET transcript=$1,status='ai_done'
          WHERE uniqueid=$2
        `, [transcript, ch]);

        console.log('AI Done');

      }, 3000);
    }
  });

  ws.on('close', () => {

    console.log('ARI reconnecting...');
    setTimeout(connectARI, 5000);
  });
}

connectARI();