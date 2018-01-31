#!/usr/bin/env node

const Ffmpeg = require('fluent-ffmpeg');
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
  ffmpeg.outputOptions('-vf', `setpts=(PTS-STARTPTS)/${config.factor}`);
  if (config.keepPitch) {
    const { n, multiplier } = utils.findExponent(config.factor);
    ffmpeg.outputOptions('-af', Array.from(Array(n)).map(x => `atempo=${multiplier}`).join(','));
  } else {
    const sample_rate = metadata.streams.find(s => s.codec_type === 'audio').sample_rate
    ffmpeg.outputOptions('-af', `asetrate=${config.factor}*${sample_rate}`);
  }
  ffmpeg.save(config.input.replace(/(.*)\.(.*?)$/, `$1_${config.factor}x.$2`));

  ffmpeg.on('start', console.log);
  ffmpeg.on('progress', _ => {
    process.stdout.clearLine();
    process.stdout.write((Object.entries(_).map(_ => _.join(': ')).join(', ')));
    process.stdout.cursorTo(0);
  });

}

main().catch(e => process.exit(0, console.error(e)));


