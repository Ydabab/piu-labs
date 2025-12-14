const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      height: 100%;
      font-family: Arial, sans-serif;
    }

    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid #ccc;
      border-radius: 10px;
      background: #fff;
      overflow: hidden;
    }

    .image {
      position: relative;
    }

    ::slotted(img) {
      width: 100%;
      display: block;
    }

    .promo {
      position: absolute;
      top: 10px;
      left: 10px;
      background: red;
      color: white;
      padding: 4px 8px;
      border-radius: 5px;
      font-size: 13px;
      display: none;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 15px;
      overflow: hidden;
    }

    .name {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 6px;
    }

    .price {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .colors {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
      cursor: pointer;
    }

    ::slotted(.color) {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #ccc;
    }

    .sizes {
      margin-bottom: 10px;
      font-weight: bold;
      cursor: pointer;
    }

    .sizes ::slotted(span) {
      display: inline-block;
      padding: 3px 7px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 12px;
      margin-right: 4px;
    }

    button {
      margin-top: auto;
      padding: 10px;
      border: none;
      border-radius: 6px;
      background: #28a745;
      color: white;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover {
      background: #218838;
    }
  </style>

  <div class="card">
    <div class="image">
      <slot name="image"></slot>
      <span class="promo"><slot name="promo"></slot></span>
    </div>

    <div class="content">
      <div class="name"><slot name="name"></slot></div>
      <div class="price"><slot name="price"></slot></div>

      <div class="colors">
        <slot name="colors"></slot>
      </div>

      <div class="sizes">
        <slot name="sizes"></slot>
      </div>

      <button>Do koszyka</button>
    </div>
  </div>
`;

export default class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).appendChild(
            template.content.cloneNode(true)
        );
    }

    connectedCallback() {
        const promo = this.shadowRoot.querySelector('.promo');
        if (this.querySelector('[slot="promo"]')) {
            promo.style.display = 'block';
        }
    }
}

customElements.define('product-card', ProductCard);
