import { Router } from '@angular/router';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../products/interfaces/product-response.interface';
import { CarouselProduct } from "../../../../products/components/carousel-product/carousel-product";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { FormErrorLabel } from "../../../../shared/components/form-error-label/form-error-label";
import { ProductService } from '../../../../products/services/products.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [CarouselProduct, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {

  product = input.required<Product>();

  productService = inject(ProductService);
  fb = inject(FormBuilder);
  router = inject(Router);

  wasSaved = signal(false);
  
  imageFileList: FileList | undefined = undefined; 
  tempImages = signal<string[]>([]); 

  imagesToCarousel = computed(()=>{
    const currentProductImages = [...this.product().images, ...this.tempImages()]; 

    return currentProductImages; 
  })

  productForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/^(men|women|kids|unisex)$/)]]
  });


  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') })
  }

  onSizeChange(size: string) {

    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({
      sizes: currentSizes
    });
  }


  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
    }

    if (this.product().id == 'new') {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList)
      );

      this.router.navigate(['/admin/products', product.id]);

    } else {
      console.log(productLike); 
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike, this.imageFileList)
      );
    }


    this.wasSaved.set(true); 
    setTimeout(()=>{
      this.wasSaved.set(false)
    }, 3000)
  }

  //images
  onFilesChanged(event: Event){
    const fileList = (event.target as HTMLInputElement).files; 
    this.imageFileList = fileList ?? undefined; 

    const imageUrls = Array.from(fileList ?? []).map(
      file => URL.createObjectURL(file)
    ); 

    this.tempImages.set(imageUrls); 

    this.product
    
  }

 


}
