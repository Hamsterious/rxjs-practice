import * as Rx from 'rxjs/Rx'; // Import RxJs
import { swallowErrors, renderElement } from '../../helpers';

swallowErrors("Add-numbers errors: \n", () => {
    addNumbersStatic();
    addNumbersRxJs();
});

function addNumbersStatic(){
    let addNumbersStaticSource = ['1','1','foo','2','3','5','bar','8','13']; 

    let addNumbersStaticResult = addNumbersStaticSource
                // Parse each string to a number
                .map(x => parseInt(x))
                // Filter away items we couldn't parse
                .filter(x => !isNaN(x))
                // Add numbers together.
                .reduce((x,y) => x + y); 
    
    renderElement("#add-numbers-static", 0, addNumbersStaticResult.toString());
}

function addNumbersRxJs(){

    let addNumbersSourceStream = 
                    // Create a stream. Stream = Observable.
                    Rx.Observable 
                    // Emit a number++ every half second
                    .interval(200) 
                    // Take nine of these numbers...
                    .take(9) 
                    // And map each number to a value in the array.
                    .map(i => ['1','1','foo','2','3','5','bar','8','13'][i]); 

    let addNumbersresultStream = 
                // From the source stream.
                addNumbersSourceStream 
                // Parse each string to a number
                .map(x => parseInt(x)) 
                // Filter away items we couldn't parse
                .filter(x => !isNaN(x)) 
                // Add numbers together.
                .reduce((x,y) => x + y); 

    // Subscribe to the result stream, and for each event, attach the result to the dom.
    addNumbersresultStream.subscribe(x => {
        renderElement('#add-numbers-rxjs', 0, x.toString());
    });
}