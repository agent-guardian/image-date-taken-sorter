import * as fs from 'node:fs';
import * as path from 'node:path';
import mime from 'mime';

import { ExifDateTime, exiftool } from 'exiftool-vendored';
import { getDirByDate } from './lib/lib.js';

const date_regx = /^\d{4}\.\d{1,2}\.\d{1,2}/;

let output_dirs = new Map<Date, string>();
let images = new Map<string, Date>();

let files = fs.readdirSync(process.cwd());

for(const file of files){
    if(fs.lstatSync(file).isDirectory()){
        // if the folder name begins with a date YYYY.MM.DD
        if(date_regx.test(file)){
            let result: RegExpExecArray | null = date_regx.exec(file);
            
            if(result === null) {
                console.error("Unable to get date of folder: %s", path.basename(path.dirname(file)));
                continue;
            }
            
            let dateStr: string = result[0];

            output_dirs.set(new Date(dateStr), file);

            continue;
        }
    }
    // check if this file is an image
    if(mime.getType(file)?.split('/')[0] === "image"){

        let tags = await exiftool.read(file);

        if(tags.errors && tags.errors.length > 0){
            console.error("Errors getting EXIF data for: %s\n\tError: %s", file, tags.errors);
        }

        if(tags.DateTimeOriginal instanceof ExifDateTime){
            let imageDate: Date = tags.DateTimeOriginal.toDate();

            imageDate.setHours(0);
            imageDate.setMinutes(0);
            imageDate.setSeconds(0);
            imageDate.setMilliseconds(0);
            
            images.set(file, imageDate);
        } else{
            console.error("Error getting date taken for: ", file);
        }
    }
}

//Move all the files
for(let [img, imgDate] of images.entries()) {

    let outputDir:string | null = getDirByDate(output_dirs, imgDate);
    
    //make output dir
    if(!outputDir){
        let month:number = imgDate.getMonth() + 1;
        outputDir = process.cwd() + "\\" + imgDate.getFullYear() + "." + month + "." + imgDate.getDate();
        
        output_dirs.set(new Date(imgDate.getFullYear(), imgDate.getMonth(), imgDate.getDate()), outputDir);
        fs.mkdirSync(outputDir);
    }

    //move image
    let newPath: string = outputDir + "\\" + img;

    if(newPath === null || newPath === undefined){
        console.error("Error moving image: %s: Undefined path", img);
        continue;
    }

    if(fs.existsSync(newPath)){
        console.error("Error moving image: %s: Destination already exists: %s", img, newPath);
        continue;
    }

    fs.rename(img, newPath, (err) =>{
        console.error("Error moving image: %S: %S", img, err);
    });

    console.log("Moved Image: %s to %s", img, newPath);
}