import { PaginationService } from './../../../shared/components/pagination/pagination.service';
import { ProductService } from './../../../products/services/products.service';
import { Component, effect, inject, resource, signal } from '@angular/core';
import { ProductCard } from "../../../products/components/product-card/product-card";
import { firstValueFrom, map } from 'rxjs';
import { Pagination } from "../../../shared/components/pagination/pagination";


@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
})
export class HomePage {

  productService = inject(ProductService);

  paginationService = inject(PaginationService); 

  productsResource = resource({
    loader: async () => {
      return await firstValueFrom(
        this.productService.getProducts({
          offset: (this.paginationService.currentPage() - 1) * 9,
        })
      );
    },
    defaultValue: {
      count: 0,
      pages: 0,
      products: []
    }
  });

  constructor() {

    let firstRun = true;

    effect(() => {
      this.paginationService.currentPage(); // registra dependencia

      if (firstRun) {
        firstRun = false;
        return;
      }

      this.productsResource.reload();
    });


  }
}