document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const options = {
        eventType: 'keydown',
        keystrokeDelay: 400
    };

    keyMapper([updateBackground, updateUI], options);
});

function keyMapper(callbackList, options) {
    const delay = hasProperty('keystrokeDelay', options) && options.keystrokeDelay >= 300 && options.keystrokeDelay;
    const keystrokeDelay = delay || 1000;
    const eventType = hasProperty('eventType', options) && options.eventType || 'keydown';

    let state = {
        buffer: [],
        lastKeyTime: Date.now()
    };

    document.addEventListener(eventType, event => {
        const key = event.key.toLowerCase();
        const currentTime = Date.now();
        let buffer = [];

        if (currentTime - state.lastKeyTime > keystrokeDelay) {
            buffer = [key];
        } else {
            buffer = [...state.buffer, key];
        }

        state = {buffer: buffer, lastKeyTime: currentTime};

        callbackList.forEach(callback => callback(buffer));
    });

    function hasProperty(property, object) {
        return object && object.hasOwnProperty(property);
    }
}

function updateBackground(keySequence) {
    const container = document.querySelector('#background');
    container.style.backgroundImage = `url(images/${keySequence.join('')}.jpg)`;
}

function updateUI(keySequence) {
    const userInput = keySequence.join('');
    const keySequences = {
        'idfa': 'All Weapons + Ammo',
        'idkfa': 'All Weapons + Ammo + Keys',
        'idbeholds': 'Beserk Pack',
        'idclev31': 'Bonus Level'
    };
    const userInputDisplay = document.querySelector('#user_input');
    userInputDisplay.textContent = userInput;

    const cheatMessage = document.querySelector('#cheat_message');
    cheatMessage.textContent = keySequences[userInput] || 'Nothing';
}
