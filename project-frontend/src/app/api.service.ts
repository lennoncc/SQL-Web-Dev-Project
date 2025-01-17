import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }
  getMessage() {
    return this.http.get('http://localhost:3333/api/allSalespersons')
  }
}