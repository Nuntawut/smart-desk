import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

    // Method to establish a connection to the Socket.IO server
    connect(): void {
      try {
        this.socket.connect();
      } catch (error) {
        console.error('Error while connecting to the socket:', error);
      }
    }
  
    // Method to disconnect from the Socket.IO server
    disconnect(): void {
      try {
        this.socket.disconnect();
      } catch (error) {
        console.error('Error while disconnecting from the socket:', error);
      }
    }
  
    // Method to send a message to the server
    sendMessage(message: string): void {
      try {
        this.socket.emit('message', message);
      } catch (error) {
        console.error('Error while sending a message:', error);
      }
    }
  
    // Method to listen for messages from the server
    onMessage(): any {
      try {
        return this.socket.fromEvent('message');
      } catch (error) {
        console.error('Error while listening for messages:', error);
        return null; // or an empty observable, depending on your use case
      }
    }
}
