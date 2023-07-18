const express = require('express');

const cors = require('cors');

const path = require('path');

const expressHandlebars = require('express-handlebars');

const SocketConfig = require('./utils/sockets/socket.io');

const routes = require('./routes');
require('dotenv').config();
require('./config/mongo');

const PORT = process.env.PORT || 3001;

class Server {
  constructor() {
  
    this.app = express();

    this.settings();

    this.routes();

    this.views();

    this.middlewares();

    this.socket();
  }

  settings() {
    
    this.app.use(express.json());

    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );

    this.app.use(express.static(path.join(__dirname, '/public')));
  }

  routes() {
    routes(this.app);
  }

  views() {
    
    const handlebars = expressHandlebars.create({
      defaultLayout: 'main',
    });

    this.app.set('views', path.join(__dirname, 'views'));
    this.app.engine('handlebars', handlebars.engine);
    this.app.set('view engine', 'handlebars');
  }

  middlewares() {
    
    this.app.use(cors('*'));
  }

  socket() {
    const server = require('http').createServer(this.app);
    const socketConfig = new SocketConfig(server);
    this.app.io = socketConfig.io;
  }

  listen() {
    const server = this.app.listen(PORT, () => {
      console.log(`Servidor en ejecución en http://localhost:${PORT}`);
    });

    this.app.io.attach(server);
  }
}

module.exports = new Server();
