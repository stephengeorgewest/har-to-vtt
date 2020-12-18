//import {Har} from "./har";
import * as file from "./subtitles.har.json";
import * as fs from "fs";
              
const vtts = file.log.entries.reduce((previous, entry) => {
    const segmentString = entry.request.url.match(/segment([\d]+).vtt/)[1];
    const i = parseInt(segmentString);
    previous[i] = entry.response.content.text;
    return previous;
}, [] as string[]);
fs.writeFileSync("subtitles.all.vtt", vtts.join("\n"));

const vtts_header_removed = vtts.map(v => v.replace("WEBVTT\nX-TIMESTAMP-MAP=LOCAL:00:00:00.000,MPEGTS:0\n\n", "").split("\n")).filter(v => v.length > 1 && v[0] != '');
fs.writeFileSync("subtitles.split.vtt", vtts_header_removed.reduce((reduced, current) => {
    return reduced + current.join("\n");
}, ""))

vtts_header_removed.forEach((value, index, array) =>{
    if(index < array.length-2){
        const next_entry = array[index+1];
        const next_time_string = next_entry[0];
        const next_time_matches = next_time_string.match(/(\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}.\d{3})/);
        const next_start_time = next_time_matches[1];
        const next_end_time = next_time_matches[2];
        const next_words= [array[index+1][1], array[index+1][2]];//
        for(let i = value.length-1; i > 0; i--){
            const line = value[i];
            const this_time_matches = line.match(/(\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}.\d{3})/);
            if(this_time_matches){
                const this_start_time = this_time_matches[1];
                const this_end_time = this_time_matches[2];
                const this_words = [value[i+1], value[i+2]];
                if( this_end_time && this_end_time == next_start_time && 
                    next_words[0] == this_words[0] &&
                    next_words[1] == this_words[1]){
                    value.splice(i,3);
                    array[index+1][0] = this_start_time + " --> " + next_end_time;
                }
            }
        }
    }
});
const vtts_reduced = vtts_header_removed.reduce((reduced, current) => {
    return reduced + current.join("\n");
}, "WEBVTT\nX-TIMESTAMP-MAP=LOCAL:00:00:00.000,MPEGTS:0\n\n");

fs.writeFileSync("./subtitles.vtt",vtts_reduced);