import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  // REGISTER
  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // UPLOAD ✅ FIXED
  upload(formData: FormData) {
    const token = localStorage.getItem('token') || '';

    return this.http.post(`${this.baseUrl}/docs/upload`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // SEARCH ✅ (already correct)
  search(keyword: string) {
    const token = localStorage.getItem('token') || '';

    return this.http.get(
      `${this.baseUrl}/docs/search?keyword=${encodeURIComponent(keyword)}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  // GET PROFILE ✅ FIXED
  getProfile() {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${this.baseUrl}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // UPDATE PROFILE ✅ FIXED
  updateProfile(data: any) {
    const token = localStorage.getItem('token') || '';

    return this.http.put(`${this.baseUrl}/auth/profile`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}