'use strict';

const { API_BASE_URL } = require('../lib/constants');
const {
  buildVideoBody,
  extractTaskId,
  extractTaskStatus,
} = require('../lib/payloads');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${API_BASE_URL}/videos`,
    method: 'POST',
    body: buildVideoBody(bundle.inputData),
  });
  const task = response.data || {};
  const taskId = extractTaskId(task);
  if (!taskId) {
    throw new z.errors.Error('The Taodock video task response did not include an ID.');
  }
  return {
    ...(task && typeof task === 'object' ? task : {}),
    task_id: taskId,
    status: extractTaskStatus(task),
  };
};

module.exports = {
  key: 'create_video',
  noun: 'Video',
  display: {
    label: 'Create Video',
    description:
      'Starts an asynchronous Taodock video generation task. Use Get Video Status to check progress.',
  },
  operation: {
    perform,
    inputFields: [
      {
        key: 'model',
        label: 'Model',
        type: 'string',
        required: true,
        dynamic: 'model.id.name',
        helpText: 'Pick a video-capable model available to your API key.',
      },
      {
        key: 'prompt',
        label: 'Prompt',
        type: 'text',
        required: true,
        helpText: 'Describe the video you want to generate.',
      },
      {
        key: 'duration',
        label: 'Duration (seconds)',
        type: 'integer',
        required: false,
        helpText: 'Requested video length in seconds. Leave empty for the model default.',
      },
      {
        key: 'resolution',
        label: 'Resolution',
        type: 'string',
        required: false,
        helpText: 'Optional resolution, e.g. `1080p`.',
      },
      {
        key: 'aspectRatio',
        label: 'Aspect Ratio',
        type: 'string',
        required: false,
        helpText: 'Optional aspect ratio, e.g. `16:9`.',
      },
      {
        key: 'imageUrl',
        label: 'First Frame URL',
        type: 'string',
        required: false,
        helpText: 'Optional URL of an image to use as the first frame.',
      },
      {
        key: 'negativePrompt',
        label: 'Negative Prompt',
        type: 'text',
        required: false,
        helpText: 'Optional description of what to avoid in the video.',
      },
      {
        key: 'audio',
        label: 'Generate Audio',
        type: 'boolean',
        required: false,
        helpText: 'Whether the video should include generated audio.',
      },
      {
        key: 'seed',
        label: 'Seed',
        type: 'integer',
        required: false,
        helpText: 'Optional random seed for reproducible results.',
      },
    ],
    sample: {
      task_id: 'task_abc123',
      status: 'queued',
    },
  },
};
