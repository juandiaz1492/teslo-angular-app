import { Component, effect, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, generate, map } from 'rxjs';
import { ProductService } from '../../../products/services/products.service';
import { ProductCard } from "../../../products/components/product-card/product-card";
import { Pagination } from "../../../shared/components/pagination/pagination";
import { PaginationService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {

  route = inject(ActivatedRoute);

  gender = toSignal(
    this.route.params.pipe(
      map(({ gender }) => gender)
    )
  )


  productService = inject(ProductService);

  paginationService = inject(PaginationService);

  productsResource = resource({
    loader: async () => {
      const gender = this.gender();           // lee la señal
      return await firstValueFrom(
        this.productService.getProducts({
          gender: gender,
          offset: (this.paginationService.currentPage() - 1) * 9
        })
      );
    },
    defaultValue: { count: 0, pages: 0, products: [] }
  });

  constructor() {
    let firstRun = true;

    effect(() => {
      this.paginationService.currentPage();
      this.gender();

      if (firstRun) {
        firstRun = false;
        return;
      }

      this.productsResource.reload();
    });
  }

}
