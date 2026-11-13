'use strict';

const { API_BASE_URL } = require('../lib/constants');
const { buildChatBody } = require('../lib/payloads');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${API_BASE_URL}/chat/completions`,
    method: 'POST',
    body: buildChatBody(bundle.inputData),
  });
  const data = response.data || {};
  return {
    content: data.choices?.[0]?.message?.content ?? '',
    model: data.model ?? bundle.inputData.model,
    usage: data.usage ?? {},
    raw: data,
  };
};

module.exports = {
  key: 'create_chat_completion',
  noun: 'Chat Completion',
  display: {
    label: 'Create Chat Completion',
    description: 'Generates a text response from a Taodock chat model.',
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
        helpText: 'Pick a chat-capable model available to your API key.',
      },
      {
        key: 'prompt',
        label: 'Prompt',
        type: 'text',
        required: true,
        helpText: 'The instruction or message to send to the model.',
      },
      {
        key: 'systemMessage',
        label: 'System Message',
        type: 'text',
        required: false,
        helpText: 'Optional system-level instruction for the model.',
      },
      {
        key: 'temperature',
        label: 'Temperature',
        type: 'number',
        required: false,
        helpText: 'Sampling temperature between 0 and 2. Leave empty for the model default.',
      },
      {
        key: 'maxTokens',
        label: 'Max Output Tokens',
        type: 'integer',
        required: false,
        helpText: 'Maximum number of tokens to generate. Leave empty for the model default.',
      },
    ],
    sample: {
      content: 'Hello from Taodock!',
      model: 'gpt-5',
      usage: { total_tokens: 42 },
    },
  },
};
