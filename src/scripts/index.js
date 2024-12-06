
import "@material/web/all.js"
import { Button,Checkbox,Radio,Select,Slider,Switch,Textfield,Chipset,Chip,Dialog,Divider,Fab,List,Li,Menu,Mi,Progress } from "./_dom.js";

window.onload = () => {
    new Button("Button test").appendTo(document.body);
    new Checkbox("Checkbox Test").appendTo(document.body);
    new Radio("Radio Test").appendTo(document.body);
    new Select("Select Test",["Option #1","Option #2"]).appendTo(document.body);
}
