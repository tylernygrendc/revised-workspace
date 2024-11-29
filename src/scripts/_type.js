export const coerce = {
    array: (array, fallback = []) => {
        try{ 
            if(is.array(array)) return array;
            else throw new Error(`Expected an array but received ${typeof array} instead.`);
        } catch (error) { 
            console.groupCollapsed(`Parameter is not an array.`);
            console.warn(error);
            console.info(`array() returned ${fallback} instead.`)
            console.table(fallback);
            console.groupEnd();
            return fallback;
        }
    },
    boolean: (boolean, fallback = false) => {
        try{
            if(is.boolean(boolean)) return boolean;
            else throw new Error(`Expected type of "boolean" but received type of "${typeof boolean}" instead.`);
        } catch (error) {
            console.groupCollapsed(`Parameter is not a type of boolean.`);
            console.warn(error);
            console.info(`boolean() returned ${fallback} instead.`);
            console.groupEnd();
            return fallback; 
        }
    },
    number: (number, fallback = 0) => {
        try{ 
            if(is.number(number)) return number;
            else throw new Error(`Expected type of "number" but received type of "${typeof number}" instead.`);
        } catch (error) { 
            console.groupCollapsed(`Parameter is not a type of number.`);
            console.warn(error);
            console.info(`number() returned ${fallback} instead.`);
            console.groupEnd();
            return fallback; 
        }
    },
    object: (object, fallback = {}) => {
        try{ 
            if(is.object(object)) return object;
            else throw new Error(`Expected type of "object" but received type of "${typeof object}" instead.`);
        } catch (error) { 
            console.groupCollapsed(`Parameter is not a type of object.`);
            console.warn(error);
            console.info(`object() returned ${fallback} instead.`);
            console.table(fallback);
            console.groupEnd();
            return fallback; 
        }
    },
    string: (string, fallback = "") => {
        try{ 
            if(is.string(string)) return string;
            else throw new Error(`Expected type of "string" but received type of "${typeof string}" instead.`);
        } catch (error) {
            console.groupCollapsed(`Parameter is not a type of string.`);
            console.warn(error);
            console.info(`string() returned "${fallback}" instead.`)
            console.groupEnd();
            return fallback; 
        }
    }
}
export const is = {
    array: (thing) => {
        if(Array.isArray(thing)) return true;
        else return false;
    },
    boolean: (thing) => {
        if(typeof thing === "boolean") return true;
        else return false;
    },
    defined: (thing) => {
        if(thing != null && thing != undefined) return true;
        else return false;
    },
    function: (thing) => {
        if(typeof thing === "function") return true;
        else return false;
    },
    null: (thing) => {
        if(thing === null) return true;
        else return false;
    },
    number: (thing) => {
        if(typeof thing === "number") return true;
        else return false;
    },
    object: (thing) => {
        if(typeof thing === "object" && !Array.isArray(thing) && thing != null) return true;
        else return false;
    },
    string: (thing) => {
        if(typeof thing === "string") return true;
        else return false;
    },
    undefined: (thing) => {
        if(thing === undefined) return true;
        else return false;
    }
}
export const not = {
    array: (thing) => {
        if(Array.isArray(thing)) return false;
        else return true;
    },
    boolean: (thing) => {
        if(typeof thing === "boolean") return false;
        else return true;
    },
    defined: (thing) => {
        if(thing != null && thing != undefined) return false;
        else return true;
    },
    function: (thing) => {
        if(typeof thing === "function") return false;
        else return true;
    },
    null: (thing) => {
        if(thing === null) return false;
        else return true;
    },
    number: (thing) => {
        if(typeof thing === "number") return false;
        else return true;
    },
    object: (thing) => {
        if(typeof thing === "object" && !Array.isArray(thing) && thing != null) return false;
        else return true;
    },
    string: (thing) => {
        if(typeof thing === "string") return false;
        else return true;
    },
    undefined: (thing) => {
        if(thing === undefined) return false;
        else return true;
    }
}