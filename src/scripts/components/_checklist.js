import { coerce } from "../_type.js";
import "./core.js";
import { Child, Divider } from "./_core.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/radio/radio.js";
import "@material/web/switch/switch.js";

export class MDChecklist extends HTMLElement {
    constructor(){
        super();
    }
}
export class MDCheckitem extends HTMLElement{
    constructor(){
        super();
    }
}
export class MDRadiolist extends HTMLElement {
    constructor(){
        super();
    }
}
export class MDRadioitem extends HTMLElement{
    constructor(){
        super();
    }
}
export class MDSwitchlist extends HTMLElement {
    constructor(){
        super();
    }
}
export class MDSwitchitem extends HTMLElement{
    constructor(){
        super();
    }
}
export class Checkbox extends Child {
    constructor(label = "", category = "", options = { checked: false, disabled: false, indeterminate: false }){
        super();
        this.tag = "md-checkbox-item";
        this.checkbox = getRandomId();
        this.childList = [
            new Child("label")
                .setAttribute({"for": this.checkbox})
                .setInnerText(label),
            new Child("md-checkbox")
                .setId(this.checkbox)
                .setAttribute({
                    "name": category ? category : label,
                    "value": category ? label : "on",
                    "touch-target": "wrapper"
                })
        ];
        if(options.checked) this.childList[1].setAttribute({checked: true});
        if(options.disabled) this.childList[1].setAttribute({disabled: true});
        if(options.indeterminate) this.childList[1].setAttribute({indeterminate: true});
    }
}
export class Checklist extends Child{
    constructor(category = "", itemsArray = [], useDividers = false){
        super();
        this.tag = "md-check-list";
        this.childList = useDividers ? coerce.array(itemsArray, [itemsArray]).reduce((acc, cv) => {
            acc.push(cv instanceof Checkbox ? cv : new Checkbox(`${cv}`, category));
            acc.push(new Divider());
            return acc;
        },[]) : coerce.array(itemsArray, [itemsArray]).reduce((acc, cv) => {
            acc.push(cv instanceof Checkbox ? cv : new Checkbox(`${cv}`, category));
            return acc;
        },[]);
    }
    getSelection(){
    
    }
}
export class Radio extends Child {
    constructor(label = "", category = "", options = { checked: false, disabled: false }){
        super();
        this.tag = "md-radio-item";
        this.checkbox = getRandomId();
        this.childList = [
            new Child("label")
                .setAttribute({"for": this.checkbox})
                .setInnerText(label),
            new Child("md-radio")
                .setId(this.checkbox)
                .setAttribute({
                    "name": category ? category : label,
                    "value": category ? label : "on",
                    "touch-target": "wrapper"
                })
        ];
        if(options.checked) this.childList[1].setAttribute({checked: true});
        if(options.disabled) this.childList[1].setAttribute({disabled: true});
    }
}
export class Radiolist extends Child{
    constructor(category = "", itemsArray = [], useDividers = false){
        super();
        this.tag = "md-radio-list";
        this.childList = useDividers ? coerce.array(itemsArray, [itemsArray]).reduce((acc, cv) => {
            acc.push(cv instanceof Radio ? cv : new Radio(`${cv}`, category));
            acc.push(new Divider());
            return acc;
        },[]) : coerce.array(itemsArray, [itemsArray]).reduce((acc, cv) => {
            acc.push(cv instanceof Radio ? cv : new Radio(`${cv}`, category));
            return acc;
        },[]);
    }
    getSelection(){

    }
}
export class Switch extends Child {
    constructor(label = "", category = "", options = { checked: false, disabled: false }){
        super();
        this.tag = "md-switch-item";
        this.checkbox = getRandomId();
        this.childList = [
            new Child("label")
                .setAttribute({"for": this.checkbox})
                .setInnerText(label),
            new Child("md-switch")
                .setId(this.checkbox)
                .setAttribute({
                    "icons": true,
                    "name": category ? category : label,
                    "value": category ? label : "on",
                })
        ];
        if(options.checked) this.childList[1].setAttribute({selected: true});
        if(options.disabled) this.childList[1].setAttribute({disabled: true});
    }
}
export class Switchlist extends Child{
    constructor(category = "", itemsArray = [], useDividers = false){
        super();
        this.tag = "md-switch-list";
        this.childList = useDividers ? coerce.array(itemsArray, [itemsArray]).reduce((acc, cv) => {
            acc.push(cv instanceof Switch ? cv : new Switch(`${cv}`, category));
            acc.push(new Divider());
            return acc;
        },[]) : coerce.array(itemsArray, [itemsArray]).reduce((acc, cv) => {
            acc.push(cv instanceof Switch ? cv : new Switch(`${cv}`, category));
            return acc;
        },[]);
    }
    getSelection(){
        
    }
}

customElements.define("md-check-list", MDChecklist);
customElements.define("md-check-item", MDCheckitem);
customElements.define("md-radio-list", MDRadiolist);
customElements.define("md-radio-item", MDRadioitem);
customElements.define("md-switch-list", MDSwitchlist);
customElements.define("md-switch-item", MDSwitchitem);