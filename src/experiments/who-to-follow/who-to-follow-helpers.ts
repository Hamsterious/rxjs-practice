// A function returning a promise of a json object
// The promise makes an asynchronous XMLHttpRequest,
// The result from the request is parsed into a json object, and then resolved.
let getGitUsersAsJsonPromise = function(url: string): Promise<{}> {
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

export { getGitUsersAsJsonPromise };