import { computed, effect, Injectable, signal } from '@angular/core';
import { Product, Size } from '../../products/interfaces/product-response.interface';


export interface BagItem {
  product: Product,
  quantity: number,
  size: Size,
}

@Injectable({
  providedIn: 'root'
})
export class BagService {

  private _items = signal<BagItem[]>(this.loadFromStorage());
  items = computed(() => this._items());

  constructor() {
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this._items()));
    });
  }

  private loadFromStorage(): BagItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  //productos totales
  totalItems = computed(() =>
    this._items().reduce((total, item) => total + item.quantity, 0)
  );
  //precio total 
  totalPrice = computed(() =>
    this._items().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  //MÉTODOS 
  //añadir producto 
  addProduct(product: Product, size: Size) {
    this._items.update(items => {
      const existingItem = items.find(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItem) {
        return items.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...items,
        { product, quantity: 1, size }
      ];
    });
  }

  //eliminar producto 
  removeProduct(productId: string, size: Size) {
    this._items.update(items =>
      items.filter(item => !(item.product.id === productId && item.size === size))
    );
  }

  //cambiar cantidad se puede sumar o restra
  changeQuantity(productId: string, size: Size, quantity: number) {
    if (quantity <= 0) {
      this.removeProduct(productId, size);
      return;
    }

    this._items.update(items =>
      items.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }



}
