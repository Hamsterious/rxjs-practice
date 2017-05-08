import * as Rx from 'rxjs/Rx'; // Import RxJs
import { getGitUsersAsJsonPromise, renderGitUsers } from './who-to-follow-helpers';

// A stream of refresh events
let refreshStream = Rx.Observable.fromEvent(document.getElementsByClassName('refresh-who-to-follow'), 'click').startWith('startup');

// A stream of different github urls.
let requestStream = refreshStream.map((x) => {
    let randomOffset = Math.floor(Math.random() * 500);
    return 'https://api.github.com/users?since=' + randomOffset + '?client_id=1b0a479a222ccfa8918a&client_secret=585bf3095db791d495764f6bdb9b7a552f3e273b';
});

// A stream of json responses from the requested git url.
let responseStream = requestStream.flatMap(x => {
    return Rx.Observable.fromPromise(getGitUsersAsJsonPromise(x)).take(3)
});

// Foreach result in the response stream, we render the result.
// Note x here is a json object with multiple json objects inside. 
// Each of these json objects describes data about a github user.
responseStream.subscribe(x => renderGitUsers(x));