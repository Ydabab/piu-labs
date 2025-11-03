function losowyKolor() {
    const kolory = [
        '#ff9999',
        '#99ccff',
        '#99ff99',
        '#ffff99',
        '#ffcc99',
        '#cc99ff',
    ];
    return kolory[Math.floor(Math.random() * kolory.length)];
}

function zapiszStan() {
    const kolumny = ['ToDoBoard', 'InProgressBoard', 'DoneBoard'];
    const dane = {};
    kolumny.forEach((id) => {
        const karty = [...document.getElementById(id).children].map((k) => ({
            id: k.dataset.id,
            text: k.querySelector('.tekst').innerText,
            kolor: k.style.backgroundColor,
        }));
        dane[id] = karty;
    });
    localStorage.setItem('kanbanData', JSON.stringify(dane));
    liczKarty();
}

function wczytajStan() {
    const dane = JSON.parse(localStorage.getItem('kanbanData'));
    if (!dane) return;
    Object.entries(dane).forEach(([id, karty]) => {
        karty.forEach((k) =>
            stworzKarte(document.getElementById(id), k.text, k.kolor, k.id)
        );
    });
    liczKarty();
}

function liczKarty() {
    document.getElementById('ToDoCounter').textContent =
        document.getElementById('ToDoBoard').children.length;
    document.getElementById('InProgressCounter').textContent =
        document.getElementById('InProgressBoard').children.length;
    document.getElementById('DoneCounter').textContent =
        document.getElementById('DoneBoard').children.length;
}

function stworzKarte(
    board,
    text = 'Nowa karta',
    kolor = losowyKolor(),
    id = Date.now().toString()
) {
    const karta = document.createElement('div');
    karta.className = 'shape';
    karta.dataset.id = id;
    karta.style.backgroundColor = kolor;

    const tekst = document.createElement('div');
    tekst.className = 'tekst';
    tekst.contentEditable = 'true';
    tekst.innerText = text;

    const btns = document.createElement('div');
    btns.className = 'KarteczkiButtony';

    const left = document.createElement('button');
    left.className = 'move-left';
    left.type = 'button';
    left.textContent = '⬅️';

    const right = document.createElement('button');
    right.className = 'move-right';
    right.type = 'button';
    right.textContent = '➡️';

    const color = document.createElement('button');
    color.className = 'color';
    color.type = 'button';
    color.textContent = '🎨';

    const del = document.createElement('button');
    del.className = 'del';
    del.type = 'button';
    del.textContent = '❌';

    btns.append(left, right, color, del);
    karta.append(tekst, btns);
    board.appendChild(karta);

    btns.style.display = 'flex';
    btns.style.justifyContent = 'center';
    btns.style.gap = '0.5rem';
    btns.style.marginTop = '0.5rem';

    tekst.addEventListener('input', zapiszStan);
    del.addEventListener('click', () => {
        karta.remove();
        zapiszStan();
    });
    color.addEventListener('click', () => {
        karta.style.backgroundColor = losowyKolor();
        zapiszStan();
    });
    left.addEventListener('click', () => przeniesKarte(karta, -1));
    right.addEventListener('click', () => przeniesKarte(karta, 1));

    dostosujPrzyciski(karta);

    zapiszStan();
}

function przeniesKarte(karta, kierunek) {
    const kolumny = ['ToDoBoard', 'InProgressBoard', 'DoneBoard'];
    const obecny = kolumny.findIndex((id) => karta.parentElement.id === id);
    const nowy = obecny + kierunek;
    if (nowy < 0 || nowy >= kolumny.length) return;
    document.getElementById(kolumny[nowy]).appendChild(karta);
    dostosujPrzyciski(karta);
    zapiszStan();
}

function dostosujPrzyciski(karta) {
    const boardId = karta.parentElement.id;
    const btns = karta.querySelector('.KarteczkiButtony');

    const left = btns.querySelector('.move-left');
    const right = btns.querySelector('.move-right');
    const color = btns.querySelector('.color');
    const del = btns.querySelector('.del');

    if (left) left.remove();
    if (right) right.remove();

    if (boardId === 'ToDoBoard') {
        if (!btns.querySelector('.move-right')) {
            const newRight = document.createElement('button');
            newRight.className = 'move-right';
            newRight.type = 'button';
            newRight.textContent = '➡️';
            newRight.addEventListener('click', () => przeniesKarte(karta, 1));
            btns.insertBefore(newRight, color || del || null);
        }
    } else if (boardId === 'InProgressBoard') {
        if (!btns.querySelector('.move-left')) {
            const newLeft = document.createElement('button');
            newLeft.className = 'move-left';
            newLeft.type = 'button';
            newLeft.textContent = '⬅️';
            newLeft.addEventListener('click', () => przeniesKarte(karta, -1));
            btns.insertBefore(newLeft, btns.firstChild);
        }
        if (!btns.querySelector('.move-right')) {
            const newRight = document.createElement('button');
            newRight.className = 'move-right';
            newRight.type = 'button';
            newRight.textContent = '➡️';
            newRight.addEventListener('click', () => przeniesKarte(karta, 1));
            if (color) btns.insertBefore(newRight, color);
            else btns.appendChild(newRight);
        }
    } else if (boardId === 'DoneBoard') {
        if (!btns.querySelector('.move-left')) {
            const newLeft = document.createElement('button');
            newLeft.className = 'move-left';
            newLeft.type = 'button';
            newLeft.textContent = '⬅️';
            newLeft.addEventListener('click', () => przeniesKarte(karta, -1));
            btns.insertBefore(newLeft, btns.firstChild);
        }
    }

    if (!btns.querySelector('.color')) {
        const c = document.createElement('button');
        c.className = 'color';
        c.type = 'button';
        c.textContent = '🎨';
        c.addEventListener('click', () => {
            karta.style.backgroundColor = losowyKolor();
            zapiszStan();
        });
        btns.appendChild(c);
    }
    if (!btns.querySelector('.del')) {
        const d = document.createElement('button');
        d.className = 'del';
        d.type = 'button';
        d.textContent = '❌';
        d.addEventListener('click', () => {
            karta.remove();
            zapiszStan();
        });
        btns.appendChild(d);
    }

    btns.style.display = 'flex';
    btns.style.justifyContent = 'center';
    btns.style.gap = '0.5rem';
    btns.style.marginTop = '0.5rem';
}

document.querySelectorAll('.newcard').forEach((b, i) => {
    const kolumny = ['ToDoBoard', 'InProgressBoard', 'DoneBoard'];
    b.addEventListener('click', () => {
        stworzKarte(document.getElementById(kolumny[i]));
    });
});

document.querySelectorAll('.columncolor').forEach((b, i) => {
    const kolumny = ['ToDoBoard', 'InProgressBoard', 'DoneBoard'];
    b.addEventListener('click', () => {
        const board = document.getElementById(kolumny[i]);
        [...board.children].forEach(
            (k) => (k.style.backgroundColor = losowyKolor())
        );
        zapiszStan();
    });
});

document.querySelectorAll('.sort').forEach((b, i) => {
    const kolumny = ['ToDoBoard', 'InProgressBoard', 'DoneBoard'];
    b.addEventListener('click', () => {
        const board = document.getElementById(kolumny[i]);
        const karty = [...board.children].sort((a, b) =>
            a
                .querySelector('.tekst')
                .innerText.localeCompare(b.querySelector('.tekst').innerText)
        );
        board.innerHTML = '';
        karty.forEach((k) => board.appendChild(k));
        [...board.children].forEach((k) => dostosujPrzyciski(k));
        zapiszStan();
    });
});

wczytajStan();
