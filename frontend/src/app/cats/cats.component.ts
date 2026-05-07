import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CatService, Cat } from '../cat.service';
import { AuthService } from '../auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cats',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule,
    DatePipe
  ],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.scss'
})
export class CatsComponent implements OnInit {
  private catService = inject(CatService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cats: Cat[] = [];
  currentCat: Cat = this.getEmptyCat();
  isEditMode = false;

  ngOnInit() {
    this.loadCats();
  }

  loadCats() {
    this.catService.getCats().subscribe(data => this.cats = data);
  }

  saveCat() {
    if (this.isEditMode && this.currentCat.id) {
      this.catService.updateCat(this.currentCat.id, this.currentCat).subscribe(() => {
        this.loadCats();
        this.resetForm();
      });
    } else {
      this.catService.createCat(this.currentCat).subscribe(() => {
        this.loadCats();
        this.resetForm();
      });
    }
  }

  editCat(cat: Cat) {
    this.currentCat = { ...cat };
    this.isEditMode = true;
  }

  deleteCat(id: number) {
    if (confirm('Вы уверены, что хотите удалить кота?')) {
      this.catService.deleteCat(id).subscribe(() => this.loadCats());
    }
  }

  resetForm() {
    this.currentCat = this.getEmptyCat();
    this.isEditMode = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCatEmoji(color: string): string {
    return color === 'black' ? '🐈‍⬛' : '🐈';
  }

  private getEmptyCat(): Cat {
    return { name: '', birth_date: '', gender: 'M', color: 'black' };
  }
}