import { Component, effect, inject, resource, signal } from '@angular/core';
import { ProductTable } from "../../../products/components/product-table/product-table";
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../../products/services/products.service';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';
import { Pagination } from "../../../shared/components/pagination/pagination";
import { sign } from 'crypto';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, RouterLink, Pagination],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {

  productService = inject(ProductService);
  paginationService = inject(PaginationService);

  productsPerPage = signal(10);

  productsResource = resource({
    loader: async () => {
      return await firstValueFrom(
        this.productService.getProducts({
          offset: (this.paginationService.currentPage() - 1) * this.productsPerPage(),
          limit: this.productsPerPage()

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

      this.productsPerPage();
      this.productsResource.reload();



      if (firstRun) {
        firstRun = false;
        return;
      }

      this.productsResource.reload();
    });


  }


}
