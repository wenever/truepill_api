let io: any = null;

const startSocket = (server: any) => {
  io = require('socket.io')(server);

  io.on('connection', () => {
    console.log('client connected');
  });
};

const emit = (type: string, data: any) => {
  io.emit(type, data);
};

module.exports = {
  startSocket,
  emit
};
