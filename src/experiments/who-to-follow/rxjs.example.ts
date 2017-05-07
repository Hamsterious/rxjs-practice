import * as Rx from 'rxjs/Rx'; // Import RxJs

let GetGitUsersAsJson = new Promise((resolve, reject) => {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           resolve(JSON.parse(this.responseText));
        }
    };

    xmlhttp.open("GET", 'https://api.github.com/users', true);
    xmlhttp.send();
});

// REQUEST
let refreshStream = Rx.Observable
                    .fromEvent(document.getElementsByTagName('h1'), 'click').startWith('startup'); // Starts the stream with an event that emits the value passed.

let requestStream = refreshStream.map((x) => {
    console.log(x);
    let randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
});

requestStream.subscribe(x => {
    console.log("Result from requestStream: ");
    console.log(x)
});

// RESPONSE
let responseStream = Rx.Observable.fromPromise(GetGitUsersAsJson); // Creates a stream from the promise resolved value. In this case, this results in a stream with one event. The value emitted is json object with the users.

responseStream.subscribe(x => {
    console.log("Result from responseStream: ");
    for (let index in x) {
        if (x.hasOwnProperty(index)) {
            let user = x[index];
            console.log(user);
            var e = document.createElement('div');
            e.innerHTML = `<img style="height:60px;"src="${user.avatar_url}" />`;
            document.getElementById('who-to-follow-result').appendChild(e.firstChild);
        }
    }
});