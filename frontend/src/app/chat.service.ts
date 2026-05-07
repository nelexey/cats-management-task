import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private socket$!: WebSocketSubject<any>;

  getUsers() {
    return this.http.get<any[]>(`${environment.apiUrl}/auth/list/`);
  }

  getHistory(userId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/chats/history/${userId}/`);
  }

  connect(otherUserId: number): Observable<any> {
    const token = this.authService.getToken();
    const url = `${environment.wsUrl}/chat/${otherUserId}/?token=${token}`;
    
    this.socket$ = webSocket(url);
    return this.socket$.asObservable();
  }

  sendMessage(text: string) {
    if (this.socket$) {
      this.socket$.next({ text: text });
    }
  }

  disconnect() {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.complete();
    }
  }
}