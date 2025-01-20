import "./_core.js";
import { Child, Icon } from "./_core.js";
import "@material/web/fab/fab.js";

export class Fab extends Child {
    constructor(icon="",label="", options = {color:"primary", size:"normal"}){
        super();
        this.tab = "md-fab";
        this.childList = [ new Icon(icon).setAttribute({slot:"icon"}) ];
        if(label) this.attributes.label = label;
        if(["small","large"].includes(options.size)) this.attributes.size = size;
        if(["primary","secondary","tertiary"].includes(options.color)) this.attributes.variant = color;
    }
}