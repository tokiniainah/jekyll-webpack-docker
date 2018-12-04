export default class Application {
    /**
     * [Seloger constructor]
     */
    constructor (name) {
        // Store name
        this.name = name;

        console.info('Application name:', this.name);

        // Initialize Seloger Application
        this.initialize();
    }

    initialize () {
        let self = this;

        console.log('Hello', self.name);
    }
}
