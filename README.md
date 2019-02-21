# How to detect a sequence of keystrokes in JavaScript

One of the most used features of JavaScript is its ability to react on various events that may occur while the user interacts with the web page. In fact, that was the very idea of JavaScript when it appeared, to make web pages dynamic by adding some interactivity to them. With JavaScript we can react when a user clicks on a specific part of the page, when a key is pressed, when mouse moves, when the page is loaded, when an element gets focused, etc.

>For the list of all JavaScript events available [check this MDN page](https://developer.mozilla.org/en-US/docs/Web/Events).

Even though today JavaScript can be used to do so much more, this basic feature of adding interactivity to the web page is still widely used to provide the users with rich and interesting experiences. In this article, we will be looking into how we can use JavaScript to react to the keyboard events, specifically, how to react to the specific key sequence that the user types. So, when the user presses a key combination, the web page might show some content, like opening a menu or a modal, it can change the styling of the page or perform any other action you can imagine which is within the JavaScript capabilities.

Before we start I just want to point out that I'm using some ES6 features like [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) and [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), the [spread (`...`) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [etc.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_support_in_Mozilla) If you are not familiar with those, check the provided links to learn more.

## What are we building?

For this article I've decided to make an element on the page change its background image based on the sequence of keys the user types. So we are basically dealing with the styling, nothing too fancy. We will also add some text updates as well just to make the demonstration richer and to provide more info to the user. My idea was to use the key sequences that are used as cheat codes in an old FPS game, Doom and Doom 2. Basically, when the user types a key combination, the game enables some benefits to the user, like more ammo, more health, invulnerability, etc. In the example that we will build, we will make the background image for an element on the page to change based on the key sequence typed in by the user. You can see and try the demo [here](https://gruximillian.github.io/sequential-keybinding/).

## Basic project

In order to focus only on JavaScript, I've created complete HTML and CSS for the project, and linked the JavaScript file which only contains a console log to make sure it works. You can download the initial project files [here](https://github.com/Gruximillian/sequential-keybinding/tree/01-project-structure) or you can create your own if you like to have it made your own way.

Here is quick breakdown of the JavaScript content we initially have.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    console.log('content loaded');
});
```

It's pretty straightforward, we add an event listener to the document that waits until the DOM is fully loaded and then calls the callback function. The callback function currently only has the `'use strict'` statement and a console log to verify that the file is correctly linked to the HTML page.

> We can omit this event listener and the callback that is passed to it, but then the script file should be placed at the end of the `body` HTML element to make sure that the DOM is fully loaded when the javascript starts executing. If you choose so, feel free to do it. This is just my preferred way of doing it, with the benefit that it also encapsulates all of the JavaScript code into a function and avoids global scope pollution.

### Listening to the key Events

The next step would be to detect when the user presses a key. We do that the same way we added the listener for the `DOMContentLoaded` event, but now we will specify a different event name. There are [three keyboard events](https://developer.mozilla.org/en-US/docs/Web/Events#Keyboard_Events) that we can specify: `keydown`, `keyup` and `keypress`.

* `keydown` - fires immediately when the key is pressed
* `keyup` - fires when the key is released
* `keypress` - fires continuously while key is held pressed

From this description we can immediately see that the `keypress` is definitely not suitable for our purpose. That leaves us with `keydown` and `keyup`. In our case both of these will do well, but in a different situation one of them might be more suitable than the other, so you will need to assess the situation and choose accordingly. Only difference we can notice here is that if we use `keyup` it might feel a bit laggy, while `keydown` really feels like the reaction is immediate. I will choose `keydown`, but since the same can be achieved with `keyup`, feel free to use the event you like more.

Now, let's add the event listener and remove the console log:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    document.addEventListener('keydown', event => {

    });
});

```

There are two important things to notice here. First, we have provided the `keydown` event name to the `addEventListener`, and we are providing the `event` parameter to the event handler callback function. We will need that `event` parameter to check which key is being pressed.

So, to get the key that has been pressed we can access the `key` property of the `event` object:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase();
        console.log(key);
    });
});

```

> **Hint:** To see which properties of the `event` object are available, simply do `console.log(event)` and look at the logged object. I know this might seem obvious, but if you are a beginner you might try and look online for available options, which is fine, but the answer is usually just a console log away.

After getting the `event.key`, we are transforming it to lower case because it would be good to make these keyboard shortcuts case insensitive. It won't be the case every time, but this time, it's perfectly fine. Go on now, open the browser console, click back at the page and try to type something. You can see that the key that you pressed is logged to the console. But if you are attentive you might notice that it logs ANY key that is pressed, meaning keys like `Enter`, `Delete`, `Backspace`, etc. are also logged. That is great and can be useful, but in this case I want to use only letters and digits. Therefore, let's add a check if the key that's being pressed is a letter or a digit.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    document.addEventListener('keydown', event => {
        const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const key = event.key.toLowerCase();

        // we are only interested in alphanumeric keys
        if (charList.indexOf(key) === -1) return;

        console.log(key);
    });
});
```

By creating the `charList` variable which contains all the characters we are interested in, we are able to check if the `key` is present in the `charList` string, and if not, we simply return from the function without logging the character.

Now that we are listening to the key events and are able to filter only the keys we are interested in, it is time to see how we can save a sequence of entered keys.

### Saving the entered key sequence

To save the sequence of entered keys we need to add a variable that will store that sequence and which we can update on every key event that we are interested in. We could use a string that we can concatenate keys on, but we can also use an array in which we can store individual keys as the array items. In this simple use case, it doesn't matter much what we use, but I'll go with the array approach. The array approach is a suggested approach over the string concatenation in cases where a lot of strings have to be concatenated, and it also allows us to use all of the array methods if we need them.

Let's create a variable called `buffer`, an empty array initially, and push the new keys into it.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    let buffer = [];

    document.addEventListener('keydown', event => {
        const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const key = event.key.toLowerCase();

        // we are only interested in alphanumeric keys
        if (charList.indexOf(key) === -1) return;

        buffer.push(key);
        console.log(buffer);
    });
});
```

If we define the `buffer` array inside the `keydown` event listener, it will be reset every time a key is pressed, and the entered sequence of keys will be lost. Because of that we need to define it outside of the `keydown` event listener. Now we are able to save all of the entered keys. But if we look at the log, we can notice that now we are saving the keys all the time, and the array just grows with new keys being pressed. Check the gif bellow to see the result.

![logging the key sequence](https://raw.githubusercontent.com/Gruximillian/sequential-keybinding/master/screenshots/hello.gif)

See how after writing 'hello' and some delay, when I continue typing, it still has all of the previous values in the array. That is not very useful for what we want. It would be good to reset the list of entered keys after a certain time has passed since the user entered the last key. For the condition to do that we can use the time interval between the last two key presses. If that interval is longer than the specified amount of time, then we will reset the `buffer` array. Let's do that next.

### Limit the time interval between key presses

For this we need to compare when the last and the current keystroke happened and then check if the time between those was greater than some desired time delay, like 1 second, 0.5 seconds, whatever you find most convenient. So, we need to have at least one new variable to save the last keystroke time. In order to be able to check that value, we need to define the variable outside the event listener and then update it after keystroke happened.

```javascript
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

        console.log(buffer);
    });
});
```

We introduced two new variables, `lastKeyTime` and `currentTime`. We can do it with just `lastKeyTime`, but it is much easier to reason about with `currentTime` variable present. Let's see what we did here.

First, we defined `lastKeyTime` variable and initialized it with a current time value. We had to initialize it because we need some value to perform a calculation bellow. We can use zero as a value here, but to make it consistent, let's use the current time value. Next, we defined `currentTime` variable and initialized it with the current time as well. At this point someone might ask why two variables that have the same value?! Bare in mind that those are just initialization values, at least for `lastKeyTime`. We will need to update that value after every keystroke. And notice that `lastKeyTime` is initialized outside the event listener, that is, only once, while `currentTime` will be reinitialized on every keystroke.

Now we have an important part, the check whether enough time has passed between the keystrokes. If it has, we want to reset the `buffer` variable, the array that holds characters that user has pressed. To do that check we simply subtract `lastKeyTime` from `currentTime` variable and check if the result is greater than some number. In the example, that number is 1000, that is 1000 milliseconds or 1 second. That is a good starting value, and it can be changed later to better tune the experience. So, if the condition `currentTime - lastKeyTime > 1000` is true, we are resetting the `buffer` to an empty array: `buffer = []`; After that, the `buffer` will receive a new key, but it will be the only one in the array.

The last thing we need to do here is to update the `lastKeyTime` value. We simply set its value to be the same as `currentTime` value. On the next keystroke, `lastKeyTime` will hold the time when the last keystroke happened while `currentTime` will get a new value.

### Updating the background image

Finally, we are ready to do what we wanted, change the background based on the sequence of keys that user has entered.

If the user enters the correct key sequence, we need to grab an element on the page and update its background according to the user input. That seems like we need to have a check for the correct key sequence. While that is almost certainly true in most cases, in this one it is not necessary. The nature of this problem allows us to skip the check if we are ok with what happens if the key sequence is not correct. What do I mean by this? Let me explain in detail.

If we want to change the background image using CSS, we will need to update the url for the image. If the images are named the same as the key sequences, then all we need to do is to read the input, make it a string, and set that as the url for the background image. The interesting thing is that if the image does not exist, the background will not be shown. Which means that in cases where we do have an image displayed, and then type something that does not match an existing image url, the background image will be gone. In this case I am ok with that, therefore the check if the url is correct is not needed. But if we would like to keep the currently displayed image, then that check will be necessary. Let's do it the simple way, that is, without that check.

```javascript
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
```

We have removed `console.log`, and instead added a query to get the element on which the background will be displayed, and in the next line we apply the background url. This url structure will depend on your project structure, in this case, the images are in the 'images' folder and are in jpg format. Important to notice here is that we need to create a string out of the `buffer` array so that it can be used in image url. We do that by simply joining the array elements with an empty character as the join character, `buffer.join('')`.

With this we have achieved the main goal of this article. Now the user can try to enter the correct key sequence and if it is successful, the background will change. What we have done is simple and functional and can be easily incorporated into any project. But it is still possible to make some improvements. So, if you like to have more flexibility in your code, keep on reading.

## Improving the project

Looking at our code in whole shows us that we are using some 'global' variables. Global in the sense that they are in the top context of our script, enclosed in the `DOMContentLoaded` event listener function where all the rest of the code will be, meaning that they will mix with other variables in the top level context of our script. But the declaration of the variables `buffer` and `lastKeyTime` can't go inside the `keydown` event listener because that will reset them with every keystroke and break the functionality.

### Wrapping the code into a function

To isolate the code that controls our key events, we can put variables and the `keydown` event listener into a separate function.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    keyMapper();
});

function keyMapper() {
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
}
```

With this, our `keyMapper` function is completely independent of other code in our script, and it can be even imported from another file to make things even clearer. But now that we have this function we can see other possibilities for improvement.

### Removing hardcoded values

One of the essential things that we can do in order to make the function more flexible is to remove any hardcoded values that we use and instead pass them to the function as parameters.

The most important values that we need which are hardcoded are the selector for the background container element (`#background`), the parts for the image url, and the time delay value in this check `if (currentTime - lastKeyTime > 1000)`. There is also the `charList` variable, but even though we can also pass it as the parameter and control exactly which characters are allowed, we can leave it for now to make things simpler. Instead, what we can do with the `charList` is to move it out of the event listener, into the `keyMapper` function to avoid declaring it on every keystroke. So, let's make all these changes.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    keyMapper('#background', 'images/', '.jpg', 1000);
});

function keyMapper(selector, imgPrefix, imgSuffix, keystrokeDelay) {
    const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let buffer = [];
    let lastKeyTime = Date.now();

    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase();

        // we are only interested in alphanumeric keys
        if (charList.indexOf(key) === -1) return;

        const currentTime = Date.now();

        if (currentTime - lastKeyTime > keystrokeDelay) {
            buffer = [];
        }

        buffer.push(key);
        lastKeyTime = currentTime;

        const container = document.querySelector(selector);
        container.style.backgroundImage = `url(${imgPrefix}${buffer.join('')}${imgSuffix})`;
    });
}
```

Now the `keyMapper` function takes four parameters which enable us to customize it more easily. Now, when a function has more than three parameters it starts to feel a bit clumsy, it is easy to forget or mix up some. We will fix that a bit later, but for now let's go with this.

### Create a callback function

The desired action of our script is to update the background on an element on the page. That happens on the last line of the script. But maybe you want something completely different to happen after a specific key sequence is typed by the user, maybe play a sound, open a dialog or whatever you can think of. In our current version of the script, we can only update the background. But it would be really nice if we can easily tell our script if we want to do something else instead, that is, to use the `keyMapper` function to be able to execute a specific function that we have defined. In order to do that, we can define a function that we can pass to the `keyMapper` function and then execute it from there.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    keyMapper('#background', 'images/', '.jpg', 1000, updateBackground);
});

function keyMapper(selector, imgPrefix, imgSuffix, keystrokeDelay, callback) {
    const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let buffer = [];
    let lastKeyTime = Date.now();

    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase();

        // we are only interested in alphanumeric keys
        if (charList.indexOf(key) === -1) return;

        const currentTime = Date.now();

        if (currentTime - lastKeyTime > keystrokeDelay) {
            buffer = [];
        }

        buffer.push(key);
        lastKeyTime = currentTime;

        callback(selector, imgPrefix, buffer, imgSuffix);
    });
}

function updateBackground(selector, imgPrefix, keySequence, imgSuffix) {
    const container = document.querySelector(selector);
    container.style.backgroundImage = `url(${imgPrefix}${keySequence.join('')}${imgSuffix})`;
}
```

As you can see, new `keyMapper` function accepts one more parameter (dooh!), `callback`, which is a function that we want to execute after a key is pressed. On the last line inside `keyMapper` function, we are calling that `callback` function and passing to it some variables that it needs. When `keyMapper` is called, we passed to it the function named `updateBackground` which is declared after the `keyMapper` function. Function `updateBackground` basically contains those two last lines from `keyMapper` that we have removed. With this we have completely separated the key sequence saving and the action that is performed after that sequence is obtained. If we were to write a new function and pass it to the `keyMapper` as the callback instead of the `updateBackground` function, we can get a completely different behavior.

### A step back

One thing that started to bug me a lot is the fact that we now have five parameters for the `keyMapper` function and four for the `updateBackground` function, and all of the parameters for the `updateBackground` are also passed to the `keyMapper` function before they are passed to the `updateBackground` function.

Now that we have separated the callback function from the `keyMapper` function, it makes sense to simply hardcode back required values in the `updateBackground` function since that way we will contain all of the information required inside the callback function and we can call it with only one parameter, the key sequence that the `keyMapper` provides. That also means that the `keyMapper` function can be called with only two parameters, the `keystrokeDelay` and the `callback` function. Here's the updated script:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    keyMapper(1000, updateBackground);
});

function keyMapper(keystrokeDelay, callback) {
    const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let buffer = [];
    let lastKeyTime = Date.now();

    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase();

        // we are only interested in alphanumeric keys
        if (charList.indexOf(key) === -1) return;

        const currentTime = Date.now();

        if (currentTime - lastKeyTime > keystrokeDelay) {
            buffer = [];
        }

        buffer.push(key);
        lastKeyTime = currentTime;

        callback(buffer);
    });
}

function updateBackground(keySequence) {
    const container = document.querySelector('#background');
    container.style.backgroundImage = `url(images/${keySequence.join('')}.jpg)`;
}
```

Now, that looks a bit more cleaner and the functionality and parameters are nicely separated. Still, we can do a bit better than this. You might have noticed that there's another string hardcoded in the `keyMapper` function, the `keydown` event name. If we decided to have the `keyMapper` work on `keyup` event instead, we would need to change it directly inside the function. That is not necessarily a big problem but it would be nice if we can control that trough parameters as well.

So, we add a third parameter to the `keyMapper` function?

We could do that, but let's go a step further and make it just one parameter. Let's introduce ...

### The options object

A really nice way of providing parameters for functions is by providing the object with the properties which hold the parameter values. It is most useful in cases where there are many parameters to be passed to the function and especially in cases where those parameters are optional and represent some sort of configuration for the function. The parameters that we need for the `keyMapper` function, `keystrokeDelay` and the new `eventType` to be added, really do look like the configuration values. One extra benefit of using the object to pass the parameters to the function is that the order of the parameters doesn't matter.

Here's how we can do that now:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const options = {
        eventType: 'keydown',
        keystrokeDelay: 1000
    };

    keyMapper(updateBackground, options);
});

function keyMapper(callback, options) {
    const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const eventType = options && options.eventType || 'keydown';
    const keystrokeDelay = options && options.keystrokeDelay || 1000;
    let buffer = [];
    let lastKeyTime = Date.now();

    document.addEventListener(eventType, event => {
        const key = event.key.toLowerCase();

        // we are only interested in alphanumeric keys
        if (charList.indexOf(key) === -1) return;

        const currentTime = Date.now();

        if (currentTime - lastKeyTime > keystrokeDelay) {
            buffer = [];
        }

        buffer.push(key);
        lastKeyTime = currentTime;

        callback(buffer);
    });
}

function updateBackground(keySequence) {
    const container = document.querySelector('#background');
    container.style.backgroundImage = `url(images/${keySequence.join('')}.jpg)`;
}
```

The `options` object now holds the name of the event to listen to and the time delay between the keystrokes. Inside the `keyMapper` function we also have these two lines:

```javascript
    const eventType = options && options.eventType || 'keydown';
    const keystrokeDelay = options && options.keystrokeDelay || 1000;
```

This is where we made our parameters optional. If the values are provided through the `options` object, they will be used, if not, we will use the default values. You can test that by changing the values in the `options` object. You may completely omit the `options` object in the call to `keyMapper` function and it will still work with the default values. We can also pass the callback function through the options object, but since without that function we would not have any sensible functionality, it seems better to pass it as a separate and a required parameter.

Another thing to notice in this last change is that the parameter order for the `keyMapper` function is reversed. It wasn't necessary to do so, but if a parameter is optional, it is usually provided after the required ones, otherwise if you want to omit the optional `options` parameter, you would need to call `keyMapper` function like this:

```javascript
keyMapper(null, updateBackground); // null is the value for the options object
```

### Add the state management

No, this won't be redux or any other state management library, it would be silly to add the whole library for such small script. We will simply organize our variables which hold the state of the script, the `buffer` and `lastKeyTime`, into one object and update it on every change.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const options = {
        eventType: 'keydown',
        keystrokeDelay: 1000
    };

    keyMapper(updateBackground, options);
});

function keyMapper(callback, options) {
    const eventType = options && options.eventType || 'keydown';
    const keystrokeDelay = options && options.keystrokeDelay || 1000;

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

        callback(buffer);
    });
}

function updateBackground(keySequence) {
    const container = document.querySelector('#background');
    container.style.backgroundImage = `url(images/${keySequence.join('')}.jpg)`;
}
```

Now the key sequence and the time of the last keystroke are saved as the `buffer` property and the `lastKeyTime` property of the `state` object. On every keystroke we copy the `buffer` property into the local `buffer` variable and update that variable accordingly. After that, the state gets updated with the local `buffer` variable and the `currentTime` variable. At the end, the `callback` is called with the current `buffer` value.

One thing to note here is that we never directly update the existing state object nor its `buffer` property, but rather we always create new object for the `state` and new array for the `buffer`. This is known as the immutable update of the state and it is the preferred way of updating the state. We never change previous value/object, we always assign the new value/object to the state.

The line

```javascript
buffer = [key];
```

is resetting the `buffer` in the case where more time has passed between keystrokes than the `keystrokeDelay` defines.

The line

```javascript
buffer = [...state.buffer, key];
```

is using the spread operator `...` to fill the new array with the values from the state buffer, and then we add the current key to the array. With that, the buffer is updated.

Finally, the line

```javascript
state = {buffer: buffer, lastKeyTime: currentTime};
```

is updating the `state` by assigning the new object with new `buffer` and `lastKeyTime` values.

In this last code sample, I have removed the character test since it does not really improve the functionality of the script, but of course, you can always add your own check to control how the script behaves.

## Final touch

Our script is complete now. We can set options, create any callback function that we want, the state is updated immutably. Overall, our `keyMapper` function is now pretty flexible.

If you take a closer look at the page in the browser, you will notice that there is that column on the left with some information. On the lower part of the column you can see the placeholders for the key sequence ("some keys") that the user has entered and for the feedback message ("nothing yet") for the user. Those are currently useless, but we can change that easily. There are multiple way of doing that.

The simplest way is to add more functionality to the callback function `updateBackground`. But that will then change what the function does and its name won't be describing properly what it does. So, we can write our new code inside another function and call that function from the `updateBackground` function. That is not ideal solution, but it is better than to just slap the new code into the `updateBackground` function which has nothing to do with updating the background. Here's how we'd do that:

```javascript
function updateBackground(keySequence) {
    const container = document.querySelector('#background');
    container.style.backgroundImage = `url(images/${keySequence.join('')}.jpg)`;

    updateUI(keySequence);
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
```

Another way of doing this is to simply call `keyMapper` second time with the `updateUI` function as the callback function:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const options = {
        eventType: 'keydown',
        keystrokeDelay: 1000
    };

    keyMapper(updateBackground, options);
    keyMapper(updateUI, options);
});
```

This is slightly better when it comes to the separation of functionality, but we now have two event listeners that basically do the same thing.

It would be good if we can have only one event listener for the key events and then call all the functions that we want when the event happens. And we can do that, we only need to provide all those functions to the `keyMapper` function and the best way to do that is to pass an array that will hold the references to all the callback functions that we want to execute when key event occurs. Updating the code to achieve this is really simple:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const options = {
        eventType: 'keydown',
        keystrokeDelay: 1000
    };

    keyMapper([updateBackground, updateUI], options);
});

function keyMapper(callbackList, options) {
    const eventType = options && options.eventType || 'keydown';
    const keystrokeDelay = options && options.keystrokeDelay || 1000;

    let state = {
        buffer: [],
        lastKeyTime: Date.now()
    };

    document.addEventListener(eventType, event => {
        const key = event.key;
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
}

function updateBackground(keySequence) {
    const validKeys = keySequence.every(key => !isNaN(parseInt(key)) || key.toLowerCase() !== key.toUpperCase());
    if (!validKeys) return;
    const container = document.querySelector('#background');
    container.style.backgroundImage = `url(images/${keySequence.join('')}.jpg)`;
}

function updateUI(keySequence) {
    const userInput = keySequence.join('').toLowerCase();
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
```

So, `keyMapper` function is now receiving an array of function references:

```javascript
keyMapper([updateBackground, updateUI], options);
```

and then on every `buffer` update all of those functions get called:

```javascript
callbackList.forEach(callback => callback(buffer));
```

Adding new functionality for key events is now as easy as writing a function that preforms what we want and passing its reference to the `keyMapper` function when we call it.

## UPDATE (Feb 21, 2019)
It was brought up in the comments that the user can enter a path like `../myimage` and that would access some file that is up one level in the directory structure… if it exists. To avoid the possibility to use any characters other than letters and numbers, this lines are added to the `updateBackgroundfunction`:

```javascript
const validKeys = keySequence.every(key => !isNaN(parseInt(key)) || key.toLowerCase() !== key.toUpperCase());
if (!validKeys) return;
```

Also, the keyMapper function now returns keys not converted to lower case. That conversion now happens in the callback functions that need to do that, like `updateUI` function.

## UPDATE (Feb 15, 2019) - JavaScript says this is true (0 == false), and this ('' == false)

After being reminded in the [comments](https://medium.com/@Shrekgrinch/might-want-to-consider-dumping-the-truthy-checking-for-the-options-parameters-4fe666d5909d) about the dangers of using the evaluation of truthy values in JavaScript I've decided to address that and fix the problematic part.

The issue is within these lines:

```javascript
    const eventType = options && options.eventType || 'keydown';
    const keystrokeDelay = options && options.keystrokeDelay || 1000;
```

As I already mentioned, this will use the value from the options object if it exists, and if it does not exist, then it will use the default value. Except that it won't do that in all cases. If for some reason `options.eventType` and `options.keystrokeDelay` have values that are evaluated to falsy, then those values won't be used and it will skip to the defaults.

We expected to have the value `undefined` for those properties if they don't exist, which will evaluate to false and we will then use the defaults. The value `null` can evaluate to false as well, which is also ok.

What we haven't considered here is the type of the variables. That is because, depending on the type of the variable, we can have other falsy values to occur.

We expect the first property, `options.eventType`, to be a string. But what if it is an empty string? JavaScript says that an empty string should evaluate to `false` in such comparisons. Which means that if we pass an empty string to the `options.eventType` property, we will still get the default `keydown` event since the empty string will evaluate to false. But, if we don't pass anything, it would not work! So, it this case it actually works in our favor to fail that check for the emtpy string and use the default `keydown` event type. That's good.

The second property, `options.keystrokeDelay`, is expected to be a number. And in the case of numbers, JavaScript says that the zero should evaluate to `false`. If we wanted to pass the zero for the delay value, it won't be accepted and it will fall back to the default of 1000ms. But on the other hand, I hear you say "Who could type so fast that the zero value should be considered at all?". And you're correct, in that case all of this is pointless, we could only listen for one key at a time.

 So, we're good here as well, no need to do anything? Actually no. What if the number provided is negative? It certainly won't go back in time and react to key presses before they occur, but it will do that as soon as they do occur. Basically, it is the same as setting the value to zero but it passes the truthy test. We see now that we need another condition here, we need numbers greater than zero. Now, we solved the issue, but what if someone passes number like 10? Is 10ms enough to connect two keystrokes for you? Not for me, that's for sure. I barely can do it with 250ms delay. From my point of view as the developer of this app I see no reason to enable delays less than the minimum I need to connect two keystrokes. So I've decided to limit the delay to the minimum of 300 miliseconds.

 Here's updated code for the `keyMapper` function:

 ```javascript
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
 ```

 I've added a function `hasProperty` which will check if the property exists on the object, and only after that check passes we can proceed on to the next checks. On the line for the `delay` you can also see the `options.keystrokeDelay >= 300` check which will limit the delay to 300ms.

 One last thing I'd like to mention is that these problems that I'm talking about in this updated section can all be avoided in the first place if we write proper tests for our code. For example, we can easily think of the issues with the empty string when we consider what possible inputs could the function get for the `eventType` property. Same goes for the `keystrokeDelay` property, while considering possible inputs, we can quickly realize that using zero, negatives or even too small numbers is not working good.

## Conclusion

Even though the basic functionality of reacting on a specific key sequence was a short and simple task, I wanted to go a few steps further and show how we can really make a function that is flexible to enable us a bit more control. We achieved that with passing the list of callback functions and an options object to the `keyMapper` function. But you can make the function even more customizable by providing more options and adding the code into the function related to those new options. Depending on what you need, you can extend it as much as you like. Of course, be reasonable in doing that because you want your code to be readable and easy to reason about.

I hope this article has given you some ideas how you can use this in your projects and please feel free to share them in the comments if you like. Thank you for reading and Happy New Year!
