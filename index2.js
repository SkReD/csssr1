const boxSelectorCreator = () => {
    let boxes = {};

    const get = (name) => boxes[name];

    const add = (name, box) => boxes = { ...boxes, [name]: box };

    const remove = (name) => {
        boxes = Object.keys(boxes).map(box => box !== name ? boxes[name] : null);
    };

    const exists = (name) => boxes[name] !== undefined;

    return { boxes, get, add, remove, exists };
};

const boxSelector = boxSelectorCreator();


class Mailbox {
    constructor(name) {
        if (boxSelector.exists(name)) {
            return boxSelector.get(name);
        } else {
            this.preHooks = [];
            this.notifyHooks = [];
            boxSelector.add(name, this);
            return this;
        }
    }

    onSend(cb) {
        this.send = cb;
    }

    pre(cb) {
        this.preHooks.push(cb);
        return this;
    }

    notify(cb) {
        this.notifyHooks.push(cb);
        return this;
    }

    sendMail(message) {
        if (this.checkPreHooks(message)) {
            if (this.send(message)) {
                this.notifyHooks.forEach(hook => hook(message));
            }
        }
    }

    checkPreHooks(message) {
        return !this.preHooks.some((hook) => !hook(message));
    }
}
