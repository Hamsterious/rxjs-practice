// A function returning a promise of a json object
// The promise makes an asynchronous XMLHttpRequest,
// The result from the request is parsed into a json object, and then resolved.
function getGitUsersAsJsonPromise(url: string): Promise<{}> {
    let thePromise = new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            } else if (this.status == 403) {
                console.log("Git API quota met. Please wait a bit before making requests again.");
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    });

    return thePromise;
};

// Creates an html node with data from the suggested git user, and appends the result to the DOM.
let renderSuggestedGithubUser = (suggestedUser, selector) => {
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

// Runs code in a try catch blog, and logs the custom message + the error message.
// Made to ensure different experiments don't break each other.
function tryCatchLogErrors(message, action) {
    try {
        action();
    } catch (e) { 
        console.log(message, e.message)
    }
}

// Export helper functions, so they can be imported elsewhere.
export { 
    getGitUsersAsJsonPromise,
    tryCatchLogErrors,
    renderSuggestedGithubUser
};