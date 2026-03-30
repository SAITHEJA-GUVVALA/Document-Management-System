import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    const token = localStorage.getItem('token') || '';

    this.api.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        console.log("Profile data:", this.user);
      },
      error: () => {
        alert("Failed to load profile");
      }
    });
  }

  goToEdit() {
    window.location.href = '/edit-profile';
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}