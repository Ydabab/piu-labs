const template = document.createElement('template');
template.innerHTML = `
<style>
  .card {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: white;
    padding: 12px;
    border-radius: 8px;
  }
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    margin-bottom: 10px;
  }
  .colors span {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 6px;
    cursor: pointer;
    margin-bottom: 10px;
    
  }
  .price {
    margin-bottom: 10px;
  }
  .sizes span {
    border: 1px solid #aaa;
    padding: 2px 6px;
    margin-right: 4px;
    font-size: 12px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  button {
    margin-top: auto;
  }
</style>

<div class="card">
  <img />
  <strong class="name"></strong>
  <span class="price"></span>

  <div class="colors"></div>
  <div class="sizes"></div>

  <button>Do koszyka</button>
</div>
`;

export default class ProductCard extends HTMLElement {
    set name(v) {
        this._name = v;
        this.render();
    }
    set price(v) {
        this._price = v;
        this.render();
    }
    set image(v) {
        this._image = v;
        this.render();
    }
    set colors(v = []) {
        this._colors = v;
        this.render();
    }
    set sizes(v = []) {
        this._sizes = v;
        this.render();
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).appendChild(
            template.content.cloneNode(true)
        );
    }

    connectedCallback() {
        this.shadowRoot
            .querySelector('button')
            .addEventListener('click', () => {
                this.dispatchEvent(
                    new CustomEvent('add-to-cart', {
                        bubbles: true,
                        detail: {
                            name: this._name,
                            price: this._price,
                        },
                    })
                );
            });
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.querySelector('.name').textContent = this._name || '';
        this.shadowRoot.querySelector('.price').textContent = this._price
            ? `${this._price} PLN`
            : '';

        if (this._image) this.shadowRoot.querySelector('img').src = this._image;

        const colorsEl = this.shadowRoot.querySelector('.colors');
        colorsEl.innerHTML = '';
        (this._colors || []).forEach((c) => {
            const span = document.createElement('span');
            span.style.backgroundColor = c;
            colorsEl.appendChild(span);
        });

        const sizesEl = this.shadowRoot.querySelector('.sizes');
        sizesEl.innerHTML = '';
        (this._sizes || []).forEach((s) => {
            const span = document.createElement('span');
            span.textContent = s;
            sizesEl.appendChild(span);
        });
    }
}

customElements.define('product-card', ProductCard);
