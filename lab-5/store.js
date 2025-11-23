import { generateId } from './helpers.js';
import { randomHsl } from './helpers.js';

class Store {
    constructor() {
        this.shapes = JSON.parse(localStorage.getItem('shapes')) || [];
        this.subscribers = [];
    }

    subscribe(fn) {
        this.subscribers.push(fn);
    }

    notify() {
        localStorage.setItem('shapes', JSON.stringify(this.shapes));
        this.subscribers.forEach((fn) => fn(this.shapes));
    }

    addShape(type, color) {
        const shape = { id: generateId(), type, color };
        this.shapes.push(shape);
        this.notify();
    }

    removeShape(id) {
        this.shapes = this.shapes.filter((s) => s.id !== id);
        this.notify();
    }

    recolorShapes(type) {
        this.shapes = this.shapes.map((s) =>
            s.type === type ? { ...s, color: randomHsl() } : s
        );
        this.notify();
    }

    countByType(type) {
        return this.shapes.filter((s) => s.type === type).length;
    }
}

export const store = new Store();
