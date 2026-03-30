import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  email = '';
  otp = '';
  password = '';
  step = 1;

  constructor(private http: HttpClient) {}

  sendOtp() {
    this.http.post('http://localhost:5000/api/auth/send-otp', {
      email: this.email
    }).subscribe(() => {
      alert("OTP sent");
      this.step = 2;
    });
  }

  verifyOtp() {
    this.http.post('http://localhost:5000/api/auth/verify-otp', {
      email: this.email,
      otp: this.otp
    }).subscribe(() => {
      alert("OTP verified");
      this.step = 3;
    });
  }

  resetPassword() {
    this.http.post('http://localhost:5000/api/auth/reset-password', {
      email: this.email,
      password: this.password
    }).subscribe(() => {
      alert("Password reset successful");
      window.location.href = '/';
    });
  }
}