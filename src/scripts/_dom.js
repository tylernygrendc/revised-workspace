import { getQueue, getRandomId } from "./_utilities.js";
import { coerce, is, not } from "./_type.js";
export class Child {
    constructor(tag = ""){
        this.tag = tag ? tag : "div";
        this.id = getRandomId();
        this.classList = [];
        this.attributes = {};
    }
    appendTo(parent = getQueue()){
        try{
            let child = this.#create();
            if(parent instanceof Child) document.querySelector(`#${parent.id}`).append(child);
            if(parent instanceof HTMLElement) parent.append(child);
            if(is.string(parent)) document.querySelector(`${string}`).append(child);
        } catch(error) {
            console.groupCollapsed(`Could not append ${this} to ${parent}.`);
            console.error(error);
            console.groupEnd();
        } finally {
            return this;
        }
    }
    #create(){
        let child;
        try {
            child = document.createElement(this.tag);
            child.id = this.id;
            for(const [key, val] of Object.entries(this.attributes)) child.setAttribute(key, val);
            for(const str of this.classList) child.classList.add(str);
            if(this.innerText){
                let text = document.createTextNode(this.innerText);
                child.appendChild(text);
            }
        } catch(error){
            child = document.createElement('div');
            console.groupCollapsed(`Could create element from ${this}.`);
            console.error(error);
            console.warn(`#create() returned an empty element instead:`, child);
            console.groupEnd();
        } finally {
            return child;
        }
    }
    exists(){
        return this.getNode() === null ? false : true;
    }
    #getAttributes(node){
        let attributes = {};
        const excluded = ["id", "class"];
        try{
            if(is.string(node)) node = document.querySelector(node);
            for(let i = 0; i < node.attributes.length; ++i){
                if(!excluded.includes(node.attributes.item(i).name)){
                    attributes[node.attributes.item(i).name] = node.attributes.item(i).value;
                }
            }
        } catch(error){
            attributes = {};
            console.groupCollapsed(`Could not get attributes of ${node}.`);
            console.error(error);
            console.warn(`getAttributes() returned an empty object instead.`);
            console.groupEnd();
        } finally {
            return attributes;
        }
    }
    getNode(fallback = null){
        let node;
        try{
            node = document.querySelector(`#${this.id}`);
        } catch (error) {
            node = fallback;
            console.groupCollapsed(`Could not get node with id ${this.id}.`);
            console.error(error);
            console.warn(`getNode() returned ${node} instead`);
            console.groupEnd();
        } finally {
            return node;
        }
    }
    objectify(node){
        try{
            this.setTag(node.tagName)
                .setId(node.id.length > 0 ? node.id : getRandomId())
                .setClassList(node.classList)
                .setAttribute(this.#getAttributes(node));
        } catch(error){
            console.groupCollapsed(`Could not coerce ${node} to object.`);
            console.error(error);
            console.warn(`objectify() returned ${this} instead:`);
            console.table(this);
            console.groupEnd();
        } finally {
            return this;
        }
    }
    setAttribute(object = {}){
        try{
            if(is.string(object)) Object.assign(this.attributes, { [object]: "" });
            if(is.object(object)) Object.assign(this.attributes, object);
            if(not.string(object) && not.object(object)){
                throw new Error(`Expected parameter type of object, but received ${ is.array(object) ? "array" : typeof object } instead.`);
            }
        } catch(error){
            console.groupCollapsed(`Could not set attribute on ${this} from ${object}.`);
            console.error(error);
            console.warn(`Attributes on ${this} were not changed.`);
            console.groupEnd();
        } finally {
            return this;
        }
    }
    setAriaLabel(ariaLabel=""){
        this.attributes["aria-label"] = ariaLabel;
        return this;
    }
    setClassList(array = []){
        try {
            if(is.array(array)){
                for(const str of array) this.classList.push(str);
            } else { this.classList.push(array.toString()); }
        } catch (error) {
            console.groupCollapsed(`Could not set classList on ${this} from ${array}.`);
            console.error(error);
            console.warn(`Classes on ${this} were not changed.`);
            console.groupEnd();
        } finally {
            return this;
        }
    }
    setId(str=""){
        this.id = str;
        return this;
    }
    setInnerText(str=""){
        this.innerText = str;
        return this;
    }
}
class Img extends Child {
    constructor(src = ""){
        super();
        this.tag = "img";
        this.attributes.src = src;
    }
    setAlt(text = ""){
        this.attributes.alt = text;
        return this;
    }
}
// input
export class Button extends Child {
    constructor(label="", variant="filled-tonal"){
        super();
        this.label = label;
        this.tag = [
                "elevated","filled","outlined","text"
            ].includes(variant) ? `md-${variant}-button` : "md-filled-tonal-button";
    }
    appendTo(parent = getQueue()){
        let button = new Child(this.tag)
            .setId(this.id)
            .setInnerText(this.label)
            .appendTo(parent);
        if(is.function(this.callback)) button.getNode().addEventListener("click",this.callback);
        return this;
    }
    setCallback(f=function(){}){
        this.callback = f;
        return this;
    }
    setDisabled(disabled = true){
        if(coerce.boolean(disabled, false)) this.attributes.disabled = true;
        else delete this.attributes.disabled;
        return this;
    }
    setIcon(name = "", isTrailingIcon = false){
        if(is.string(name)) this.icon = name;
        if(coerce.boolean(isTrailingIcon, false)) this.attributes["trailing-icon"] = "true";
        else delete this.attributes["trailing-icon"];
        return this;
    }
    setLink(href = "", openInNewWindow = false){
        Object.assign(this.attributes, {
            href: href, 
            target: openInNewWindow ? "_blank" : "_self"
        });
        return this;
    }
    setType(type = ""){
        if(["button, submit, reset"].includes(type)){
            this.attributes.type = type;
        } else {
            this.attributes.type = "button";
            console.groupCollapsed(`Could not set button type.`);
            console.error(`"${type}" is not a valid button type.`);
            console.warn(`setType() defaulted to ${this.attributes.type}.`);
            console.groupEnd();
        }
        return this;
    }
    setValue(string = "") {
        Object.assign(this.attributes, {
            type: "submit",
            value: coerce.string(string)
        });
        return this;
    }
    setVariant(variant = ""){
        if(["elevated", "filled", "filled-tonal", "outlined", "text"].includes(variant)){
            this.variant = variant;
        } else {
            console.groupCollapsed(`Could not set button variant.`);
            console.error(`"${variant}" is not a valid button variant.`);
            console.warn(`setVariant() defaulted to ${this.variant}.`);
            console.groupEnd();
        }
    }
}
export class Checkbox extends Child {
    constructor(label = "", category = ""){
        super();
        this.isStandalone = false;
        this.label = label;
    }
    appendTo(parent = getQueue()){
        if(!this.isStandalone){
            new Child("label")
                .setAttribute({"for": this.id})
                .setInnerText(this.label)
                .appendTo(parent);
        }
        new Child("md-checkbox")
            .setId(this.id)
            .setAttribute(this.attributes)
            .appendTo(parent);
        return this;
    }
    setChecked(checked = true) {
        if(checked) this.attributes.checked = true;
        else delete this.attributes.checked;
        return this;
    }
    setDisabled(disabled = true) {
        if(disabled) this.attributes.disabled = true;
        else delete this.attributes.disabled;
        return this;
    }
    setIndeterminate(indeterminate = true) {
        if(indeterminate) this.attributes.indeterminate = true;
        else delete this.attributes.indeterminate;
        return this;
    }
    setStandalone(standalone = true){
        this.standalone = standalone;
        return this;
    }
    setValueInCategory(value = this.id, category = ""){
        this.attributes.name = category ? group : value;
        this.attributes.value = category ? value : "on";
        return this;
    }
}
export class Radio extends Child {
    constructor(label = "", category = ""){
        super();
        this.isStandalone = false;
        this.label = label;
    }
    appendTo(parent = getQueue()){
        if(!this.isStandalone){
            new Child("label")
                .setAttribute({"for": this.id})
                .setInnerText(this.label)
                .appendTo(parent);
        }
        new Child("md-radio")
            .setId(this.id)
            .setAttribute(this.attributes)
            .appendTo(parent);
        return this;
    }
    setChecked(checked = true) {
        if(checked) this.attributes.checked = true;
        else delete this.attributes.checked;
        return this;
    }
    setDisabled(disabled = true) {
        if(disabled) this.attributes.disabled = true;
        else delete this.attributes.disabled;
        return this;
    }
    setStandalone(standalone = true){
        this.standalone = standalone;
        return this;
    }
    setValueInCategory(value = this.id, category = ""){
        this.attributes.name = category ? group : value;
        this.attributes.value = category ? value : "on";
        return this;
    }
}
export class Select extends Child {
    constructor(name = "", options = [], variant = "outlined"){
        super();
        this.name = name;
        this.options = options;
        this.tag = ["filled", "outlined"].includes(variant) ? `md-${variant}-select` : "md-outlined-select";
    }
    appendTo(parent = getQueue()){
        let select = new Child(this.tag)
            .setId(this.id)
            .setAttribute(this.attributes)
            .appendTo(parent);
        for(const option of this.options) {
            let selectOption = new Child("md-select-option")
                .setAttribute(this.attributes)
                .setClassList(this.classList)
                .appendTo(select);
            /* selectOptionText */ new Child("span")
                .setAttribute({slot: "headline"})
                .setInnerText(option)
                .appendTo(selectOption);
        }
        return this;
    }
    getSelection(){
        return this.getNode().value;
    }
    setAlignEnd(alignEnd = true){
        if(alignEnd) this.attributes["menu-align"] = "end";
        else delete this.attributes["menu-align"];
        return this;
    }
    setClampMenuWidth(clamp = true){
        if(clamp) this.attributes["clamp-menu-width"] = true;
        else delete this.attributes["clamp-menu-width"];
        return this;
    }
    setDisabled(disabled = true){
        if(disabled) this.attributes.disabled = true;
        else delete this.attributes.disabled;
        return this;
    }
    setLabel(label = ""){
        this.attributes.label = label;
        return this;
    }
    setRequired(required = true){
        if(required) this.attributes.required = "true";
        else delete this.attributes.required;
        return this;
    }
    setSupportingText(text = ""){
        this.attributes["supporting-text"] = text;
        return this;
    }
}
export class Slider extends Child {
    constructor(name = "", max = 100, min = 0, showLabel = false){
        super();
        this.name = name;
        this.attributes.max = max;
        this.attributes.min = min;
        if(showLabel) this.attributes.labeled = true;
    }
    appendTo(parent = getQueue()){
        new Child("md-slider")
            .setId(this.id)
            .setAttribute(this.attributes)
            .appendTo(parent);
        return this;
    }
    getSelection(){
        let slider = this.getNode();
        if(this.attributes.range) {
            return {
                type: "range",
                [this.name]: {
                    start: slider["value-start"],
                    end: slider["value-end"]
                }
            }; 
        } else {
            return {
                type: "slider",
                [this.name]: slider.value
            }
        }
    }
    setDisabled(disabled = true){
        if(disabled) this.attributes.disabled = true;
        else delete this.attributes.disabled;
        return this;
    }
    setDefault(value = 50){
        this.attributes.value = value;
        return this;
    }
    setRange(start = 0, end = 50){
        this.attributes.range = true;
        this.attributes["value-start"] = start;
        this.attributes["value-end"] = end;
    }
    setStepAmount(step = 5, showTicks = false){
        if(is.number(step)) this.attributes.step = step;
        if(showTicks) this.attributes.ticks = true;
        return this;
    }
}
export class Switch extends Child {
    constructor(label = "", category){
        super();
        this.isStandalone = false;
        this.label = label;
        this.attributes.name = label;
    }
    appendTo(parent = getQueue()){
        if(!this.isStandalone){
            new Child("label")
                .setAttribute({"for": this.id})
                .setInnerText(this.label)
                .appendTo(parent);
        }
        new Child("md-switch")
            .setId(this.id)
            .setAttribute(this.attributes)
            .appendTo(parent);
        return this;
    }
    setChecked(checked = true) {
        if(checked) this.attributes.selected = true;
        else delete this.attributes.selected;
        return this;
    }
    setDisabled(disabled = true) {
        if(disabled) this.attributes.disabled = true;
        else delete this.attributes.disabled;
        return this;
    }
    setIcon(showIcon = true){
        if(showIcon) this.attributes.icon = true;
        else delete this.attributes.icon;
        return this;
    }
    setStandalone(standalone = true){
        this.standalone = standalone;
        return this;
    }
    setValueInCategory(value = this.id, category = ""){
        this.attributes.name = category ? group : value;
        this.attributes.value = category ? value : "on";
        return this;
    }
}
export class Textfield extends Child {
    constructor(name = "", variant = "outlined"){
        super();
        this.name = name;
        this.externalLabel = false;
        this.tag = ["filled", "outlined"].includes(variant) ? `md-${variant}-text-field` : "md-outlined-text-field";
        this.attributes.name = name;
    }
    appendTo(parent = getQueue()){
        if(this.externalLabel){
            new Child("label")
                .setAttribute({for: this.id})
                .setInnerText(this.label)
                .appendTo(parent);
        }
        new Child(this.tag)
            .setId(this.id)
            .setAttribute(this.attributes)
            .setClassList(this.classList)
            .appendTo(parent);
        return this;
    }
    getSelection(){
        return this.getNode().value;
    }
    setAutocomplete(token = "on"){
        this.attributes.autocomplete = token;
        return this;
    }
    setDisabled(disabled = true){
        if(disabled) this.attributes.disabled = true;
        else delete this.attributes.disabled;
        return this;
    }
    setLabel(label = "", externalLabel = false){
        this.attributes.label = label;
        this.attributes.externalLabel = externalLabel;
        delete this.attributes.placeholder;
        return this;
    }
    setMaxLength(length = 128){
        this.attributes["maxlength"] = length;
        return this;
    }
    setMaxValue(number = 100){
        this.attributes.max = `${number}`;
        return this;
    }
    setMinLength(length = 12){
        this.attributes["minlength"] = length;
        return this;
    }
    setMinValue(number = 0) {
        this.attributes.min = `${number}`;
        return this;    
    }
    setNumberStep(step = 0.1){
        this.attributes.step = `${step}`;
        return this;
    }
    setPlaceholder(placeholder = ""){
        this.attributes.placeholder = placeholder;
        this.attributes.externalLabel = false;
        delete this.attributes.label;
        return this;
    }
    setReadOnly(readOnly = true){
        if(readOnly) this.attributes.readonly = true;
        else delete this.attributes.readonly;
        return this;
    }
    setRequired(required = true){
        if(required) this.attributes.required = "true";
        else delete this.attributes.required;
        return this;
    }
    setSupportingText(text = ""){
        this.attributes["supporting-text"] = text;
        return this;
    }
    setTextAreaRows(rows = 3){
        this.attributes.rows = rows;
        return this;
    }
    setType(type = "text"){
        if(["email", "number", "password", "tel", "text", "textarea", "search", "url"].includes(type)) this.attributes.type = type;
        return this;
    }
    setTextPrefix(text = ""){
        this.attributes["prefix-text"] = text;
        return this;
    }
    setTextSuffix(text = ""){
        this.attributes["suffix-text"] = text;
        return this;
    }
    setValidPattern(regex = ""){
        this.attributes.pattern = regex;
        return this;
    }
}

// state
export class Elevation extends Child{
    constructor(){
        super();
    }
}
export class Focus extends Child{
    constructor(){
        super();
    }
}
export class Ripple extends Child {
    constructor(){
        super();
    }
}

// components
export class Chip extends Child {
    constructor(label = ""){
        super();
        this.label = label;
    }
    appendTo(parent=getQueue()){
        if(parent instanceof Chipset || parent.tagName === "MD-CHIP-SET"){
            let chip = new Child(`md-${this.variant}-chip`)
                .setId(this.id)
                .setAttribute(this.attributes)
                .setClassList(this.classList)
                .setInnerText(this.label)
                .appendTo(parent)
                .getNode();
            if(is.string(this.avatar)){
                if(this.variant === "input"){
                    new Img(this.avatar)
                        .appendTo(chip);
                } else {
                    console.groupCollapsed("Avatar was not added to chip.");
                    console.error("Avatar icons can only be set on input chips.");
                    console.groupEnd();
                }
            }
            if(is.string(this.attributes.href)) this.icon = this.attributes.target === "_blank" ? "open_in_new" : "link";
            if(is.string(this.icon)){
                new Icon(this.icon).setAttribute({slot:"icon"}).appendTo(chip);
            }
            if(is.function(this.callback)){
                if(this.variant === "assist" || this.variant === "suggestion"){
                    chip.addEventListener("click", this.callback);
                } else {
                    console.groupCollapsed("Event listener was not added to chip.");
                    console.error("Callback functions can only be set on assist chips and suggestion chips.");
                    console.groupEnd();
                }
            }
        } else {
            console.groupCollapsed(`Could not build chip within parent.`);
            console.error(`The supplied parent element is invalid.`);
            console.warn(`Chips must be contained within a chipset.`);
            console.groupEnd();
        }
        return this;
    }
    setAvatar(src = ""){
        this.avatar = src;
        this.attributes.avatar = true;
        return this;
    }
    setCallback(f){
        this.callback = f;
        return this;
    }
    setDisabled(disabled = true, softDisabled = true){
        if(disabled) {
            this.attributes.disabled = true;
            if(softDisabled) this.attributes["always-focusable"] = true;
        } else {
            delete this.attributes.disabled;
            delete this.attributes["always-focusable"];
        }
        return this;
    }
    setElevated(elevated = true){
        if(elevated) this.attributes.elevated = true;
        else delete this.attributes.elevated;
        return this;
    }
    setIcon(name = ""){
        this.icon = name;
        return this;
    }
    setLink(href = "", openInNewWindow = false){
        this.variant = "assist";
        Object.assign(this.attributes, {
            href: coerce.string(href), 
            target: openInNewWindow ? "_blank" : "_self"
        });
        return this;
    }
    setRemovable(removable = true){
        if(removable) {
            this.attributes.removable = true;
        }
        else delete this.attributes.removable;
        return this;
    }
    setVariant(variant){
        if(["assist","input","filter","suggestion"].includes(variant)){
            this.variant = variant;
        } else {
            console.groupCollapsed(`Could not set chip variant.`);
            console.error(`"${variant}" is not a valid chip variant.`);
            console.warn(`Variant attribute was defaulted to "${this.variant}".`)
            console.groupEnd();
        }
        return this;
    }
}
export class Chipset extends Child {
    constructor(chips = []){
        super();
        this.chips = chips;
    }
    appendTo(parent = getQueue()){
        let chipset = new Child(`md-chip-set`)
            .setId(this.id)
            .setAttribute(this.attributes)
            .setClassList(this.classList)
            .appendTo(parent)
            .getNode();
        for(const chip of this.chips) {
            if(is.string(chip)) {
                if(is.function(this.callback)){
                    new Chip(chip)
                        .setVariant("suggestion")
                        .setCallback(this.callback)
                        .appendTo(chipset);
                } else {
                    new Chip(chip)
                        .setVariant("filter")
                        .appendTo(chipset);
                }
            } 
            if(chip instanceof Chip) {
                if(is.function(chip.callback) || is.string(chip.attributes.href)){
                    chip.setVariant("assist")
                        .appendTo(chipset);
                } else {
                    chip.setVariant("input")
                        .appendTo(chipset);
                }
            }
        }
        return this;
    }
    getSelection(){
        return this.getNode().querySelectorAll("md-filter-chip[selected],md-input-chip")
            .reduce((acc, cv) => {
                acc.push(cv.innerText);
                return acc;
            },[]);
    }
    setCallback(f=function(){}){
        this.callback = f;
        return this;
    }
}
export class Card extends Child {
    constructor(){
        super();
    }
}
export class Carousel extends Child {
    constructor(){
        super();
    }    
}
export class Container extends Child {
    constructor(){
        super();
    }
}
export class Datepicker extends Child {
    constructor(){
        super();
    }
}
export class Details extends Child{
    constructor(summaryClosed = "", summaryOpen = ""){
        super();
        this.summaryClosed = summaryClosed;
        this.summaryOpen = summaryOpen;
    }
    appendTo(parent = _.getQueue()){
        let details = new Child("details")
            .setId(this.id)
            .setAttribute(this.attributes)
            .setClassList(this.classList)
            .appendTo(parent);
        let summary = new Child("summary")
            .setInnerText(this.summaryClosed)
            .appendTo(details)
            .getNode();
        if(this.summaryOpen){
            summary.dataset.summaryClosed = this.summaryClosed;
            summary.dataset.summaryOpen = this.summaryOpen;
            summary.addEventListener("click", function () {
                if(this.parentElement.hasAttribute("open")) this.innerText = this.dataset.summaryClosed;
                else this.innerText = this.dataset.summaryOpen;
            });
        }
        return this;
    }
}
export class Dialog extends Child {
    constructor(headline = "", content = [], actions = [], removeOnSubmit=false){
        super();
        this.actions = coerce.array(actions, [actions]);
        this.content = coerce.array(content, [content]);
        this.headline = headline;
        this.open = true;
        this.removeOnSubmit = removeOnSubmit;
    }
    appendTo(parent = document.body){
        let dialog = new Child("md-dialog")
            .setId(this.id)
            .setAttribute({open:this.open})
            .setClassList(this.classList)
            .appendTo(parent);
        if(is.function(this.callback) && this.removeOnSubmit){
            dialog.getNode().addEventListener("close",function(){})
        } else if(this.removeOnSubmit) { 
            dialog.getNode().addEventListener("close",function(){this.remove()});
        }
        if(this.icon) new Icon(this.icon).appendTo(dialog);
        new Child()
            .setAttribute({slot: "headline"})
            .setInnerText(this.headline)
            .appendTo(dialog);
        new Form(
            this.content.reduce((accumulator, currentValue) => {
                if(currentValue instanceof Child) accumulator.push(currentValue);
                if(is.string(currentValue)) accumulator.push(new Child().setInnerText(currentValue));
                return accumulator;
            },[])
        ).setAttribute({slot:"content",method:"dialog"}).appendTo(dialog);
        let dialogActions = new Child().setAttribute({slot:"actions"}).appendTo(dialog);
        for(const action of this.actions){
            if(action instanceof Button) action.setAttribute({form:this.id}).appendTo(dialogActions);
            if(is.string(action)){
                if(["ask me later","cancel","close","decline","maybe later","no","no, thanks","remind me later"].includes(action)){
                    new Button(action,"text").setAttribute({form:this.id,value:action}).appendTo(dialogActions);
                }
                if(["accept","acknowledge","agree","confirm","I understand","ok","okay","yes","yes, please"].includes(action)){
                    new Button(action,"text").setAttribute({form:this.id,value:action,autofocus:"true"}).appendTo(dialogActions);
                }
            }
        }
        return this;
    }
    getValue(remove=true){
        let dialog, value;
        try{
            dialog = this.getNode();
            value = dialog.returnValue;
        } catch (error) {
            value = "";
            console.groupCollapsed(`Could not get dialog return value.`);
            console.error(error);
            console.warn(`getValue() returned ${value} instead.`);
            console.groupEnd();
        } finally{
            if(remove) dialog.remove();
            return value;
        }
    }
    setCallback(f=function(){}){
        this.callback = f;
        return this;
    }
    setIcon(name = ""){
        this.icon = name;
        return this;
    }
    setOpen(open=true){
        this.open = open;
        if(this.exists()) {
            if(open) this.getNode().setAttribute("open","true");
            else this.getNode().removeAttribute("open")
        }
        return this;
    }
}
export class Divider extends Child {
    constructor(inset=false){
        super();
        this.inset=inset;
    }
    appendTo(parent = getQueue()){
        if(is.boolean(this.inset)){
            if(this.inset) this.attributes.inset = true;
            else delete this.attributes.inset;
        } else if(is.string(this.inset) && ["inset-start","inset-end"].includes(this.inset)){
            this.attributes[this.inset]=true;
        }
        new Child("md-divider")
            .setId(this.id)
            .setAttribute(this.attributes)
            .appendTo(parent);
        return this;
    }
}
export class Fab extends Child {
    constructor(icon="",label="",size="normal"){
        super();
        this.icon = icon;
        if(label) this.attributes.label = label;
        if(["small","large"].includes(size)) this.attributes.size = size;
    }
    appendTo(parent=getQueue()){
        let fab = new Child("md-fab")
            .setId(this.id)
            .setAttribute(this.attributes)
            .appendTo(parent);
        new Icon(this.icon)
            .setAttribute({slot:"icon"})
            .appendTo(fab);
        return this;
    }
    setColor(color="primary"){
        if(["primary","secondary","tertiary"].includes(color)) this.attributes.variant = color;
        else delete this.attributes.variant;
        return this;
    }
}
export class Form extends Child {
    constructor(fields=[]){
        super();
        this.fields = fields;
    }
    appendTo(parent=getQueue()){
        let form = new Child("form")
            .setId(this.id)
            .setAttribute(this.attributes)
            .setClassList(this.classList)
            .appendTo(parent);
        for(const field of this.fields) if(field instanceof Child) field.appendTo(form);
        return this;
    }
    getData(){
        return this.data = this.fields.reduce((accumulator, cv) => {
            if(cv instanceof Chipset || cv instanceof Select || cv instanceof Slider || cv instanceof Textfield)
                accumulator.push(cv.getSelection());
            return accumulator;
        },[]);
    }
}
export class Icon extends Child {
    constructor(name="grid_guides"){
        super();
        this.tag = "md-icon";
        this.innerText = name;
    }
}
export class Li extends Child {
    constructor(headline="", supportingText=""){
        super();
        this.headline = headline;
        this.supportingText = supportingText;
    }
    appendTo(parent = getQueue()){
        let li = new Child('md-list-item')
            .setId(this.id)
            .setAttribute(this.attributes);
        if(this.supportingText){
            li.appendTo(parent);
            new Child("div")
                .setAttribute({slot:"headline"})
                .setInnerText(this.headline)
                .appendTo(li);
            new Child("div")
                .setAttribute({slot:"supporting-text"})
                .setInnerText(this.supportingText)
                .appendTo(li);
        } else { li.setInnerText(this.headline).appendTo(parent); }
        if(this.start) this.start.appendTo(li);
        if(this.end) this.end.appendTo(li);
        if(this.callback) li.addEventListener("click",this.callback);
    }
    setCallback(f=function(){},icon="code"){
        delete this.attributes.href;
        delete this.attributes.target;
        this.callback = f;
        this.attributes.type = "button";
        this.end = new Icon(icon);
        return this;
    }
    setIcon(name="", ){
        this.start = new Icon(name)
            .setAttribute({slot:"start"});
        return this;
    }
    setImage(src=""){
        this.start = new Img(src)
            .setAlt(`image for ${this.headline}`)
            .setAttribute({slot:"start",style:"width:56px;"});
        return this;
    }
    setLink(href="", openInNewWindow = true){
        delete this.callback;
        Object.assign(this.attributes, {
            type: "link",
            href: href, 
            target: openInNewWindow ? "_blank" : "_self"
        });
        this.end = new Icon(openInNewWindow ? "open_in_new" : "link");
        return this;
    }
}
export class List extends Child {
    constructor(items=[],useDividers=true){
        super();
        this.items = items;
        this.useDividers = useDividers;
    }
    appendTo(parent = getQueue()){
        let list = new Child('md-list')
            .setId(this.id)
            .setAttribute(this.attributes)
            .setClassList(this.classList)
            .appendTo(parent), i=0;
        for(const item of this.items){
            if(item instanceof Li) item.appendTo(list);
            if(this.useDividers && ++i < this.items.length) new Divider().appendTo(list);
        }
        return this;
    }
}
export class Mi extends Child {
    constructor(headline=""){
        super();
        this.headline=headline;
    }
    appendTo(parent = getQueue()){
        let menuItem = new Child('md-menu-item')
            .setId(this.id)
            .setAttribute(this.attributes)
            .appendTo(parent);
        new Child()
            .setAttribute({slot:"headline"})
            .setInnerText(headline)
            .appendTo(menuItem);
        if(this.icon) new Icon(this.icon).setAttribute({slot:"end"}).appendTo(menuItem);
        if(this.callback) menuItem.getNode().addEventListener("click",this.callback);
    }
    setCallback(f=function(){}){
        this.callback = f;
        return this;
    }
    setDisabled(disabled=true){
        if(disabled) this.attributes.disabled = true;
        else delete this.attributes.disabled;
        return this;
    }
    setLink(href="",openInNewWindow=false){
        this.icon = openInNewWindow ? "open_in_new" : "link";
        this.attributes.href = href;
        this.attributes.target = openInNewWindow ? "_blank" : "_self";
        return this;
    }
}
export class Menu extends Child {
    constructor(label="",anchor="",items=[]){
        super();
        this.items = items;
        this.label = label;
        this.attributes.anchor = anchor;
    }
    appendTo(parent = getQueue()){
        try{
            let menu, anchor = document.querySelector(`#${this.attributes.anchor}`);
            if(!this.attributes.anchor || anchor === null){
                throw new Error(`${this.attributes.anchor} is not a valid anchor.`);
            } else {
                menu = new Child('md-menu')
                    .setId(this.id)
                    .setAttribute(this.attributes)
                    .setClassList(this.classList)
                    .appendTo(parent);
                if(window.getComputedStyle(anchor).getPropertyValue("position") != "relative"){
                    anchor.style.position = "relative";
                    console.groupCollapsed(`<${anchor.tagName} id=${anchor.id}> was automatically assigned "style=position:relative;".`);
                    console.error("Menu parent must have relative positioning.")
                    console.warn(`Automatic position assignment may have unintended consequences. Explicitly define position on <${anchor.tagName} id=${anchor.id}> to avoid style errors.`);
                    console.groupEnd();
                }
            }
            for(const item of this.items){
                if(item instanceof Mi) item.appendTo();
                if(item instanceof Menu) {
                    this.getNode()["has-overflow"] = "true";
                    let submenu = new Child("md-sub-menu")
                        .appendTo(menu);
                    let submenuLabel = new Child("md-menu-item")
                        .setAttribute({slot:"item"})
                        .appendTo(submenu);
                    new Child()
                        .setInnerText(item.label ? item.label : "submenu")
                        .setAttribute({slot:"headline"})
                        .appendTo(submenuLabel);
                    new Icon("arrow_right")
                        .setAttribute({slot:"end"})
                        .appendTo(submenuLabel);
                    item.setAttribute({slot:"menu"})
                        .appendTo(menu);
                }
            }
        } catch (error) {
            console.groupCollapsed("Could not create <md-menu>.");
            console.error(error);
            console.warn(`appendTo() returned ${this}.`)
            console.groupEnd();
        } finally {
            return this;
        }
    }
}
export class Navigation extends Child {
    constructor(){
        super();
    }
}
export class Picture extends Child {
    constructor(){
        super();
    }
}
export class Progress extends Child {
    constructor(value=0,linear=false,buffer=0){
        super();
        this.tag = linear ? "md-linear-progress" : "md-circular-progress";
        this.attributes.max = 100;
        if(value) this.attributes.value = value;
        else this.attributes.indeterminate = true;
        if(buffer && !linear) this.attributes.buffer = buffer;
    }
}
export class Search extends Child {
    constructor(){
        super();
    }
}
export class Sheet extends Child {
    constructor(){
        super();
    }
}
export class Snackbar extends Child {
    constructor(){
        super();
    }
}
export class Tabs extends Child {
    constructor(){
        super();
    }
}
export class Timepicker extends Child {
    constructor(){
        super();
    }
}


