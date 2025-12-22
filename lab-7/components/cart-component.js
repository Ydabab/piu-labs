export default class CartComponent extends HTMLElement {
    items = [];

    connectedCallback() {
        this.render();
    }

    addItem(item) {
        this.items.push(item);
        this.render();
    }

    removeItem(i) {
        this.items.splice(i, 1);
        this.render();
    }

    render() {
        const sum = this.items.reduce((a, b) => a + b.price, 0);
        this.innerHTML = `
      <h3>Koszyk</h3>
      <ul>
        ${this.items
            .map(
                (i, idx) =>
                    `<li>${i.name} – ${i.price} PLN
           <button data-i="${idx}">x</button></li>`
            )
            .join('')}
      </ul>
      <strong>Suma: ${sum} PLN</strong>
    `;
        this.querySelectorAll('button').forEach(
            (b) => (b.onclick = () => this.removeItem(b.dataset.i))
        );
    }
}

customElements.define('cart-component', CartComponent);
