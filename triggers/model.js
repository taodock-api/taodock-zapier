'use strict';

const { API_BASE_URL } = require('../lib/constants');
const { parseModelList } = require('../lib/payloads');

// Hidden trigger that powers the dynamic Model dropdowns in the
// actions. It always reflects what the connected API key can use.
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${API_BASE_URL}/models`,
  });
  return parseModelList(response.data);
};

module.exports = {
  key: 'model',
  noun: 'Model',
  display: {
    label: 'List Models',
    description: 'Lists the AI models available to the connected Taodock API key.',
    hidden: true,
  },
  operation: {
    type: 'polling',
    perform,
    sample: {
      id: 'gpt-5',
      name: 'gpt-5',
    },
  },
};
