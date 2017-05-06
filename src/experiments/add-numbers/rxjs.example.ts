import * as Rx from 'rxjs/Rx';

let sourceStream = Rx.Observable
                .interval(400)
                .take(10)
                .map(i => ['1','1','foo','2','3','5','bar','8','13'][i]);

let resultStream = sourceStream
            .map(x => parseInt(x)) // Parse each string to a number
            .filter(x => !isNaN(x)) // Filter away items we couldn't parse
            .reduce((x,y) => x + y); // Add numbers together.

console.log("rxjs output")
resultStream.subscribe(x => console.log(x));