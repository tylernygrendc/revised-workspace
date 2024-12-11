
import "@material/web/all.js"
import { Button,Checkbox,Radio,Select,Slider,Switch,Textfield,Chipset,Chip,Dialog,Fab,List,Li,Menu,Mi,Progress } from "./_dom.js";

window.onload = () => {
    new Button("Button test").appendTo(document.body);
    new Checkbox("Checkbox Test").appendTo(document.body);
    new Radio("Radio Test").appendTo(document.body);
    new Select("Select Test",["Option #1","Option #2"])
        .setLabel("Select Test")
        .setSupportingText("Lorem ipsum sit am it..")
        .appendTo(document.body);
    new Slider("Slider Test").appendTo(document.body);
    new Switch("Switch Test").appendTo(document.body);
    new Textfield("Textfield Test")
        .setPlaceholder("Placeholder text...")
        .setSupportingText("Lorem ipsum sit am it...")
        .appendTo(document.body);
    let chipTest = () => {let array=[]; for(let i = 0; i < 5; ++i) array.push(new Chip(`Chip test #${i}`)); return array;};
    // let chipTest = () => {let array = []; for(let i = 0; i < 5; ++i) array.push(`Chip test #${i}`); return array;};
    new Chipset(chipTest()).appendTo(document.body);
    new Dialog("Dialog test", "Lorem ipsum sit am it...","ok",true).appendTo(document.body);
    new Fab("add").appendTo(document.body);
    let listTest = ()=>{let array=[]; for(let i = 0; i < 5; ++i) array.push(new Li(`List item test #${i}`)); return array;}
    new List(listTest(),true)
        .appendTo(document.body);

}
