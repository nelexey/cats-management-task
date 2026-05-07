import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    DatePipe
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private router = inject(Router);

  users: any[] = [];
  selectedUser: any = null;
  messages: any[] = [];
  newMessage: string = '';
  
  private wsSubscription!: Subscription;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  ngOnInit() {
    this.chatService.getUsers().subscribe(users => this.users = users);
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.messages = [];
    
    this.chatService.disconnect();
    if (this.wsSubscription) this.wsSubscription.unsubscribe();

    this.chatService.getHistory(user.id).subscribe(history => {
      this.messages = history;
      this.scrollToBottom();
      
      this.wsSubscription = this.chatService.connect(user.id).subscribe({
        next: (msg) => this.handleNewMessage(msg),
        error: (err) => console.error('WebSocket Error:', err),
        complete: () => console.log('WebSocket Connection Closed')
      });
    });
  }

  handleNewMessage(wsMsg: any) {
    if (wsMsg.type === 'message') {
      const normalizedMsg = {
        id: wsMsg.id,
        text: wsMsg.text,
        created_at: wsMsg.created_at,
        sender: {
          id: wsMsg.sender_id,
          username: wsMsg.sender_username
        }
      };
      this.messages.push(normalizedMsg);
      this.scrollToBottom();
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = ''; 
    }
  }

  goToCats() {
    this.router.navigate(['/cats']);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  ngOnDestroy() {
    this.chatService.disconnect();
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }
}