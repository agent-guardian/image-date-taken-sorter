export function getDirByDate(dirMap:Map<Date,string>,imgDate:Date) {
    for(let [date, dir] of dirMap.entries()){
        if(date.getTime() === imgDate.getTime())
            return dir;
    }
    return null;
}