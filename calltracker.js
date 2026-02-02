const ami = require('./ami');
const db = require('./db');

const activeCalls = new Map();

ami.on('event', async e => {

  if (e.Event === 'Newstate' && e.ChannelStateDesc === 'Up') {

    activeCalls.set(e.Uniqueid, {
      caller: e.CallerIDNum,
      dest: e.Exten,
      start: new Date()
    });

    console.log('Call Answered:', e.Uniqueid);
  }

  if (e.Event === 'Hangup') {

    const call = activeCalls.get(e.Uniqueid);
    if (!call) return;

    const end = new Date();
    const duration =
      Math.floor((end - call.start) / 1000);

    await db.query(`
      INSERT INTO calls
      (uniqueid,caller,destination,start_time,end_time,duration,status)
      VALUES ($1,$2,$3,$4,$5,$6,'completed')
    `, [
      e.Uniqueid,
      call.caller,
      call.dest,
      call.start,
      end,
      duration
    ]);

    activeCalls.delete(e.Uniqueid);

    console.log('Call Ended:', e.Uniqueid);
  }
});