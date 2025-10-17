import * as fs from 'node:fs';
import * as path from 'node:path';
import mime from 'mime';

import { ExifDateTime, exiftool } from 'exiftool-vendored';

const date_regx = /^\d{4}-\d{1,2}-\d{1,2}/;

let output_dirs = new Map<Date, string>();
let images = new Map<string, Date>();

fs.readdirSync(process.cwd()).forEach(async file => {
    if(fs.lstatSync(file).isDirectory()){
        // if the folder name begins with a date YYYY.MM.DD
        if(date_regx.test(path.basename(path.dirname(file)))){
            let result: RegExpExecArray | null = date_regx.exec(path.basename(path.dirname(file)));
            
            if(result === null) {
                console.error("Unable to get date of folder: %s", path.basename(path.dirname(file)));
                return;
            }
            
            let dateStr: string = result[0];

            console.log("Found Folder: ", file);

            output_dirs.set(new Date(dateStr), file);
        }
    }
    // check if this file is an image
    if(mime.getType(file)?.split('/')[0] === "image"){

        console.log("Found Image: ", file);

        let tags = await exiftool.read(file);

        console.log("Got EXIF data for: ", file);

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
}});

//Move all the files
images.keys().forEach(img => {
    
    //make output dir
    if(!output_dirs.get(images.get(img)!)){
        let imgDate: Date = images.get(img)!;
        let outputDir:string = process.cwd() + imgDate.getFullYear() + "." + imgDate.getMonth() + "." + imgDate.getDay();
        
        fs.mkdirSync(outputDir);
        
        output_dirs.set(new Date(imgDate.getFullYear(), imgDate.getMonth(), imgDate.getDay()), outputDir);
    }

    //move image
    let newPath: string = output_dirs.get(images.get(img)!) + path.basename(path.dirname(img));

    if(fs.existsSync(newPath)){
        console.error("Error moving image: %s: Destination already exists: %s", img, newPath);
        return;
    }

    fs.rename(img, newPath, (err) =>{
        console.error("Error moveing image: %S: %S", img, err);
    });

    console.log("Moved Image: %s to %s", img, output_dirs.get(images.get(img)!));
});


