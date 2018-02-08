const config = module.exports = new(require('configucius'))({
  configFile: `~/.${require('./package').name}`,
  options: {

    input: {
      alias: 'i',
      type: 'string',
      // required: true,
      prompt: true,
      description: 'Input file to speed up'
    },

    factor: {
      alias: 'x',
      default: 4,
      type: 'number',
      // required: true,
      prompt: true,
      description: 'Factor by which to speed up'
    },

    fps: {
      default: 60,
      type: 'number',
      prompt: true,
      description: 'Frames per second'
    },

    keepPitch: {
      alias: 'p',
      type: 'boolean',
      prompt: true,
      description: 'Keep the same pitch of the audio'
    },

  }
});


