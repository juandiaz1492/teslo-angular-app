import { Component, effect, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { Product } from '../../../products/interfaces/product-response.interface';
import { ProductService } from '../../../products/services/products.service';
import { ProductDetails } from "./product-details/product-details";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {

  activatedRoute = inject(ActivatedRoute); 
  route = inject(Router); 
  productService = inject(ProductService)

  productId = toSignal(
    this.activatedRoute.params.pipe(
      map(params => params['id'])
    )
  )

  productResource = resource<Product | undefined, void>({
    loader: async () => {
      return await firstValueFrom(
        this.productService.getProductsByIdAdmin(this.productId())
      );
    },
    defaultValue: undefined
  });

  redirectEffect = effect(()=>{
    if(this.productResource.error()){
      this.route.navigate(['/admin/products']); 
    }
  })


}
