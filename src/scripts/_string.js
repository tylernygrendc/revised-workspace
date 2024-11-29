export function camelCase(string = "", delimiter = " ") {
    string = string.split(delimiter);
    if(string.length > 1) {
        return string.reduce((accumulator, currentValue, i) => {
            return i === 0 ? accumulator += currentValue : accumulator += `${currentValue.charAt(0).toUpperCase()}${currentValue.slice(1)}`;
        }, "");
    } else {
        return string.split(/(?=[A-Z])/).reduce((accumulator, currentValue, i, initialArray) => {
            return i < initialArray.length - 1 ? accumulator += `${toLowerCase(currentValue)}${delimiter}`: accumulator += toLowerCase(currentValue);
        }, "");
    }
}
export function capitalize(string = "", delimiter = " ") {
    return string.split(delimiter).reduce((accumulator, currentValue, i, initialArray) => {
        return i < initialArray.length - 1 ? 
            accumulator += `${currentValue.charAt(0).toUpperCase() + currentValue.slice(1)}${delimiter}`: 
            `${currentValue.charAt(0).toUpperCase() + currentValue.slice(1)}`;
    }, "");
}
export function replaceDelimiter(string = "", splitDelimiter = " ", joinDelimiter = "-", toLowercase = true){
    if(toLowercase) string = string.toLowerCase();
    return string.split(splitDelimiter).reduce((accumulator, currentValue, i, initialArray) => { 
            return i < initialArray.length - 1 ? accumulator += `${currentValue}${joinDelimiter}`: accumulator += currentValue; 
        }, "" );
}
export function splice(string = "", start = 0, deleteCount = 0, item = "") {
    return [...string].splice(start, deleteCount, item).reduce((accumulator, currentValue) => {
        return accumulator += currentValue;
    }, "");
}