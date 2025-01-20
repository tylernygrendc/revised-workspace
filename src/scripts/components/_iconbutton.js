import "./_core.js";
import {Child, Icon} from "./_core.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/iconbutton/filled-tonal-icon-button.js";


export class Iconbutton extends Child {
    constructor(icon = "", selectedIcon = "", variant = "", options = {disabled: false, toggle: true}){
        this.tag = ["filled","filled-tonal","outlined"].includes(variant) ? `md-${variant}-icon-button` : "md-icon-button";
        this.childList = [ new Icon(icon) ];
        if(options.toggle) this.attributes.toggle = true;
        if(options.disabled) this.attributes["soft-disabled"] = true;
        if(selectedIcon) this.childList.push(new Icon(selectedIcon).setAttribute({slot: "selected"}));
    }
    setLink(href = "", openInNewWindow = false){
        Object.assign(this.attributes, { href: href, target: openInNewWindow ? "_blank" : "_self" });
        return this;
    }
}