document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const options = {
        eventType: 'keyup',
        keystrokeDelay: 500,
        keySequences: {
            'idfa': 'All Weapons + Ammo',
            'idkfa': 'All Weapons + Ammo + Keys',
            'idbeholds': 'Beserk Pack',
            'idclev31': 'Bonus Level'
        },
        backgroundSelector: '#background',
        userInputSelector: '#user_input',
        cheatMessageSelector: '#cheat_message'
    };

    keyMapper(options, updateBackground);

    function keyMapper(options, callback) {
        const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const keystrokeDelay = options.keystrokeDelay || 1000;
        const eventType = options.eventType || 'keydown';

        let state = {
            buffer: [],
            lastKeyTime: undefined
        };

        document.addEventListener(eventType, event => {
            const key = event.key.toLowerCase();
            const currentTime = Date.now();
            const lastKeyTime = state.lastKeyTime || currentTime;
            let buffer;

            // we are only interested in alphanumeric characters
            if (charList.indexOf(key) === -1) {
                buffer = [];
            } else if (currentTime - lastKeyTime < keystrokeDelay) {
                buffer = [...state.buffer, key];
            } else {
                buffer = [key];
            }

            state = { buffer: buffer, lastKeyTime: currentTime };

            callback(buffer, options);
        });
    }

    function updateBackground(buffer, options) {
        const input = buffer.join('');
        const container = document.querySelector(options.backgroundSelector);
        container.style.backgroundImage = `url(images/${input}.jpg)`;

        updateUI(input, options);
    }

    function updateUI(input, options) {
        const userInput = document.querySelector(options.userInputSelector);
        userInput.textContent = input;

        const cheatMessage = document.querySelector(options.cheatMessageSelector);
        cheatMessage.textContent = options.keySequences[input] || 'Nothing';
    }
});
