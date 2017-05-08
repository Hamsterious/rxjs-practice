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

// Loops through a json object of json objects.
// Each object represents a github user.
// The data gets turned into html, and then gets appended to the DOM.
let renderGitUsers = (x: {}, usersToList:number = 3) => {

    emptyIdContent('who-to-follow-result');

    // Render the users
    for (let index in x) {

        if (x.hasOwnProperty(index)) {
            
            let user = x[index];

            let e = document.createElement('div');
            e.innerHTML = 
            `<div style="margin-bottom:50px;">
                <h3><a href="${user.html_url}">${user.login}</a></h3>
                <img style="height:100px;"src="${user.avatar_url}" />
            </div>`;
        
            document.getElementById('who-to-follow-result').appendChild(e.firstChild);
        }

        if(--usersToList === 0) break;
    }
}

let emptyIdContent = (id: string) => {
    let node = document.getElementById(id);
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }
}

export { getGitUsersAsJsonPromise, renderGitUsers};