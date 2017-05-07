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
let responseStream = Rx.Observable.fromPromise(GetGitUsersAsJson);
responseStream.subscribe(x => {
    console.log("Result from responseStream: ");
    for (let key in x) {
        if (x.hasOwnProperty(key)) {
            let val = x[key];
            console.log(val.id);
        }
    }
});