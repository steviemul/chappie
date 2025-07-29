class AnswerHeader {

    constructor(question) {
        const headerElement = document.createElement('div');

        headerElement.className = 'collapsible-header';
        headerElement.innerHTML = question;

        this.headerElement = headerElement;
    }

    get element() {
        return this.headerElement;
    }
}

export { AnswerHeader };