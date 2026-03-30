import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit {

  user: any = {
    name: '',
    email: '',
    phone: '',
    username: ''
  };

  constructor(private api: ApiService) {}

  // ✅ LOAD EXISTING USER DATA (AUTO-FILL)
  ngOnInit() {
    const token = localStorage.getItem('token') || '';

    this.api.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        console.log("Loaded user:", this.user);
      },
      error: () => {
        alert("Failed to load user data");
      }
    });
  }

  // ✅ SAVE UPDATED DATA TO BACKEND
  save() {

    const token = localStorage.getItem('token') || '';

    this.api.updateProfile(this.user).subscribe({
      next: () => {
        alert("Profile updated successfully");
        window.location.href = '/profile';
      },
      error: () => {
        alert("Update failed");
      }
    });

  }

}