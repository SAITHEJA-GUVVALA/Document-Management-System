import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './upload.component.html'
})
export class UploadComponent {

  files: File[] = [];   // ✅ multiple files
  title: string = '';
  tags: string = '';
  visibility: string = 'private';   // ✅ ADDED

  isDragging = false;
  loading = false;   // ✅ for UX

  constructor(private api: ApiService) {}

  // ================= FILE SELECT =================
  onFileSelect(event: any) {
    const selectedFiles = event.target.files;

    this.files = [];

    for (let i = 0; i < selectedFiles.length && i < 4; i++) {
      this.files.push(selectedFiles[i]);
    }

    if (selectedFiles.length > 4) {
      alert("Maximum 4 files allowed");
    }

    console.log("Selected files:", this.files);
  }

  // ================= DRAG EVENTS =================
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    const droppedFiles = event.dataTransfer?.files;

    if (droppedFiles) {
      this.files = [];

      for (let i = 0; i < droppedFiles.length && i < 4; i++) {
        this.files.push(droppedFiles[i]);
      }

      if (droppedFiles.length > 4) {
        alert("Maximum 4 files allowed");
      }

      console.log("Dropped files:", this.files);
    }
  }

  // ================= UPLOAD =================
  upload() {

    if (this.files.length === 0) {
      alert("Please select file(s)");
      return;
    }

    const token = localStorage.getItem('token') || '';

    this.loading = true;

    let uploadCount = 0;

    this.files.forEach(file => {

      const formData = new FormData();

      formData.append('file', file);
      formData.append('title', this.title || file.name);  // ✅ fallback title
      formData.append('tags', this.tags);
      formData.append('visibility', this.visibility);     // ✅ IMPORTANT

      this.api.upload(formData).subscribe({
        next: () => {
          console.log("Uploaded:", file.name);

          uploadCount++;

          // ✅ when all files uploaded
          if (uploadCount === this.files.length) {
            this.loading = false;

            alert("All files uploaded successfully");

            setTimeout(() => {
              window.location.href = '/home';
            }, 1500);
          }
        },
        error: (err) => {
          this.loading = false;
          console.error("Upload error:", err);
          alert("Upload failed");
        }
      });

    });
  }
}