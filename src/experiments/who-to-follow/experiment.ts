import * as Rx from 'rxjs/Rx'; // Import RxJs
import { getGitUsersAsJsonPromise, tryCatchLogErrors } from '../../helpers';

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
        return Rx.Observable.fromPromise(getGitUsersAsJsonPromise(x))
    });

    let createSuggestionStream = (refreshStream) => {
        return refreshStream.startWith('startup click')
            .combineLatest(responseStream,             
                function(click, listUsers) {
                    return listUsers[Math.floor(Math.random()*listUsers.length)];
                }
            )
            .merge(
                mainRefreshStream.map(function(){ 
                    return null;
                })
            )
            .startWith(null);
    }

    var suggestionStream1 = createSuggestionStream(refreshUserClickStream1);
    var suggestionStream2 = createSuggestionStream(refreshUserClickStream2);
    var suggestionStream3 = createSuggestionStream(refreshUserClickStream3);

    let renderSuggestion = (suggestedUser, selector) => {
        
            let suggestionNode = document.querySelector(selector);
            suggestionNode.innerHTML = "";
            
            if(suggestedUser === null) {
                suggestionNode.style.visibility = 'hidden';
            }
            else
            {
                suggestionNode.style.visibility = 'visible';
                let e = document.createElement('div');
                e.innerHTML = 
                `<div>
                    <img style="height:100px;"src="${suggestedUser.avatar_url}" />
                    <a href="${suggestedUser.html_url}">${suggestedUser.login}</a>
                </div>`;

                suggestionNode.appendChild(e.firstChild);
            }
    
    }

    suggestionStream1.subscribe((suggestedUser) => {
        renderSuggestion(suggestedUser, '.suggestion1');
    });

    suggestionStream2.subscribe((suggestedUser) => {
        renderSuggestion(suggestedUser, '.suggestion2');
    });

    suggestionStream3.subscribe((suggestedUser) => {
        renderSuggestion(suggestedUser, '.suggestion3');
    });
});

