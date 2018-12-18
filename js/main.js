document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    let buffer = [];
    let lastKeyTime = Date.now();

    document.addEventListener('keydown', event => {
        const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const key = event.key.toLowerCase();

        // we are only interested in alphanumeric keys
        if (charList.indexOf(key) === -1) return;

        const currentTime = Date.now();

        if (currentTime - lastKeyTime > 1000) {
            buffer = [];
        }

        buffer.push(key);
        lastKeyTime = currentTime;

        const container = document.querySelector('#background');
        container.style.backgroundImage = `url(images/${buffer.join('')}.jpg)`;
    });
});
