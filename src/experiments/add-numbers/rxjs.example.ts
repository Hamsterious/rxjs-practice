import * as Rx from 'rxjs/Rx'; // Import RxJs

let sourceStream = Rx.Observable // Create a stream. Stream = Observable.
                .interval(500) // Emit a number++ every half second
                .take(9) // Take nine of these numbers...
                .map(i => ['1','1','foo','2','3','5','bar','8','13'][i]); // And map each number to a value in the array.

let resultStream = sourceStream // From the source stream.
            .map(x => parseInt(x)) // Parse each string to a number
            .filter(x => !isNaN(x)) // Filter away items we couldn't parse
            .reduce((x,y) => x + y); // Add numbers together.

// Subscribe to the result stream, and for each event, attach the result to the dom.
resultStream.subscribe(x => { 
    document.getElementById('add-number-rxjs').innerHTML = resultStream.toString();
});