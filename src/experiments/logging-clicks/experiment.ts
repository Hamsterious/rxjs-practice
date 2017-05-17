import * as Rx from 'rxjs/Rx'; // Import RxJs
import { tryCatchLogErrors } from '../../helpers';

tryCatchLogErrors("logging clicks errors: \n", () => {

    // Log all clicks from the right
    Rx.Observable
        .fromEvent(document, 'click')
        .filter((x: any) => {
            return x.clientX > innerWidth / 2;
        })
        .take(10)
        .subscribe(x => {
            return console.log("X: " + x.clientX + ", Y: " + x.clientY);
        });
});