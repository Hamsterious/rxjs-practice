// Static source
let addNumbersStaticSource = ['1','1','foo','2','3','5','bar','8','13']; 

let addNumbersStaticResult = addNumbersStaticSource
            .map(x => parseInt(x)) // Parse each string to a number
            .filter(x => !isNaN(x)) // Filter away items we couldn't parse
            .reduce((x,y) => x + y); // Add numbers together.

document.getElementById('add-number-static').innerHTML = addNumbersStaticResult.toString();