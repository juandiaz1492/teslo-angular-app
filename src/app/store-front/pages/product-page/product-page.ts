
import { ProductService } from './../../../products/services/products.service';
import { Component, inject, resource } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../../products/interfaces/product-response.interface';
import { CarouselProduct } from "../../../products/components/carousel-product/carousel-product";
import { CurrencyPipe } from '@angular/common';

export type Gender = 'men' | 'women' | 'kid' | 'unisex';
export interface User {
  id: string;
  name: string;
  email: string;
}


@Component({
  selector: 'app-product-page',
  imports: [CarouselProduct, CurrencyPipe],
  templateUrl: './product-page.html',
})
export class ProductPage {

  activatedRoute = inject(ActivatedRoute)
  productService = inject(ProductService)

  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  productResource = resource<Product | undefined, void>({
    loader: async () => {
      return await firstValueFrom(
        this.productService.getProductsByIdi(this.productIdSlug)
      );
    },
    defaultValue: undefined
  });

}
