"use strict";
class TypedEventEmitter {
    constructor() {
        this.listeners = {};
    }
    subscribe(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(handler);
        return () => {
            this.listeners[event] = this.listeners[event].filter(listener => listener !== handler);
        };
    }
    emit(event, data) {
        if (this.listeners[event]) {
            try {
                this.listeners[event].forEach(handler => handler(data));
            }
            catch (error) {
                // this.emit('error',data:"error.message");
                console.log(error);
            }
        }
    }
}
const emitter = new TypedEventEmitter();
emitter.subscribe('error', errorData => {
    console.error({ errorData }, errorData.message ? 'message' : '');
});
const unsubscribeUserLoggedIn = emitter.subscribe('userLoggedIn', data => console.log('User with userId: ', data.userId, ' logged in at:', data.timeStamp));
const throwError = emitter.subscribe('userLoggedIn', () => {
    throw new Error('Something went wrong while Logging In!');
});
emitter.emit('userLoggedIn', { userId: '123', timeStamp: Date.now() });
unsubscribeUserLoggedIn();
