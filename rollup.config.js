import { readdirSync } from "node:fs";
// TODO: add terser() to plugins at production
// import terser from "@rollup/plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve"; // needed for material web

const [inputDirectory, outputDirectory] = [`./src/scripts`, `./dist/scripts`];

export default readdirSync(inputDirectory).reduce((accumulator, currentFile) => {
    if (currentFile.charAt(0) === "_" || currentFile.includes(".mjs") || !currentFile.includes(".js")) {
        // do not rollup modules/folders
    } else {
        accumulator.push({
            input: `${inputDirectory}/${currentFile}`,
            output: {
                file: `${outputDirectory}/${currentFile.split(".")[0]}.js`,
                format: "es"
            },
                plugins: [nodeResolve()]
        });
    }
    return accumulator;
},[]);
