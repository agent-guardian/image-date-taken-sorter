import * as fs from 'node:fs';
import * as path from 'node:path';

const date_regx = /^\d{4}-\d{1,2}-\d{1,2}/;

let output_dirs = new Map<Date, string>();
let images: string[] = [];

fs.readdirSync(__dirname).forEach(file => {
    if(fs.lstatSync(file).isDirectory()){
        // if the folder name begins with a date YYYY.MM.DD
        if(date_regx.test(path.basename(path.dirname(file)))){
            let dateStr: string | null = date_regx.exec(path.basename(path.dirname(file)))[0];
            if()//test null dateStr
            output_dirs.set(
                Date.parse(
                , file))
        }
    } else{
        // check if this file is an image

    }
})

