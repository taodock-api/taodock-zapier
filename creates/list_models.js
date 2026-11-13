'use strict';

const { API_BASE_URL } = require('../lib/constants');
const { parseModelList } = require('../lib/payloads');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${API_BASE_URL}/models`,
  });
  return {
    models: parseModelList(response.data).map((model) => model.id),
  };
};

module.exports = {
  key: 'list_models',
  noun: 'Model',
  display: {
    label: 'List Available Models',
    description: 'Lists the AI models available to your Taodock API key.',
  },
  operation: {
    perform,
    sample: {
      models: ['gpt-5', 'image-gen-2'],
    },
  },
};
