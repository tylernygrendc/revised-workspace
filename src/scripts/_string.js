export function camelCase(string = "") {
    return string.split(/-|[A-Z]|_|\s/g).reduce((acc, cv, i) => {
        return i === 0 ? acc += cv : acc += `${cv.charAt(0).toUpperCase()}${cv.slice(1)}`;
    }, "");
}
export function capitalize(string = "", delimiter = " ") {
    return string.split(delimiter).reduce((acc, cv, i, initialArray) => {
        return i < initialArray.length - 1 ? 
            acc += `${cv.charAt(0).toUpperCase() + cv.slice(1)}${delimiter}`: 
            `${cv.charAt(0).toUpperCase() + cv.slice(1)}`;
    }, "");
}
export function kebabCase(string){
    return string.split(/[A-Z]|_|\s/g).reduce((acc, cv, i, initialArray) => {
        return i < initialArray.length - 1 ? acc += `${toLowerCase(cv)}-`: acc += toLowerCase(cv);
    }, "");
}
export function replaceDelimiter(string = "", splitDelimiter = " ", joinDelimiter = "-", toLowercase = true){
    if(toLowercase) string = string.toLowerCase();
    return string.split(splitDelimiter).reduce((acc, cv, i, initialArray) => { 
            return i < initialArray.length - 1 ? acc += `${cv}${joinDelimiter}`: acc += cv; 
        }, "" );
}
export function splice(string = "", start = 0, deleteCount = 0, item = "") {
    return [...string].splice(start, deleteCount, item).reduce((acc, cv) => {
        return acc += cv;
    }, "");
}