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

function renderSuggestedGithubUser(suggestedUser, selector) {
    toggleVisibility(selector, "");
    
    if(suggestedUser === null) {
        toggleVisibility(selector, "none");
    }
    else
    {
        toggleVisibility(selector, "");
        let content = 
        `<img style="height:100px;"src="${suggestedUser.avatar_url}" />
         <a href="${suggestedUser.html_url}">${suggestedUser.login}</a>`;

       renderElement(selector, 0, content);
    }
}

let renderElement = (renderElementSelector: string, getNthParent, content: string ) => {

    // Target element to render input inside
    let targetElement;
    if(renderElementSelector.charAt(0) == '#') {
        renderElementSelector = renderElementSelector.replace('#','');
        targetElement = document.getElementById(renderElementSelector);
    } else {
        targetElement = document.querySelector(renderElementSelector);
    }

    // Get number of parents specified
    if(getNthParent != 0) {
        while(getNthParent != 0){
            let parentTarget = targetElement;
            targetElement = parentTarget.parentElement;
            getNthParent--;
        }
    }

    // Holder element for content
    let e = document.createElement('div');

    // Content for the element
    e.innerHTML = "<div>" + content + "</div>";

    // Render element
    targetElement.appendChild(e.firstChild);
}

let toggleVisibility = (selector:string, visibility: string) =>  {
    let targetElement;
    if(selector.charAt(0) == '#') {
        selector = selector.replace('#','');
        targetElement = document.getElementById(selector);
    } else {
        targetElement = document.querySelector(selector);
    }

    targetElement.style.display = visibility;
}

let attachEvent = (selector: string, event: string, callback: () => void) => {
    let targetElement;
    if(selector.charAt(0) == '#') {
        selector = selector.replace('#','');
        targetElement = document.getElementById(selector);
    } else {
        targetElement = document.querySelector(selector);
    }

    if(event == "click"){
        targetElement.onclick = () => {
            callback();
        }
    } else if (event == "keyup"){
        targetElement.onkeyup = () => {
            callback();
        }
    }
}

function swallowErrors(message, action) {
    try {
        action();
    } catch (e) { 
    }
}

export { 
    getGitUsersAsJsonPromise,
    swallowErrors,
    renderSuggestedGithubUser,
    renderElement,
    toggleVisibility,
    attachEvent
};