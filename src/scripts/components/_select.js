import { camelCase } from "../_string.js";
import { Child } from "./_core.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";

export class Select extends Child {
    constructor(category = "", optionsArray = [], options = {clampMenuWidth: false, disabled: false, required: false}){
        super();
        this.tag = "md-outlined-select";
        this.attributes.label = category;
        this.attributes.name = camelCase(category);
        if(options.disabled) this.attributes.disabled = true;
        if(options.required) this.attributes.required = true;
        if(options.clampMenuWidth) this.attributes["clamp-menu-width"] = true;
        this.childList = optionsArray.reduce((acc, cv) => {
            acc.push(new Child("md-select-option").setChildList([
                new Child().setAttribute({slot:"headline"}).setInnerText(cv)
            ]));
            return acc;
        },[]);
    }
    getSelection(){
        return this.getNode().value;
    }
}