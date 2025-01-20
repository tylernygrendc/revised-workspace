import { getQueue, getRandomId } from "./_utilities.js";
import { coerce } from "./_type.js";
import "@material/web/divider/divider.js";
import "@material/web/icon/icon.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/progress/linear-progress.js";

export const breakpoints = {
    small: 600,
    medium: 960,
    large: 1280
}

export class Child {
    constructor(tag = ""){
        this.attributes = {};
        this.childList = [];
        this.classList = [];
        this.dataset = {};
        this.id = getRandomId();
        this.innerText = "";
        this.listeners = [];
        this.tag = tag ? tag : "div";
    }
    #create(){
        let child = document.createElement(this.tag);
            child.setAttribute("id", this.id);
            for(const [key, val] of Object.entries(this.attributes)) child.setAttribute(key, val);
            for(const string of this.classList) child.classList.add(string);
            for(const [key, val] of Object.entries(this.dataset)) child.dataset[key] = val;
            if(this.innerText) child.appendChild(document.createTextNode(this.innerText));
            return child;
    }
    appendTo(parent = getQueue()){
        try{
            let child = this.#create();
            if(parent instanceof Child) document.getElementById(parent.id).append(child);
            if(parent instanceof HTMLElement) parent.append(child);
            if(this.listeners.length > 0) for(const listener of this.listeners) child.addEventListener(listener.type, listener.callback);
            if(this.childList.length > 0) for(const descendant of this.childList) if(descendant instanceof Child) descendant.appendTo(child);
        } catch(error) {
            console.groupCollapsed("Could not append Child.");
            console.error(error);
            console.groupEnd();
        } finally {
            return this;
        }
    }
    exists(){
        return this.getNode(null) === null ? false : true;
    }
    getNode(fallback = null){
        let node = document.getElementById(this.id);
        return node instanceof HTMLElement ? node : fallback;
    }
    setAttribute(object = {}){
        this.attributes = {...this.attributes, ...coerce.object(object,{[object]:""})};
        return this;
    }
    setAriaLabel(ariaLabel = ""){
        this.attributes["aria-label"] = ariaLabel;
        return this;
    }
    setChildList(array = []){
        this.childList.push(...coerce.array(array,[array]));
        return this;
    }
    setClassList(array = []){
        this.classList.push(...coerce.array(array,[array]));
        return this;
    }
    setDataset(object = {}){
        this.dataset = {...this.dataset, ...coerce.object(object,{[object]:""})};
        return this;
    }
    setListener(event = "", callback = function(){}){
        this.listeners.push({type: event, callback: callback});
        return this;
    }
    setId(string = ""){
        this.id = string;
        return this;
    }
    setInnerText(string = ""){
        this.innerText = string;
        return this;
    }
}
export class Details extends Child{
    constructor(summary = "", summaryOpen = ""){
        super();
        this.tag = "details";
        this.childList = [
            new Child("summary")
                .setInnerText(summary)
                .setDataset({summary: summary, summaryOpen: summaryOpen})
                .setListener("click", function(){
                    if(this.parentElement.hasAttribute("open")) this.innerText = this.dataset.summary;
                    else this.innerText = this.dataset.summaryOpen;
                })
        ]
    }
}
export class Divider extends Child {
    constructor(inset = false){
        super();
        this.tag = "md-divider";
        if(inset) this.attributes.inset = true;
    }
}
export class Form extends Child {
    constructor(itemsArray=[]){
        super();
        this.tag = "form";
        this.childList = coerce.array(itemsArray, [itemsArray]);
    }
    getSelection(){
        return this.childList.reduce((acc, cv) => {
            if(cv instanceof Chipset || cv instanceof Select || cv instanceof Slider || cv instanceof Textfield)
                acc.push(cv.getSelection());
            return acc;
        },[]);
    }
}
export class Icon extends Child {
    constructor(name=""){
        super();
        this.tag = "md-icon";
        this.innerText = name;
    }
}
export class Img extends Child {
    constructor(src = "", alt = ""){
        super();
        this.tag = "img";
        this.attributes.src = src;
        // ! chrome extensions are different
        // this.attributes.src = chrome.runtime.getURL(src);
        // ! be sure to declare the resource in the manifest file
        // web_accessible_resources: [src]
        this.attributes.alt = alt;
    }
}
export class Link extends Child {
    constructor(href = "", openInNewWindow = false){
        super();
        this.tag = "a";
        this.attributes.href = href;
        if(openInNewWindow) this.attributes.target = "_blank";
    }
}
export class Picture extends Child {
    constructor(alt = "", small = "", medium = "", large = ""){
        super();
        this.tag = "picture";
        this.childList = [
            new Child("source").setAttribute({
                srcset: small, 
                media: `(max-width: ${breakpoints.small}px)`
            }),
            new Child("source").setAttribute({
                srcset: medium ? medium : small, 
                media: `(min-width: ${breakpoints.medium}px) and (max-width: ${breakpoints.large}px)`
            }),
            new Child("source").setAttribute({
                srcset: large ? large : medium ? medium : small,
                media: `(min-width: ${breakpoints.large}px)`
            }),
            new Img(large, alt)
        ]
    }
}
export class Progress extends Child {
    constructor(value = 0, linear = false, options = { buffer: 0, min: 0, max: 100 }){
        super();
        this.tag = linear ? "md-linear-progress" : "md-circular-progress";
        if(value) this.attributes.value = value;
        else this.attributes.indeterminate = true;
        if(options.min) this.attributes.min = options.min;
        if(options.max) this.attributes.max = options.max;
        if(options.buffer && linear) this.attributes.buffer = buffer;
    }
}
