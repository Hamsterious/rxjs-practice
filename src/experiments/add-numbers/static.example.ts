// Shows how static programming would add the numbers together below.
let sourceStatic = ['1','1','foo','2','3','5','bar','8','13'];

let resultStatic = sourceStatic
            .map(x => parseInt(x)) // Parse each string to a number
            .filter(x => !isNaN(x)) // Filter away items we couldn't parse
            .reduce((x,y) => x + y); // Add numbers together.

console.log("static output")
console.log(resultStatic);