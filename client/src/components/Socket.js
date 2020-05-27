import io from 'socket.io-client';
// import { remoteUrl } from './constants/RemoteUrl';
// import SocketWorker from './utilities/SocketWorker';
require('dotenv').config()

const ENDPOINT = process.env.REACT_APP_SERVER;

function Socket() {
  this.socket = io(ENDPOINT);
  // this.socket.on('statusChange', (data) => {
  //   return SocketWorker.receiveOrderStatusChange(data);
  // })
};

const sckt = new Socket();

export { sckt };