export const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
export const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"];

export const endOfToday = new Date(new Date().setHours(23,59,59));
export const startOfToday = new Date(new Date().setHours(0,0,0));
export const presentYearEnd = new Date(new Date().getFullYear(),11,31,23,59,59);
export const presentYearStart = new Date(new Date().getFullYear(),0,1);

export const stringify = {
    dateNumber(date = new Date(), model = "mm/dd/yyyy") {
        // dates come in many forms, but only some are valid
        const validModels = [
            'yyyy-mm-dd', 'yyyy-dd-mm', 'yy-dd-mm', 'yy-mm-dd',
            'mm-dd-yyyy', 'dd-mm-yyyy', 'mm-dd-yy', 'dd-mm-yy',
            'mm/dd/yyyy', 'dd/mm/yyyy', 'mm/dd/yy', 'dd/mm/yy',
            'mmddyyyy', 'ddmmyyyy', 'mmddyy', 'ddmmyy'
        ];
        // if the supplied date model is invalid, reset it
        if(!validModels.includes(model)) {
            console.groupCollapsed(`There was a problem creating the date string.`);
            console.error(`"${model}" is an invalid model parameter on getDateNumberString().`)
            console.info(`getDateNumberString() requires a model parameter matching one of the following:`);
            console.table(validModels);
            model = "mm/dd/yyyy";
            console.warn(`The model parameter defaulted "${model}".`);
            console.groupEnd();
        }
        // check that the date parameter is also valid
        // try coercing invalid parameters to dates first
        if(!date instanceof Date) date = new Date(date);
        // log the date parameter as-is if it cannot be coerced
        if(date == "Invalid Date") {
            console.groupCollapsed(`Could not create date string.`);
            console.error(`getNumberString() requires a valid date parameter.`);
            console.warn(`getNumberString() returned ${date}.`);
            console.groupEnd();
            return date;
        }
        // format the supplied date
        let year = new Date(date).getFullYear(),
            month = new Date(date).getMonth() + 1;
            date = new Date(date).getDate();
            // convert each to strings
            year = year.toString();
            month = month.toString();
            date = date.toString();
            // add leading zeros if applicable
            month = String(month).length === 1 ? "0" + month : month;
            date = String(date).length === 1 ? "0" + date : date;
        // test the model to determine the desired delimiter
        let delimiter = "";
        if(model.split("-").length > 1) delimiter = "-";
        if(model.split("/").length > 1) delimiter = "/";
        // shorten year if applicable
        if(model.length < 9) year = year.substring(2);
        // for testing character position, remove delimiters
        let strArray = model.split(delimiter), modelString = "";
        for(const str of strArray) modelString += str;
        // rearrange the string if the date or year leads
        let numberString = `${month}${delimiter}${date}${delimiter}${year}`;
        // date, month, year
        if(modelString.charAt(0) === "d") {
            numberString = `${date}${delimiter}${month}${delimiter}${year}`;
        }
        // year, month, date
        if(modelString.charAt(0) === "y" && modelString.charAt(year.length) === "m") {
            numberString = `${year}${delimiter}${month}${delimiter}${date}`;
        }
        // year, date, month
        if(modelString.charAt(0) === "y" && modelString.charAt(year.length) === "d") {
            numberString = `${year}${delimiter}${date}${delimiter}${month}`;
        }
        return numberString;
    },
    dateText(date = new Date(), abbreviated = false, leadingDay = true) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let day = dayNames[date.getDay()], month = monthNames[date.getMonth()], dd = date.getDate().toString(), year = date.getFullYear().toString();
            dd = dd.length < 2 ? `0${dd}` : dd; // format date
        if(abbreviated && leadingDay) return `${day.substring(0,3)} ${month.substring(0,3)} ${dd}, ${year}`;
        if(!(abbreviated) && leadingDay) return `${day} ${month} ${dd}, ${year}`;
        if(abbreviated && !(leadingDay)) return `${month.substring(0,3)} ${dd}, ${year}`;
        if(!(abbreviated) && !(leadingDay)) return `${month} ${dd}, ${year}`;
    }
}