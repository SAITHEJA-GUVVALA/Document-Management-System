import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  keyword: string = '';
  documents: any[] = [];

  // ✅ Store all data
  allDocuments: any[] = [];
  favorites: any[] = [];
  downloads: any[] = [];
  recentDocs: any[] = [];

  // ✅ Upload (+) Menu
  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.showProfileMenu = false;
  }

  // ✅ Profile Menu
  showProfileMenu = false;
  user: any = {};

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    this.showMenu = false;
  }

  // ✅ Sidebar
  showSidebar = false;

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {

    // ✅ Save token (Google login)
    this.route.queryParams.subscribe((params: any) => {
      if (params['token']) {
        localStorage.setItem('token', params['token']);
      }
    });

    const recent = localStorage.getItem('recentDocs');

if (recent) {
  this.recentDocs = JSON.parse(recent);
}

    // ✅ Load user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    // ✅ Load latest user from backend
    const token = localStorage.getItem('token') || '';

    this.http.get<any>('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: token }
    }).subscribe({
      next: (res) => {
        this.user = res;
      },
      error: () => {
        console.log("Failed to load user");
      }
    });
  }

  // ================= FILE ICONS =================

  getFileIconClass(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') return 'fa-solid fa-file-pdf text-red';
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return 'fa-solid fa-file-image text-blue';
    if (['mp4', 'mov'].includes(ext || '')) return 'fa-solid fa-file-video text-purple';

    return 'fa-solid fa-file text-gray';
  }

  getFileType(path: string): string {
    if (!path) return 'File';

    const ext = path.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') return 'PDF';
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return 'Image';
    if (['mp4', 'mov'].includes(ext || '')) return 'Video';

    return 'File';
  }

  // ================= SEARCH =================

  searchTimeout: any;
  loading = false;

  onSearch() {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {

      if (!this.keyword) {
        this.documents = [];
        return;
      }

      this.loading = true;

      this.http.get<any[]>(`http://localhost:5000/api/docs/search?keyword=${this.keyword}`)
        .subscribe({
          next: (res) => {
            this.documents = res;
            this.allDocuments = res;   // ⭐ IMPORTANT
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });

    }, 300);
  }

  // ================= FAVORITES =================

  toggleFavorite(doc: any) {
    doc.isFav = !doc.isFav;

    if (doc.isFav) {
      this.favorites.push(doc);
    } else {
      this.favorites = this.favorites.filter(d => d._id !== doc._id);
    }
  }

  showFavorites() {
    this.documents = this.favorites;
  }

  showAll() {
    this.documents = this.allDocuments;
  }

  // ================= DOWNLOADS =================

  openFile(path: string, doc: any) {
  window.open('http://localhost:5000/' + path, '_blank');

  // ✅ SAVE RECENT FILES
  let recent = JSON.parse(localStorage.getItem('recentDocs') || '[]');

  // remove duplicate if already exists
  recent = recent.filter((d: any) => d._id !== doc._id);

  // add new at top
  recent.unshift(doc);

  // limit to 5 files
  recent = recent.slice(0, 3);

  localStorage.setItem('recentDocs', JSON.stringify(recent));
}

  showDownloads() {
    this.documents = this.downloads;
  }

  // ================= SORT =================

  sortDirection: boolean = true;

  sortBy(field: string) {

    this.sortDirection = !this.sortDirection;

    this.documents.sort((a: any, b: any) => {

      let valA: any, valB: any;

      if (field === 'title') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }

      else if (field === 'type') {
        valA = this.getFileType(a.filePath);
        valB = this.getFileType(b.filePath);
      }

      else if (field === 'date') {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return this.sortDirection ? -1 : 1;
      if (valA > valB) return this.sortDirection ? 1 : -1;
      return 0;
    });
  }

  viewVersions(groupId: string) {
  this.http.get(`http://localhost:5000/api/docs/versions/${groupId}`)
    .subscribe((res: any) => {
      console.log(res);
      alert("Check console for versions");
    });
}

  // ================= NAVIGATION =================

  upload(type: string) {
    window.location.href = '/upload';
  }

  goToUpload() {
    window.location.href = '/upload';
  }

  goToSettings() {
    window.location.href = '/edit-profile';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
}