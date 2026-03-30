import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  isLogin = true;

  name = '';
  email = '';
  password = '';

  constructor(private api: ApiService) {}

  submit() {

  if (this.isLogin) {
    // LOGIN
    this.api.login({
      email: this.email,
      password: this.password
    }).subscribe((res: any) => {

      // ✅ STORE TOKEN
      localStorage.setItem('token', res.token);

      // ✅ STORE USER DATA (IMPORTANT)
      localStorage.setItem('user', JSON.stringify(res.user));

      alert("Login successful");

      window.location.href = '/home';
    });

  } else {
    // SIGNUP
    this.api.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe(() => {

      alert("Signup successful, now login");
      this.isLogin = true;
    });
  }
}

  goToForgot() {
  window.location.href = '/forgot-password';
}

  googleLogin() {
    window.open('http://localhost:5000/api/auth/google', '_self');
  }
}