import * as fs from 'node:fs';
import * as path from 'node:path';
import mime from 'mime';

const date_regx = /^\d{4}-\d{1,2}-\d{1,2}/;

let output_dirs = new Map<Date, string>();
let images = new Map<string, Date>();

fs.readdirSync(__dirname).forEach(file => {
    if(fs.lstatSync(file).isDirectory()){
        // if the folder name begins with a date YYYY.MM.DD
        if(date_regx.test(path.basename(path.dirname(file)))){
            let dateStr: string | null = date_regx.exec(path.basename(path.dirname(file)))[0];
            
            if(dateStr === null) {
                console.error("Unable to get date of folder: %s", path.basename(path.dirname(file)));
                return;
            }

            output_dirs.set(new Date(dateStr), file);
        }
    }
    if(mime.getType(file)?.split('/')[0] === "image"){
        // check if this file is an image

        let image = require('exif').image;
        try {
            new image({image: file}, function(error, ExifData){
                if(error){
                    console.error("Unable to get Exif data for image: %s", file);
                    return;
                }

                let imageDate: Date = new Date(ExifData.exif.DateTimeOriginal);

                images.set(file, new Date(imageDate.getFullYear(), imageDate.getMonth(), imageDate.getDate()));
            });
        } catch (error) {
            console.error("Error getting Exif date for image: %s", file);
        }
    }
})

images.keys().forEach(img =>{
    let newPath: string = output_dirs.get(images.get(img)) + path.basename(path.dirname(img));

    
})

//Move all the files

