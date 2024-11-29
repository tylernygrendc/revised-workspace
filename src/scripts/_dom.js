import { getQueue, getRandomId } from "./_utilities.js";
import { coerce, is, not } from "./_type.js";
export class Child {
    constructor(tag = "div"){
        this.tag = coerce.string(tag, "div");
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
            console.info(`appendTo() returned:`);
            console.table(this);
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
            for(const str of this.classList) child.classList.add(str);
            for(const [key, val] of Object.entries(this.attributes)) {
                if(this.tag === "img" && key === "src" ) child.src = chrome.runtime.getURL(val);
                else child.setAttribute(key, val);
            }
            if(is.string(this.innerText)){
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
            console.info(`setAttribute() returned ${this}:`)
            console.table(this.attributes);
            console.groupEnd();
        } finally {
            return this;
        }
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
            console.info(`setClassList() returned ${this}:`)
            console.table(this.classList);
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
        this.variant = [
                "elevated","filled","filled-tonal","outlined","text"
            ].includes(variant) ? variant : "filled-tonal";
    }
    buildWithin(parent = getQueue()){
        new Child(`md-${this.variant}-button`)
            .setId(this.id)
            .setInnerText(this.label)
            .appendTo(parent);
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
            href: coerce.string(href), 
            target: openInNewWindow ? "_blank" : "_self"
        });
        return this;
    }
    setType(type = ""){
        const validTypes = ["button, submit, reset"]
        if(validTypes.includes(type)){
            this.attributes.type = type;
        } else {
            this.attributes.type = "button";
            console.groupCollapsed(`Could not set button type.`);
            console.error(`"${type}" is not a valid button type.`);
            console.warn(`setType() defaulted to ${this.attributes.type}.`);
            console.info("Valid parameters are:");
            console.table(validTypes);
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
        const validVariants = ["elevated", "filled", "filled-tonal", "outlined", "text"];
        if(validVariants.includes(variant)){
            this.variant = variant;
        } else {
            console.groupCollapsed(`Could not set button variant.`);
            console.error(`"${variant}" is not a valid button variant.`);
            console.warn(`setVariant() defaulted to ${this.variant}.`);
            console.info("Valid parameters are:");
            console.table(validVariants);
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
    buildWithin(parent = getQueue()){
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
    setAriaLabel(ariaLabel = ""){
        this.attributes["aria-label"] = ariaLabel;
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
    buildWithin(parent = getQueue()){
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
    setAriaLabel(ariaLabel = ""){
        this.attributes["aria-label"] = ariaLabel;
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
        this.options = options;
        this.variant = ["filled", "outlined"].includes(variant) ? variant : "outlined";
        this.attributes = {
            name: name
        };
    }
    buildWithin(parent = getQueue()){
        let select = new Child(`md-${this.variant}-select`)
        for(const option of this.options) {
            let selectOption = new Child(`md-select-option`)
                .setId(this.id)
                .setAttribute(this.attributes)
                .setClassList(this.classList)
                .appendTo(select);
            /* selectOptionText */ new Child("span")
                .setInnerText(option)
                .appendTo(selectOption);
        }
        return this;
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
    setVariant(variant = "filled"){
        const validVariants = ["filled", "outlined"];
        if(validVariants.includes(variant)){
            this.variant = variant;
        } else {
            console.groupCollapsed(`Could not set select variant.`);
            console.error(`"${variant}" is not a valid select variant.`);
            console.warn(`setVariant() defaulted to ${this.variant}.`);
            console.info("Valid parameters are:");
            console.table(validVariants);
            console.groupEnd();
        }
        return this;
    }
}
export class Slider extends Child {
    constructor(max = 100, min = 0, showLabel = false){
        super();
        this.attributes = {
            max: max,
            min: min,
        }
        if(showLabel) this.attributes.labeled = true;
    }
    buildWithin(parent = getQueue()){
        new Child(`md-slider`)
            .setId(this.id)
            .setAttribute(this.attributes)
            .setClassList(this.classList);
        return this;
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
    buildWithin(parent = getQueue()){
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
    setAriaLabel(ariaLabel = ""){
        this.attributes["aria-label"] = ariaLabel;
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
        this.variant = ["filled", "outlined"].includes(variant) ? variant : "outlined";
        this.attributes = {
            name: label
        };
    }
    buildWithin(parent = getQueue()){
        if(this.externalLabel){
            new Child("label")
                .setAttribute({for: this.id})
                .setInnerText(this.label)
                .appendTo(parent);
        }
        new Child(`md-${this.variant}-text-field`)
            .setId(this.id)
            .setAttribute(this.attributes)
            .setClassList(this.classList)
            .appendTo(parent);
        return this;
    }
    setAriaLabel(ariaLabel = ""){
        this.attributes["aria-label"] = ariaLabel;
        return this;
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
    setVariant(variant = "filled"){
        const validVariants = ["filled", "outlined"];
        if(validVariants.includes(variant)){
            this.variant = variant;
        } else {
            console.groupCollapsed(`Could not set select variant.`);
            console.error(`"${variant}" is not a valid select variant.`);
            console.warn(`setVariant() defaulted to ${this.variant}.`);
            console.info("Valid parameters are:");
            console.table(validVariants);
            console.groupEnd();
        }
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
    buildWithin(parent){
        if(parent.tagName === "md-chip-set" || parent.tag === "md-chip-set"){
            let chip = new Child(`md-${this.variant}-chip`)
                .setId(this.id)
                .setAttribute(this.attributes)
                .setClassList(this.classList)
                .setInnerText(this.label)
                .appendTo(parent);
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
            if(is.string(this.icon)){
                new Child("md-icon")
                    .setInnerText(this.icon)
                    .appendTo(chip);
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
    setAriaLabel(ariaLabel = ""){
        this.attributes["aria-label"] = ariaLabel;
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
    setIcon(icon = ""){
        this.icon = icon;
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
        const validVariants = ["assist","input","filter","suggestion"];
        if(validVariants.includes(variant)){
            this.variant = variant;
        } else {
            console.groupCollapsed(`Could not set chip variant.`);
            console.error(`"${variant}" is not a valid chip variant.`);
            console.warn(`Variant attribute was defaulted to "${this.variant}".`)
            console.info(`Valid chip variants are:`);
            console.table(validVariants);
            console.groupEnd();
        }
    }
}
export class Chipset extends Child {
    constructor(chips = []){
        super();
        this.chips = chips;
    }
    buildWithin(parent = getQueue()){
        let chipset = new Child(`md-chip-set`)
            .setId(this.id)
            .setAttribute(this.attributes)
            .setClassList(this.classList)
            .appendTo(parent);

        if(this.chips.length){
            for(const chip of this.chips) {
                if(is.string(chip)) {
                    if(is.function(this.callback)){
                        new Chip(chip)
                            .setVariant("suggestion")
                            .setCallback(this.callback)
                            .buildWithin(chipset);
                    } else {
                        new Chip(chip)
                            .setVariant("filter")
                            .buildWithin(chipset);
                    }
                } 
                if(chip instanceof Chip) {
                    if(is.function(chip.callback) || is.string(chip.attributes.href)){
                        chip.setVariant("assist")
                            .buildWithin(chipset);
                    } else {
                        chip.buildWithin(chipset); // defaults to <md-chip-input>
                    }
                }
            }
        }
        return this;
    }
    getValues(onlySelectedChips = false){
        try{
            if(onlySelectedChips){
                return this.getNode().querySelectorAll("md-filter-chip[selected]").reduce((acc, cv, i) => {
                    acc[i] = cv.innerText;
                    return acc;
                }, []);
            } else {
                return this.getNode().querySelectorAll("md-filter-chip, md-input-chip")
                    .reduce((acc, cv, i) => {
                        acc[i] = cv.innerText;
                        return acc;
                    }, []);
            }
        } catch (error) {
            console.groupCollapsed(`Could not get chip values.`);
            console.error(error);
            console.warn(`getValues() returned an empty array instead.`)
            console.groupEnd();
            return [];
        }
    }
    onChipClick(callback){
        this.callback = callback;
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
    build(parent = _.getQueue()){
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
    constructor(){
        super();
    }
}
export class Divider extends Child {
    constructor(){
        super();
    }
}
export class Fab extends Child {
    constructor(){
        super();
    }
}
export class Form extends Child {
    constructor(){
        super();
    }
}
export class Icon extends Child {
    constructor(){
        super();
    }
}
export class List extends Child {
    constructor(){
        super();
    }
}
export class Menu extends Child {
    constructor(){
        super();
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
    constructor(){
        super();
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


