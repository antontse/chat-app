import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { ChatMessage } from './models/chat-message.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatWebSocket!: WebSocketSubject<any>;

  constructor(private http: HttpClient) { }
    //this.chatWebSocket = new WebSocketSubject('ws://localhost:8001/ws/chat/');


  sendMessage(message: ChatMessage) {
    this.chatWebSocket.next({ message });
  }

  getMessages() {
    return this.chatWebSocket.asObservable();
  }

  connectWebSocket(userName: string): void {
    // Assuming ws://localhost:8001/ws/chat/ is your base WebSocket URL
    // and you're appending the userName as part of the path
    const wsUrl = `ws://localhost:8001/ws/chat/${userName}/`;
    this.chatWebSocket = new WebSocketSubject(wsUrl);
    // Setup event listeners for WebSocket (e.g., onmessage, onerror)
  }

  uploadVideo(formData: FormData): Observable<any> {
    // Replace 'your-upload-endpoint' with the actual URL to your backend's video upload endpoint
    const uploadUrl = '';
    return this.http.post(uploadUrl, formData);
  }

}
