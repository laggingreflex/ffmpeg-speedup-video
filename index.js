#!/usr/bin/env node

const Ffmpeg = require('fluent-ffmpeg');
const rewriteLine = require('rewrite-line');
const config = require('./config');
const { promisify } = require('util');
const utils = require('./utils');

async function main() {
  if (!config.input && config._.length) {
    config.input = config._.pop();
  }

  await config.prompt();
  if (!config.input) {
    console.error('Need an input file');
    process.exit(1);
  }

  const ffmpeg = Ffmpeg({ logger: console.log });
  ffmpeg.input(config.input);
  const metadata = await promisify(Ffmpeg.ffprobe)(config.input);
  // console.log(`metadata:`, metadata);
  ffmpeg.outputOptions('-vf', `setpts=(PTS-STARTPTS)/${config.factor}`);
  if (config.keepPitch) {
    const { n, multiplier } = utils.findExponent(config.factor);
    ffmpeg.outputOptions('-af', Array.from(Array(n)).map(x => `atempo=${multiplier}`).join(','));
  } else {
    const audioMetaData = metadata.streams.find(s => s.codec_type === 'audio');
    if (audioMetaData) {
      const { sample_rate } = audioMetaData;
      ffmpeg.outputOptions('-af', `asetrate=${config.factor}*${sample_rate}`);
    }
  }
  ffmpeg.fps(config.fps);
  ffmpeg.save(config.input.replace(/(.*)\.(.*?)$/, `$1_${config.factor}x.$2`));

  ffmpeg.on('start', console.log);
  const { duration } = metadata.streams.find(s => s.codec_type === 'video');
  const total = duration / config.factor;
  ffmpeg.on('progress', _ => rewriteLine(
    parseInt(utils.parseDuration(_.timemark) / total * 100) + '%, '
    + Object.entries(_).map(_ => _.join(': ')).join(', ')
  ));
}

main().catch(e => process.exit(0, console.error(e)));
