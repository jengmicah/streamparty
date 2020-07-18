import io from 'socket.io-client';
require('dotenv').config()

const ENDPOINT = process.env.REACT_APP_SERVER;

function Socket() {
  this.socket = io(ENDPOINT);
};

const sckt = new Socket();

export { sckt };
