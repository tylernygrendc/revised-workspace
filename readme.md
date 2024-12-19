# Revised Workspace

Building a chrome extension as a single, large javascript file is a bad way of doing things. This revised workspace compiles modular source content to a compiled output for distribution. It is for a **very** specific application, but I'm building it reusability in mind. This project may prove useful in other web applications where the majority of computing must be done on-device.

## Getting Started

Download the [latest release](https://github.com/tylernygrendc/revised-workspace.git/releases/tag/v0.10`) or clone this repository with:

`git clone https://github.com/tylernygrendc/revised-workspace.git`

From the revised workspace directory, run `npm install.` This system relies on [rollup](https://rollupjs.org/), [pug](https://pugjs.org), and [sass](https://sass-lang.com) for compiling to javascript, html, css, respectively. 

## Core Concepts

It feels like you should be able to add HTML elements using the `HTMLElement` interface. Adding a list could be like this:

```
new HTMLUListElement(["Item #1", "Item #2",...]);
```

Of course, that's now how it works. This workspace **does** employ a that syntax, though. Here's how you make a list:

```
new List([
    new Li("Item #1"),
    new Li("Clickable Item").setCallback(()=>{ /* do something */ }),
    new Li("Item with Link").setLink("www.github.com"),...
]).appendTo(document.body);
```

The `Child` class is the foundation of this system. Create an element like this:

```
// index.js

import _dom.js;

let exampleChild = new Child("h1")
    .setClassList(["child-example"])
    .setInnerText("This is an example element.")
    .appendTo(document.body);
```

Every `new Child()` is assigned the following default values, unless otherwise specified.
```
{
    tag: "div",
    id: // random string
    attributes: {},
    classList: []
}
```

Methods on the `Child` class are:

|Method|Usage|Default|Returns|
|---|---|---|---|
|`appendTo(node\|Child\|string)`|`.appendTo(document.body)`|`getQueue()`[^1]|`Child`|
|`exists()`|`.exists()`||`boolean`|
|`getNode(<any>fallback)`|`.getNode()`|`null`|`HTMLElement`|
|`setAttribute(object)`|`.setAttribute({role:"heading"})`||`Child`|
|`setAriaLabel(string)`|`.setAriaLabel("demo")`||`Child`|
|`setChildList(array)`|`.setChildList([new Child()])`||`Child`|
|`setClassList(array)`|`.setClassList(["class-1"])`|`any[]`|`Child`|
|`setId(string)`|`.setId("demo")`|`getRandomId()`[^2]|`Child`|
|`setInnerText(string)`|`.setInnerText("demo")`||`Child`|

## Components

The `Child` class is inherited by several higher-level components, meaning that all components in this system share the methods listed in the section above. Some have additional methods that expand functionality and appearance. Most are built with [material web](https://material-web.dev/), a library of web components, and do their best to adhere to [material guidelines](https://m3.material.io/).

To use a component, you must import it.

```
// index.js

import { Details } from ./components/basic.js;
```
### Basic Components

|Component|Summary|Methods|
|---|---|---|
|`Details`|||
|`Divider`|||
|`Icon`|||
|`Img`|||
|`Link`|||
|`Picture`|||
|`Progress`|||

### Input Components

|Component|Summary|Methods|
|---|---|---|
|`Button`|||
|`Checkbox`||||
|`FAB`||||
|`Radio`||||
|`Search`||||
|`Select`||||
|`Slider`||||
|`Switch`||||
|`Textfield`||||

### List Components

|Component|Summary|Methods|
|---|---|---|
|`Checklist`|||
|`Chip`|||
|`Chipset`|||
|`Li`|||
|`List`|||
|`Radiolist`|||

### Prompt Components

|Component|Summary|Methods|
|---|---|---|
|`Dialog`|||
|`Form`|||
|`Menu`|||
|`Mi`|||
|`Snackbar`|||

### Layout Components

|Component|Summary|Methods|
|---|---|---|
|`Card`|||
|`Navigation`|||
|`Sheet`|||
|`Tab`|||
|`Tabs`|||

## Production

Before exporting with `npm run compress`, add [terser](https://www.npmjs.com/package/@rollup/plugin-terser) to the list of plugins in `rollup.config.js`, and change the output file extension from `.js` to `.min.js`. Update `src/_head.pug` to reflect this change when it loads the corresponding script. 

This is a process could be automated within `npm run compress`, maybe with the help a `.env` variable, but that's a problem for future me.

[^1]: getQueue() references (or creates) a node containing elements that have not yet been moved to their final position.
[^2]: getRandomId() returns a random string suitable for uniquely identifying an html element.