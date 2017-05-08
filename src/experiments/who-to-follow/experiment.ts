import * as Rx from 'rxjs/Rx'; // Import RxJs
import { getGitUsersAsJsonPromise, renderGitUsers } from './who-to-follow-helpers';

// Get DOM elements we want to create streams from
let refreshButton = document.querySelector('.refresh');
let refreshNewUserButton1 = document.querySelector('.refreshNewUser1');
let refreshNewUserButton2 = document.querySelector('.refreshNewUser2');
let refreshNewUserButton3 = document.querySelector('.refreshNewUser3');

// Create event streams from each DOM element. In this case, events are emitted from DOM events.
let mainRefreshStream = Rx.Observable.fromEvent(refreshButton, 'click');
let refreshUserClickStream1 = Rx.Observable.fromEvent(refreshNewUserButton1, 'click');
let refreshUserClickStream2 = Rx.Observable.fromEvent(refreshNewUserButton2, 'click');
let refreshUserClickStream3 = Rx.Observable.fromEvent(refreshNewUserButton3, 'click');

// Create a stream of different github urls.
let requestStream = mainRefreshStream
    .startWith('startup click')
    .map((x) => {
        let randomOffset = Math.floor(Math.random() * 500);
        return 'https://api.github.com/users?since=' + randomOffset + '?client_id=1b0a479a222ccfa8918a&client_secret=585bf3095db791d495764f6bdb9b7a552f3e273b';
    });

// A stream of json responses from the requested git url.
let responseStream = requestStream.flatMap(x => {
    return Rx.Observable.fromPromise(getGitUsersAsJsonPromise(x))
});

let createSuggestionStream = (refreshStream) => {
    return responseStream
    .map((x: any) => {
        return x[Math.floor(Math.random() * x.length)]
    })
    .merge(mainRefreshStream.map(() => { return null; }));
}

var suggestionStream1 = createSuggestionStream(refreshUserClickStream1);
var suggestionStream2 = createSuggestionStream(refreshUserClickStream2);
var suggestionStream3 = createSuggestionStream(refreshUserClickStream3);

let renderSuggestion = (suggestedUser, selector) => {
    console.log(suggestedUser, selector);
    let suggestionNode = document.querySelector(selector);
    
    if(suggestedUser === null) {
        let e = document.createElement('span');
        e.innerHTML = "Nothing yet...";
        suggestionNode.appendChild(e);
    }
    else
    {

        let e = document.createElement('div');
        e.innerHTML = 
        `<div style="margin-bottom:50px;">
            <h3><a href="${suggestedUser.html_url}">${suggestedUser.login}</a></h3>
            <img style="height:100px;"src="${suggestedUser.avatar_url}" />
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



// Foreach result in the response stream, we render the result.
// Note x here is a json object with multiple json objects inside. 
// Each of these json objects describes data about a github user.
responseStream.subscribe(x => renderGitUsers(x));