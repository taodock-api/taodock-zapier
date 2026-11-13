'use strict';

const { API_BASE_URL } = require('../lib/constants');
const { buildImageBody } = require('../lib/payloads');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${API_BASE_URL}/images/generations`,
    method: 'POST',
    body: buildImageBody(bundle.inputData),
  });
  const images = response.data?.data ?? [];
  if (images.length === 0) {
    throw new z.errors.Error('Taodock returned no image data.');
  }
  return {
    model: bundle.inputData.model,
    images,
  };
};

module.exports = {
  key: 'generate_image',
  noun: 'Image',
  display: {
    label: 'Generate Image',
    description: 'Generates one or more images from a prompt using a Taodock image model.',
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
        helpText: 'Pick an image-capable model available to your API key.',
      },
      {
        key: 'prompt',
        label: 'Prompt',
        type: 'text',
        required: true,
        helpText: 'Describe the image you want to generate.',
      },
      {
        key: 'size',
        label: 'Size',
        type: 'string',
        required: false,
        helpText: 'Optional image size, e.g. `1024x1024`.',
      },
      {
        key: 'aspectRatio',
        label: 'Aspect Ratio',
        type: 'string',
        required: false,
        helpText: 'Optional aspect ratio, e.g. `16:9`.',
      },
      {
        key: 'outputFormat',
        label: 'Output Format',
        type: 'string',
        required: false,
        choices: ['png', 'jpeg', 'webp'],
        helpText: 'The image output format.',
      },
      {
        key: 'negativePrompt',
        label: 'Negative Prompt',
        type: 'text',
        required: false,
        helpText: 'Optional description of what to avoid in the image.',
      },
      {
        key: 'referenceImageUrl',
        label: 'Reference Image URL',
        type: 'string',
        required: false,
        helpText: 'Optional URL of an image the model should reference.',
      },
      {
        key: 'count',
        label: 'Number of Images',
        type: 'integer',
        required: false,
        helpText: 'How many images to generate (1-10).',
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
      model: 'image-gen-2',
      images: [{ b64_json: 'aW1hZ2U=' }],
    },
  },
};
