import { Product, Size } from './../../../products/interfaces/product-response.interface';
import { BagService } from './../../services/bag.service';
import { ProductService } from './../../../products/services/products.service';
import { Component, inject, resource, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CarouselProduct } from "../../../products/components/carousel-product/carousel-product";
import { CurrencyPipe } from '@angular/common';
import { toast } from 'ngx-sonner';

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
  bagService = inject(BagService);

  selectedSize = signal<Size | null>(null);

  selectSize(size: Size) {
    this.selectedSize.set(size);
  }


  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  productResource = resource<Product | undefined, void>({
    loader: async () => {
      return await firstValueFrom(
        this.productService.getProductsByIdi(this.productIdSlug)
      );
    },
    defaultValue: undefined
  });


  addToBag() {
    const product = this.productResource.value();
    const size = this.selectedSize();

    if (!product) return;

    if (!size) {
      toast.error('Selecciona una talla');
      return;
    }

    this.bagService.addProduct(product, size);
    toast.success('Producto añadido al carrito');
  }


}

