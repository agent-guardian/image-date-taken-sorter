import * as fs from 'fs';

let output_dirs: string[] = [];
let images: string[] = [];

fs.readdirSync(__dirname).forEach(file => {
    if(fs.lstatSync(file).isDirectory()){
        // if the folder name begins with a date YYYY.MM.DD
    } else{
        // check if this file is an image

    }
})

