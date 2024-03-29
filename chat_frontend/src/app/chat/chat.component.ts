import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  userName: string = '';
  connectedUsers: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.userName = this.getUserName();
    this.chatService.connectWebSocket(this.userName);
    this.chatService.getMessages().subscribe((data: any) => {
      console.log("data before parsing:", data);
      //const messageObject = JSON.parse(data);
      //const msg = JSON.parse(messageObject);
      // console.log(msg);
      if (data.type === 'user_list') {  // Assuming type is sent to distinguish message types
        this.connectedUsers = data.users;
      } else {
        this.messages.push(data);
      }
    });
  }

  private getUserName(): string {
    let userName: string | null = localStorage.getItem('userName');
    if (!userName) {
        userName = 'Guest_' + Math.floor(Math.random() * 10000);
        localStorage.setItem('userName', userName);
    }
    return userName;
  }

  sendMessage() {
    const messageData: ChatMessage = {
      type: 'text',
      author: this.userName,
      content: this.newMessage,
      // Omit the timestamp if the server sets it
      timestamp: new Date().toISOString() // Only include this if the client needs to set the timestamp
    };

    console.log('sendMessage', messageData);
    console.log('send json', JSON.stringify(messageData));

    this.chatService.sendMessage(messageData);
    this.newMessage = '';
  }

  handleVideoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadVideo(file);
    }
  }

  uploadVideo(file: File) {
    // Use FormData to prepare the file for upload
    const formData = new FormData();
    formData.append('video', file);
    // Use your chat service to send the FormData to your backend
    this.chatService.uploadVideo(formData).subscribe({
      next: (response) => console.log('Video uploaded successfully', response),
      error: (error) => console.error('Error uploading video', error)
    });
  }
}
