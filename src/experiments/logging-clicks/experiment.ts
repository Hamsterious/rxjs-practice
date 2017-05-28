import * as Rx from 'rxjs/Rx'; // Import RxJs
import { tryCatchLogErrors, renderClick } from '../../helpers';

tryCatchLogErrors("logging clicks errors: \n", () => {

    Rx.Observable
        // Whenever the document is clicked
        .fromEvent(document, 'click')
        // Filter away all clicks made on the left half of the screen
        .filter((x: any) => {
            return x.clientX > innerWidth / 2;
        })
        // Take no more than 10 clicks
        .take(10)
        // Show the x and y axis of the point clicked.
        .subscribe(x => renderClick(x));
});