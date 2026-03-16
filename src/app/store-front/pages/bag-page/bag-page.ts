import { Component, inject, signal } from '@angular/core';
import { BagService } from '../../services/bag.service';
import { CurrencyPipe } from '@angular/common';
import { ProductImagePipe } from '../../../products/pipes/product-image.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bag-page',
  imports: [CurrencyPipe, ProductImagePipe, RouterLink] ,
  templateUrl: './bag-page.html',
})
export class BagPage { 

  bagService = inject(BagService); 




}
