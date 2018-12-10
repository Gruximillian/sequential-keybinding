document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const options = {
        selector: '#background',
        keystrokeDelay: 1000,
        eventType: 'keydown',
        keySequences: {
            'idfa': 'All Weapons + Ammo',
            'idkfa': 'All Weapons + Ammo + Keys',
            'idbeholds': 'Beserk Pack',
            'idclev31': 'Bonus Level'
        },
        userInputSelector: '#user_input',
        cheatMessageSelector: '#cheat_message'
    };

    keyMapper(options, updateBackground);

    function keyMapper(options, callback) {
        const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let state = {
            buffer: [],
            lastKeyTime: undefined
        };

        document.addEventListener(options.eventType, event => {
            const key = event.key;
            const currentTime = Date.now();
            const lastKeyTime = state.lastKeyTime || currentTime;
            let buffer;

            // we are only interested in alphanumeric characters
            if (charList.indexOf(key) === -1) {
                buffer = [];
            } else if (currentTime - lastKeyTime < options.keystrokeDelay) {
                buffer = [...state.buffer, key];
            } else {
                buffer = [key];
            }

            const sequence = buffer.join('');
            const sequenceValue = options.keySequences[sequence];
            state = { ...state, lastKeyTime: currentTime, buffer: buffer };

            updateUI(sequence, options);

            if (!sequenceValue) return;

            callback(sequence, options.selector);
        });
    }

    function updateBackground(imgName, selector) {
        const container = document.querySelector(selector);
        container.style.backgroundImage = `url(images/${imgName}.jpg)`;
    }

    function updateUI(sequence, options) {
        const userInput = document.querySelector(options.userInputSelector);
        userInput.textContent = sequence;

        const cheatMessage = document.querySelector(options.cheatMessageSelector);
        cheatMessage.textContent = options.keySequences[sequence] || 'Nothing';
    }
});
