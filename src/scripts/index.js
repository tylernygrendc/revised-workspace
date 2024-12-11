
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
    let inputChips = () => {let array=[]; for(let i = 0; i < 5; ++i) array.push(new Chip(`Chip test #${i}`)); return array;};
    let assistChips = () => {let array=[]; for(let i = 0; i < 5; ++i) array.push(new Chip(`Chip test #${i}`).setLink("https://www.google.com")); return array;};
    let genericChips = () => {let array = []; for(let i = 0; i < 5; ++i) array.push(`Chip test #${i}`); return array;};
    new Chipset(inputChips()).appendTo(document.body);
    new Chipset(assistChips()).appendTo(document.body);
    new Chipset(genericChips()).setCallback().appendTo(document.body);
    new Chipset(genericChips()).appendTo(document.body);
    new Dialog("Dialog test", "Lorem ipsum sit am it...","ok",true).appendTo(document.body);
    new Fab("add").appendTo(document.body);
    let listTest = ()=>{let array=[]; for(let i = 0; i < 5; ++i) array.push(new Li(`List item test #${i}`)); return array;}
    let checklistTest = ()=>{let array=[]; for(let i = 0; i < 5; ++i) array.push(new Checkbox(`List item test #${i}`)); return array;}
    let radioListTest = ()=>{let array=[]; for(let i = 0; i < 5; ++i) array.push(new Radio(`List item test #${i}`)); return array;}
    new List(listTest(),true).appendTo(document.body);
    new List(checklistTest()).appendTo(document.body);
    new List(radioListTest()).appendTo(document.body);
    new Progress().appendTo(document.body);
    new Progress(40,true,20).appendTo(document.body);
}
