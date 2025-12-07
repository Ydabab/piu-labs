import Ajax from './ajax.js';

const api = new Ajax();

const btnLoad = document.querySelector('#btn-load');
const btnError = document.querySelector('#btn-error');
const btnReset = document.querySelector('#btn-reset');

const list = document.querySelector('#list');
const errorBox = document.querySelector('#error-box');
const loader = document.querySelector('#loader');

function showLoader() {
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
}

function clearError() {
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
}

function renderList(items) {
    list.innerHTML = '';
    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.title;
        list.appendChild(li);
    });
}

btnLoad.addEventListener('click', async () => {
    clearError();
    showLoader();
    list.innerHTML = '';

    try {
        const data = await api.get('/posts');
        renderList(data.slice(0, 25));
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoader();
    }
});

btnError.addEventListener('click', async () => {
    clearError();
    showLoader();
    list.innerHTML = '';

    try {
        await api.get('/wrong-url');
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoader();
    }
});

btnReset.addEventListener('click', () => {
    list.innerHTML = '';
    clearError();
});
