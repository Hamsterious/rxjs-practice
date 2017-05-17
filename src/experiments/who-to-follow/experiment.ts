import * as Rx from 'rxjs/Rx'; // Import RxJs
import { 
    getGitUsersAsJsonPromise, 
    tryCatchLogErrors, 
    renderSuggestedGithubUser } from '../../helpers';

tryCatchLogErrors("Who-to-follow errors: \n", () => {

    // Get DOM elements we want to create streams from
    let refreshButton = document.querySelector('.refresh');
    let refreshNewUserButton1 = document.querySelector('.refresh-user-1');
    let refreshNewUserButton2 = document.querySelector('.refresh-user-2');
    let refreshNewUserButton3 = document.querySelector('.refresh-user-3');

    // Create event streams from each DOM element. In this case, events are emitted from DOM events.
    let mainRefreshStream = Rx.Observable.fromEvent(refreshButton, 'click').startWith('startup');
    let refreshUserClickStream1 = Rx.Observable.fromEvent(refreshNewUserButton1, 'click');
    let refreshUserClickStream2 = Rx.Observable.fromEvent(refreshNewUserButton2, 'click');
    let refreshUserClickStream3 = Rx.Observable.fromEvent(refreshNewUserButton3, 'click');

    // Create a stream of different github urls.
    let requestStream = mainRefreshStream
        .map((x) => {
            let randomOffset = Math.floor(Math.random() * 500);
            return 'https://api.github.com/users?since=' + randomOffset + '?client_id=1b0a479a222ccfa8918a&client_secret=585bf3095db791d495764f6bdb9b7a552f3e273b';
        });

    // A stream of json responses from the requested git url.
    let responseStream = requestStream.flatMap(x => {
        return Rx.Observable.fromPromise(getGitUsersAsJsonPromise(x));
    });

    let createSuggestionStream = (refreshStream) => {
        return refreshStream
            // Force the refresh stream to refresh on startup
            .startWith('')
            // Creates a stream from the refresh and response stream.
            // The callback function takes the last event from each stream, and runs a function on them. 
            // The result is a stream of events with the value returned from the function.
            .combineLatest(responseStream, (refreshEvent, responseEvent) => {
                    return responseEvent[Math.floor(Math.random() * responseEvent.length)];
            })
            // By mapping the events to null, we avoid rendering "undefined" in the view
            .merge(mainRefreshStream.map(() => { return null; }));
    }

    // Create a stream of suggested users.
    var suggestionStream1 = createSuggestionStream(refreshUserClickStream1);
    var suggestionStream2 = createSuggestionStream(refreshUserClickStream2);
    var suggestionStream3 = createSuggestionStream(refreshUserClickStream3);

    // Render the last suggested user.
    suggestionStream1.subscribe((suggestedUser) => {
        renderSuggestedGithubUser(suggestedUser, '.suggestion1');
    });

    suggestionStream2.subscribe((suggestedUser) => {
        renderSuggestedGithubUser(suggestedUser, '.suggestion2');
    });

    suggestionStream3.subscribe((suggestedUser) => {
        renderSuggestedGithubUser(suggestedUser, '.suggestion3');
    });
    
});