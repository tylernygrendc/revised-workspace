# Revised Workspace

Building a chrome extension as a single, large javascript file is a bad way of doing things. This revised workspace compiles modular source content to a compiled output for distribution. It is for a **very** specific application, but I'm building it with reusability in mind. This project may prove useful in other web applications where the majority of computing must be done on-device.

## Getting Started

Download the [latest release](https://github.com/tylernygrendc/revised-workspace.git/releases/tag/v0.10`) or clone this repository with:

`git clone https://github.com/tylernygrendc/revised-workspace.git`

From the revised workspace directory, run `npm install`. This system relies on [rollup](https://rollupjs.org/), [pug](https://pugjs.org), and [sass](https://sass-lang.com) for compiling to javascript, html, and css, respectively. 

## Core Concepts

It feels like you should be able to add HTML elements using the `HTMLElement` interface. Adding a list could be like this:

```
new HTMLUListElement(["Item #1", "Item #2",...]);
```

Of course, that's now how it works. This workspace **does** employ a that syntax, though. Here's how you make a list:

```
new List([
    new Li("Item"),
    new Li("Clickable Item").setListener("click",()=>{ /* do something */ }),
    new Li("Item with Link").setLink("www.github.com",true),
    "Item as String",...
]).appendTo(document.body);
```

The `Child` class is the foundation of this system. Create an element like this:

```
// index.js

import "./components/_core.js";
import {Child} from "./components/_core.js";

let exampleChild = new Child("h1")
    .setClassList(["child-example"])
    .setInnerText("This is an example element.")
    .appendTo(document.body);
```

As you can see, `Child` takes a single parameter that sets the tag name of the resultant DOM element. It defaults to `"div"`. In addition, every `new Child()` is assigned the following values.
```
{
    this.attributes = {};
    this.childList = [];
    this.classList = [];
    this.dataset = {};
    this.id = getRandomId();
    this.innerText = "";
    this.listeners = [];
}
```

These values can be set directly (`new Child().classList = ["class-name"]`) or with an object method (`new Child().setClassList(["class-name"])`). Methods on the `Child` class are:

|Method|Usage|Default|Returns|
|---|---|---|---|
|`appendTo(node\|Child\|string)`|`.appendTo(document.body)`|`getQueue()`[^1]|`this`|
|`exists()`|`.exists()`||`boolean`|
|`getNode(<any>fallback)`|`.getNode()`|`null`|`HTMLElement`|
|`setAttribute(object)`|`.setAttribute({role:"heading"})`|`{}`|`this`|
|`setAriaLabel(string)`|`.setAriaLabel("demo")`|`""`|`this`|
|`setChildList(array)`|`.setChildList([new Child()])`|`[]`|`this`|
|`setClassList(array)`|`.setClassList(["class-1"])`|`[]`|`this`|
|`setDataset(object)`|`.setDataset({example:"value"})`|`{}`|`this`|
|`setListener(<string>event, function)`|`.setListener("click",()=>{console.log("click")})`|`""`,`function(){}`|`this`|
|`setId(string)`|`.setId("demo")`|`getRandomId()`[^2]|`this`|
|`setInnerText(string)`|`.setInnerText("demo")`|`""`|`this`|

Notice how most of these methods return `this`. Because of this, modifying `Child` with its methods is preferred in most cases. 

## Components

The `Child` class is inherited by several higher-level components, meaning that all components in this system share the methods listed above. Some have additional methods that expand functionality and appearance. Here are the most common methods:

|Method|Returns|
|---|---|
|`getSelection()`|An array representing user input.|
|`setLink(<string>href,<boolean>openInNewWindow)`|`this` object.|

To use a component, you must import it. That import needs to look like this because of some [material web](https://material-web.dev/) funkiness:

```
// index.js
import "./components/_checklist";
import { Checklist, Checkbox } from "./components/_checklist.js";
```

The second import statement here is technically unnecessary, but it allows for intellisense within the IDE. A future migration away from material web might allow for cleaner imports and smaller bundle sizes at compilation.

## Production

Before exporting with `npm run compress`, add [terser](https://www.npmjs.com/package/@rollup/plugin-terser) to the list of plugins in `rollup.config.js`, and change the output file extension from `.js` to `.min.js`. Update `src/_head.pug` to reflect this change when it loads the corresponding script. 

This is a process could be automated within `npm run compress`, maybe with the help a `.env` variable, but that's a problem for future me.

[^1]: `getQueue()` references (or creates) a node containing elements that have not yet been moved to their final position. This isn't absolutely necessary, but helps to prevent layout shift.
[^2]: `getRandomId()` returns a random string suitable for uniquely identifying an html element. It's just a container for `crypto.getRandomValues()`.