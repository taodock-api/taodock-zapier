'use strict';

const { API_BASE_URL } = require('./lib/constants');

const authentication = {
  type: 'custom',
  // The test call lists the models authorized for the key; a 200
  // response proves the key is valid.
  test: {
    url: `${API_BASE_URL}/models`,
  },
  fields: [
    {
      computed: false,
      key: 'api_key',
      required: true,
      label: 'API Key',
      type: 'string',
      helpText:
        'Create an API key in the [Taodock console](https://taodock.com/keys) and paste it here.',
    },
  ],
};

module.exports = authentication;
