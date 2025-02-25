import "./_core.js";
import { motion, Child, Iconbutton } from "./_core.js";

class MDSnackbar extends Child{
    constructor(){
        super();
        this.animation = {
            slide: slide
        }
    }
    async connectedCallback(){
        await slide();
        if(!this.required) setTimeout(fade, 5000);
    }
}
export class Snackbar extends Child {
    constructor(text, action){
        super();
        this.tag = "md-snack-bar";
        this.childList = [
            new Child("span")
                .setInnerText(text)
        ]
        if(action instanceof Child) { 
            this.childList.push(action);
            this.childList.push(new Iconbutton("close")
                .setAriaLabel("hide notification")
                .setListener("click", fade, { once: true })
            );
            this.attributes.required = true;
        }
    }
}

async function fade() {
    let animation = this.animate([
        {opacity:"100%"},
        {opacity:"0%"}
    ], {
        duration: motion.duration.short,
        easing: motion.easing.decelerate,
        iterations: 1,
        fill: "forwards"
    });
    await animation.finished;
    animation.commitStyles();
    animation.cancel();
    this.remove();
}
async function slide() {
    let animation = this.animate([
        {opacity:"0%", translate:"0% 0%"},
        {opacity:"100%", translate:"0% -125%"}
    ], {
        duration: motion.duration.medium,
        easing: motion.easing.decelerate,
        iterations: 1,
        fill: "forwards"
    });
    await animation.finished;
    animation.commitStyles();
    animation.cancel();
}

customElements.define("md-snack-bar", MDSnackbar);