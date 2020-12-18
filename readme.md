# Setup
1. npm install -g typescript
1. Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
1. npm install --save-dev @types/node

# Run
1. Capture vtt data via network dev tools with filter `mime-type:text/vtt`
1. Save as `subtitles.har.json` or edit the source
1. Run launch program ... or `tsc ... && node har-to-vtt.js`

# Add VTT to .mp4
    ffmpeg -i file_with_video.mp4 -i file_with_audio.mp4 -i subtitles.vtt -metadata:s:a language=eng -metadata:s:s language=eng -c copy -c:s mov_text output.mp4