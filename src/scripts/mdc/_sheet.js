import "./_core.js";
import { motion, Child } from "./_core.js";
import { Iconbutton } from "./_iconbutton.js";

class MDSheet extends HTMLElement{
    constructor(){
        super();
    }
}

export class Sheet extends Child {
    constructor(headline = "", contentArray = []){
        super();
        this.tag = "md-sheet";
        this.animation = {
            slideIn: async function () {
                let animation = this.animate([
                    {transform: ""},
                    {transform: ""}
                ], {
                    duration: motion.duration.medium, 
                    iterations: 1, 
                    easing: motion.easing.decelerate, 
                    fill: "forwards"
                });
                await animation.finished;
                animation.commitStyles();
                animation.cancel();
            },
            slideOut: async function () {
                
            }
        }
        this.childList = [
            new Child("span")
                .setInnerText(headline),
            new Iconbutton("close")
                .setAriaLabel("close")
                .setListener("click", this.animation.slideOut),
            new Child()
                .setChildList(contentArray)
        ],
        this.shadowRoot = {
            isAttached: true,
            mode: "closed",
            clonable: "false",
            childList: [
                new Child().setClassList(["scrim"])
            ]
        }
    }
}

customElements.define("md-sheet", MDSheet);