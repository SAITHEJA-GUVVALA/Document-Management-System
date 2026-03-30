import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html'
})
export class SearchComponent {

  keyword: string = '';
  results: any[] = [];

  constructor(private api: ApiService) {}

  // 🔥 ADD IT HERE
  search() {
    console.log("🔥 SEARCH CLICKED");
    console.log("Keyword:", this.keyword);

    this.api.search(this.keyword).subscribe({
      next: (res: any) => {
        console.log("Response:", res);
        this.results = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  openFile(path: string) {
    const url = 'http://localhost:5000/' + path;
    window.open(url, '_blank');
  }
}