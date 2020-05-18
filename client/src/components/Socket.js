import io from 'socket.io-client';
// import { remoteUrl } from './constants/RemoteUrl';
// import SocketWorker from './utilities/SocketWorker';

const ENDPOINT = 'localhost:5000';

function Socket() {
  this.socket = io(ENDPOINT);
  // this.socket.on('statusChange', (data) => {
  //   return SocketWorker.receiveOrderStatusChange(data);
  // })
};

const sckt = new Socket();

export { sckt };