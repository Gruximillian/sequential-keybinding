window.addEventListener('load', function() {
    'use strict';

    const cheatValid = document.querySelector('#cheat-valid');
    const cheatMessage = cheatValid.querySelector('#cheat-message');
    const image = cheatValid.querySelector('#cheat-image');

    const cheatCodes = {
        'idfa': 'All Weapons + Ammo',
        'idkfa': 'All Weapons + Ammo + Keys',
        'idbeholds': 'Beserk Pack',
        'idclev31': 'Bonus Level'
    };

    let keySequence = '';
    let lastKeyTime;
    let firstKey = true;

    document.addEventListener('keydown', function(e) {
        if (firstKey) {
            // This enables time tracking after the first key was pressed
            lastKeyTime = Date.now();
        }
        const timeNow = Date.now();
        const elapsedTime = timeNow - lastKeyTime;

        if (elapsedTime <= 1000) {
            // Update key sequence and disable firstKey tracker
            keySequence += e.key;
            firstKey = false;
        } else {
            // Reset key sequence and the firstKey tracker
            keySequence = '';
            keySequence += e.key;
            firstKey = true;
        }

        checkCode(keySequence);
        // Update lastKeyTime so that we can check if the user didn't make a large pause between key strokes
        lastKeyTime = timeNow;
    });

    function checkCode(codeString) {
        if (cheatCodes[codeString]) {
            image.src = `images/${codeString}.jpg`;
            cheatMessage.textContent = cheatCodes[codeString];
            cheatValid.style.display = 'block';
        } else {
            image.src = '';
            cheatMessage.textContent = '';
            cheatValid.style.display = 'none';
        }
    }
});
