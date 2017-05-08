import * as Rx from 'rxjs/Rx'; // Import RxJs

// A function returning a promise of a json object
// The promise makes an asynchronous XMLHttpRequest,
// The result from the request is parsed into a json object, and then resolved.
let GetGitUsersAsJsonPromise = function(url: string): Promise<{}> {
    let thePromise = new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    });
   
    return thePromise;
};

// A stream of refresh events
let refreshStream = Rx.Observable
    .fromEvent(document.getElementsByClassName('refresh-who-to-follow'), 'click')
    .startWith('startup'); // Starts the stream with an event that emits the value passed.

// A stream of different github urls.
let requestStream = refreshStream.map((x) => {
    let randomOffset = Math.floor(Math.random() * 500);
    return 'https://api.github.com/users?since=' + randomOffset;
});

// A stream of json responses from the requested git url.
let responseStream = requestStream.flatMap(x => {
    return Rx.Observable.fromPromise(GetGitUsersAsJsonPromise(x))
});

// Foreach result in the response stream, we render the result.
// Note x here is a json object with multiple json objects inside. 
// Each of these json objects describes data about a github user.
responseStream.subscribe(x => renderGitUsers(x));

// Loops through a json object of json objects.
// Each object represents a github user.
// The data gets turned into html, and then gets appended to the DOM.
let renderGitUsers = (x: {}) => {

    emptyIdContent('who-to-follow-result');

    // Render the users
    for (let index in x) {

        if (x.hasOwnProperty(index)) {
            let user = x[index];

            let e = document.createElement('div');
            e.innerHTML = `<img style="height:60px;"src="${user.avatar_url}" />`;
        
            document.getElementById('who-to-follow-result').appendChild(e.firstChild);
        }
    }
}

let emptyIdContent = (id: string) => {
    let node = document.getElementById(id);
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }
}
