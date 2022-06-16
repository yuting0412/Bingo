const { Server } = require('socket.io');
const io = new Server();
const socketConfig = {
  io: io
};

let playerCount = 0; // 所有玩家人數
let prepare = 0;
let canChoose = 1;
io.on('connection', (socket) => {
  socket.on('connect', () => {
    // send an event to everyone, us the io.emit() method
    console.log('user connected');
  });
  socket.on('add player', () => {
    // 監聽 client 的動作，如果發生 add player 事件
    playerCount += 1;
    io.emit('playerCount', { playerCount: playerCount });
    // 對所有 client 廣播，playerCount
  });

  socket.on('start', () => {
    io.emit('play');
  });

  socket.on('prepare', () => {
    prepare += 1;
    socket.emit('playerID', { prepare: prepare });
    if (prepare == playerCount) { // player 都準備好了，就開始遊戲
      io.emit('start', { id: canChoose });
    } else {
      let wait = playerCount - prepare;
      io.emit('wait', { wait: wait });
    }
  });

  socket.on('have choose', (myID) => {
    if (myID.myID == canChoose) {
      canChoose += 1;
      if (canChoose > playerCount) {
        canChoose = 1;
      }
      io.emit('can choose ID', { id: canChoose }); // 誰能選號碼
    }
  });


  socket.on('choose num', (argv) => {
    io.emit('other choose', { num: argv.num });
  });

  socket.on('win', () => {
    io.emit('other win');
  });
});

module.exports = socketConfig;