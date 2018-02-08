# ffmpeg-speedup-video

Simple command-line tool that uses ffmpeg to speed up a video

## Install

* Requires [NodeJS](http://nodejs.org/) & [ffmpeg](http://ffmpeg.org/)

```sh
npm i -g ffmpeg-speedup-video
```

## Usage

```
fsup video.mp4 -x 4
```

### Options

```
--input, -i, <first arg>    Input file to speed up [required]
--factor, -x                Factor by which to speed up [default=4]
--fps                       Frames per second [default=60]
--keepPitch                 Keep the same pitch of the audio
```
