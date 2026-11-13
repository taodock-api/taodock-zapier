'use strict';

const { version: platformVersion } = require('zapier-platform-core');
const authentication = require('./authentication');
const { addAuthHeader, handleErrors } = require('./lib/middleware');

const modelTrigger = require('./triggers/model');
const listModels = require('./creates/list_models');
const createChatCompletion = require('./creates/create_chat_completion');
const generateImage = require('./creates/generate_image');
const createVideo = require('./creates/create_video');
const getVideoStatus = require('./creates/get_video_status');

module.exports = {
  version: require('./package.json').version,
  platformVersion,
  authentication,
  beforeRequest: [addAuthHeader],
  afterResponse: [handleErrors],
  triggers: {
    [modelTrigger.key]: modelTrigger,
  },
  searches: {},
  creates: {
    [listModels.key]: listModels,
    [createChatCompletion.key]: createChatCompletion,
    [generateImage.key]: generateImage,
    [createVideo.key]: createVideo,
    [getVideoStatus.key]: getVideoStatus,
  },
};
