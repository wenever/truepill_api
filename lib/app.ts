import express = require('express');
const cors = require('cors');

const { startSocket } = require('./socket');
const apiRouter = require('./routes');
const { connection } = require('./db');

const port = process.env.PORT || 3030;
const app = express();
app.set('port', port);

const http = require('http').Server(app);
startSocket(http);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // needs securing

app.get('/', function(req, res) {
  res.send('API Is Available');
});

app.use('/api', apiRouter);

const server = http.listen(port, () => {
  console.log(`Inventory app listening on port *:${port}`);
});

process.on('SIGINT', function() {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  connection.end();
  process.exit();
});

module.exports = http;
