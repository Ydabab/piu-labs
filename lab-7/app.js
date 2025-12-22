import products from './data.json' with { type: 'json' };
import './components/product-list.js';
import './components/cart-component.js';

const list = document.querySelector('product-list');
const cart = document.querySelector('cart-component');

list.products = products;

list.addEventListener('add-to-cart', e => {
  cart.addItem(e.detail);
});
