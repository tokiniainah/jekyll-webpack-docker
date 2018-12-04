import Application from './application';

/**
 * Initialize app
 */
function initialize () {
    window.seloger = new Application('Emeric') || {};
}

try {
    initialize();
} catch (error) {
    console.error(error);
}
