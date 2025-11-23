import { store } from './store.js';
import { randomHsl } from './helpers.js';

export function initUI() {
    const board = document.getElementById('board');
    const cntSquares = document.getElementById('cntSquares');
    const cntCircles = document.getElementById('cntCircles');

    const addSquareBtn = document.getElementById('addSquare');
    const addCircleBtn = document.getElementById('addCircle');
    const recolorSquaresBtn = document.getElementById('recolorSquares');
    const recolorCirclesBtn = document.getElementById('recolorCircles');

    function updateCounters() {
        cntSquares.textContent = store.countByType('square');
        cntCircles.textContent = store.countByType('circle');
    }

    function renderShape(shape) {
        const el = document.createElement('div');
        el.className = `shape ${shape.type}`;
        el.style.backgroundColor = shape.color;
        el.dataset.id = shape.id;

        if (shape.type === 'square') {
            el.addEventListener('click', () => store.removeShape(shape.id));
        }

        board.appendChild(el);
    }

    function render(shapes) {
        board.innerHTML = '';
        shapes.forEach(renderShape);
        updateCounters();
    }

    board.addEventListener('click', (e) => {
        if (e.target.dataset.id) {
            const shape = store.shapes.find(
                (s) => s.id === e.target.dataset.id
            );
            if (shape && shape.type === 'circle') {
                store.removeShape(shape.id);
            }
        }
    });

    addSquareBtn.addEventListener('click', () =>
        store.addShape('square', randomHsl())
    );

    addCircleBtn.addEventListener('click', () =>
        store.addShape('circle', randomHsl())
    );

    recolorSquaresBtn.addEventListener('click', () =>
        store.recolorShapes('square')
    );
    recolorCirclesBtn.addEventListener('click', () =>
        store.recolorShapes('circle')
    );

    store.subscribe(render);
    render(store.shapes);
}
