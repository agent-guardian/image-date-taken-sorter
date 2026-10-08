# Design Requirements

## Definitions

**Date Folder** - A folder in the current working directory with a filename that starts with a date in YYYY.MM.DD format.

## Requirements

- Look through the current working directory for date folders.
- Look through the current working directory for images, including raw files. Ignore all other file types.
- Read the EXIF data of the found images for the date the images were taken.
- Move the images into date folders with the corresponding date to the date the image was taken. Create new date folders as needed.
- Easily run this program from either the commandline or file explorer without having to set up the node environment and packages every time.
- Write tests for all features and components for ease of development.