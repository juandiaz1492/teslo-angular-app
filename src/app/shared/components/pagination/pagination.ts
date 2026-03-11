import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shared-pagination',
  imports: [RouterLink
  ],
  templateUrl: './pagination.html',
})
export class Pagination {

  currentPage = input<number>(1);

  pages = input(0);

  activatePage = linkedSignal(this.currentPage)

  pagesArray = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1)
  });
  
  changePage(page: number) {
    this.activatePage.set(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }



}
