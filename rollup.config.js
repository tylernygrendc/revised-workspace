import { readdirSync } from 'node:fs';
import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve'; // needed for material web

const [inputDirectory, outputDirectory] = [`./src/scripts`, `./dist/scripts`];
const scripts = readdirSync(inputDirectory);

class Config {
    constructor(script){
        this.input = `${inputDirectory}/${script}`;
        this.output = {
            file: `${outputDirectory}/${script.split(".")[0]}.min.js`,
            format: 'es',
        };
        this.plugins = [
            terser(),
            nodeResolve()
        ]
    }
}

let configArray = [];

for(const script of scripts){
    configArray.push(new Config(script));
}

export default configArray;