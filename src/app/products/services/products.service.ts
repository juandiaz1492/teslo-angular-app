import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductResponse } from '../interfaces/product-response.interface';
import { forkJoin, map, Observable, of, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../../auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

interface Options {
    limit?: number;
    offset?: number;
    gender?: string;
}

const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
}

@Injectable({ providedIn: 'root' })
export class ProductService {

    private http = inject(HttpClient);

    private productsCache = new Map<string, ProductResponse>();

    private productsIdCache = new Map<string, Product>();


    getProducts(options: Options): Observable<ProductResponse> {

        const { limit = 9, offset = 0, gender = '' } = options;

        const key = `${limit}-${offset}-${gender}`;
        console.log('GET PRODUCTS KEY', key, 'gender:', gender);
        
        if (this.productsCache.has(key)) {
            console.log('SALE DE CACHE');
            return of(this.productsCache.get(key)!);
        }

         console.log('VA AL BACKEND');
         
        return this.http.get<ProductResponse>(`${baseUrl}/products`, {
            params: {
                limit: limit,
                offset: offset,
                gender: gender,
            }
        })
            .pipe(
                tap((resp) => this.productsCache.set(key, resp))
            )
    }


    getProductsByIdi(idSlug: string): Observable<Product> {

        const key = `${idSlug}`;
        if (this.productsIdCache.has(key)) {
            return of(this.productsIdCache.get(key)!);
        }

        return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
            .pipe(
                tap((resp) => this.productsIdCache.set(key, resp))
            )
    }


    getProductsByIdAdmin(id: string): Observable<Product> {

        if (id == 'new') {
            return of(emptyProduct);
        }

        const key = `${id}`;
        if (this.productsIdCache.has(key)) {
            return of(this.productsIdCache.get(key)!);
        }

        return this.http.get<Product>(`${baseUrl}/products/${id}`)
            .pipe(
                tap((resp) => this.productsIdCache.set(key, resp))
            )
    }

    createProduct(productLike: Partial<Product>,
        imageFileList?: FileList
    ): Observable<Product> {

        return this.uploadImages(imageFileList).pipe(
            map(imageNames => ({
                ...productLike,
                images: imageNames
            })), //observables encadenados
            switchMap((newProduct) =>
                this.http.post<Product>(`${baseUrl}/products`, newProduct)
            ),
            tap((product) => {
                this.productsIdCache.set(product.id, product);
                this.invalidateProductListCache(product);
            }))
    }


    updateProduct(id: string,
        productLike: Partial<Product>,
        imageFileList?: FileList
    ): Observable<Product> {
        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList).pipe(
            map(imageNames => ({
                ...productLike,
                images: [...currentImages, ...imageNames]
            })), //observables encadenados
            switchMap((updateProduct) =>
                this.http.patch<Product>(`${baseUrl}/products/${id}`, updateProduct)
            ),
            tap((product) => { this.updateProductCache(product); }))

    }

    updateProductCache(product: Product) {
        const id = product.id
        this.productsIdCache.set(id, product);

        this.productsCache.forEach(productResponse => {
            productResponse.products = productResponse.products.map((currentProduct) => {
                return currentProduct.id == id ? product : currentProduct;
            })
        })
    }

    uploadImages(images?: FileList): Observable<string[]> {
        if (!images) return of([]);

        const uploadObservables = Array.from(images).
            map(imageFile => this.uploadImage(imageFile));


        return forkJoin(uploadObservables).pipe(
            tap((imagesName) => {
                console.log({ imagesName })
            })
        )
    }

    uploadImage(image: File): Observable<string> {

        const formData = new FormData();
        formData.append('file', image);

        return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
            .pipe(
                map((resp => resp.fileName))
            );
    }

    private invalidateProductListCache(product: Product) {

        for (const key of this.productsCache.keys()) {

            // lista general
            if (key.endsWith('-')) {
                this.productsCache.delete(key);
            }

            // listas del mismo gender
            if (key.endsWith(`-${product.gender}`)) {
                this.productsCache.delete(key);
            }

        }

    }





}