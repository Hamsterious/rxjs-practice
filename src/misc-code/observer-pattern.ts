// The producer listerners want to subscribe to
class Producer {
    private listeners: any[] = [];

    public subscribe(listener: any): void {
        this.listeners.push(listener);
    }

    public unsubscribe(listener: any): void {
        let index = this.listeners.indexOf(listener);
        this.listeners.splice(index, 1);
    }
    
    public notify(message: string) {
        this.listeners.forEach((listener) => {
            listener.update(message);
        });
    }
};

// Listeners. They must have a update method to work, much like INotifyPropertyChanged in the C# Observer pattern.
class SimpleLogListener {
    public update(message: string): void {
        console.log('simpleLogListener: ', message);
    }
};

class LogAsCapitalListener {
    public update(message: string): void {
        console.log('logAsCapitalListener: ', message.toUpperCase());
    }
};

// Create producer and listeners.
let producer = new Producer();
let simpleLogListener = new SimpleLogListener();
let logAsCapitalListener = new LogAsCapitalListener();

// Subscribe and notify listeners
// producer.subscribe(simpleLogListener); 
// producer.subscribe(logAsCapitalListener);
// producer.notify('Hello there!');

// Result:
// simpleLogListener: Hello there!
// logAsCapitalListener: HELLO THERE!