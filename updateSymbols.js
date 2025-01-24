import { Buffer } from "node:buffer";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import ttf2woff2 from 'ttf2woff2';
import chalk from "chalk";

const symbols = [
    "add",
    "close",
    "delete",
    "download",
    "keyboard_arrow_down",
    "keyboard_arrow_left",
    "keyboard_arrow_right",
    "keyboard_arrow_up",
    "link",
    "menu",
    "menu_open",
    "open_in_new",
    "save",
    "search",
    "settings",
    "share"
].sort(), output = "material-symbols", woff2 = true;

try {

    console.log(chalk.yellow(`\nAttempting to update ${symbols.length} symbols...`));

    let res = await fetch(`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=${symbols}`);
    res = await res.text();
    res = await fetch(res.split("url(")[1].split(") format")[0]);
    res = await res.arrayBuffer();

    writeFileSync(`./dist/assets/${output}.ttf`, Buffer.from(res));

    if(woff2) {
        writeFileSync(`./dist/assets/${output}.woff2`, ttf2woff2(readFileSync(`./dist/assets/${output}.ttf`)));
        unlinkSync(`./dist/assets/${output}.ttf`);
    }

    console.log(chalk.greenBright(`\n${output}.${woff2?"woff2":"ttf"} has been successfully updated!\n`));

} catch (error) {
    console.log(error);
    console.log(chalk.redBright(`\n${output}.${woff2?"woff2":"ttf"} could not updated.\n`));
}






