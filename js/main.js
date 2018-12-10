document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase();
        console.log(key);
    });
});
