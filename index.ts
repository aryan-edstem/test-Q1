interface EventMap {
    userLoggedIn: {userId: string; timeStamp: number};
    dataupdated: { newData : any []};
    error: { message: any}
  }

class TypedEventEmitter<T extends Record<string,any>> {
    private listeners: { [K in keyof T]?: Array<(data: T[K]) => void>} = {};
    subscribe<K extends keyof T> (event: K, handler: (data:T[K]) => void): () => void {
        if(!this.listeners[event]) {
            this.listeners[event] = [];
        }
    this.listeners[event]!.push(handler);
    return ()=> {
        this.listeners[event] = this.listeners[event]!.filter(listener => listener !== handler);
    }
    }
    emit<K extends keyof T> (event: K, data: T[K]): void{
        if(this.listeners[event]){
            try{
                this.listeners[event]!.forEach(handler => handler(data));
            } catch(error){
                // this.emit('error',data:"error.message");
                console.log(error);
            }
        }  
    }
}


const emitter = new TypedEventEmitter<EventMap>();

emitter.subscribe('error', errorData => {
    console.error({errorData}, errorData.message ? 'message' : '');
});

const unsubscribeUserLoggedIn = emitter.subscribe('userLoggedIn', data => 
    console.log('User with userId: ',data.userId,' logged in at:',data.timeStamp)
);
const throwError = emitter.subscribe('userLoggedIn', () => {
    throw new Error('Something went wrong while Logging In!');
});

emitter.emit('userLoggedIn',{userId:'123',timeStamp: Date.now()});

unsubscribeUserLoggedIn();