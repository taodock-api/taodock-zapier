'use strict';

const { API_BASE_URL } = require('../lib/constants');
const {
  extractTaskId,
  extractTaskStatus,
} = require('../lib/payloads');

const perform = async (z, bundle) => {
  const taskId = String(bundle.inputData.taskId).trim();
  const response = await z.request({
    url: `${API_BASE_URL}/videos/${encodeURIComponent(taskId)}`,
  });
  const task = response.data || {};
  return {
    ...(task && typeof task === 'object' ? task : {}),
    task_id: extractTaskId(task) || taskId,
    status: extractTaskStatus(task),
  };
};

module.exports = {
  key: 'get_video_status',
  noun: 'Video Task',
  display: {
    label: 'Get Video Status',
    description: 'Checks the current status of a Taodock video generation task.',
  },
  operation: {
    perform,
    inputFields: [
      {
        key: 'taskId',
        label: 'Task ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the video task returned by Create Video.',
      },
    ],
    sample: {
      task_id: 'task_abc123',
      status: 'completed',
    },
  },
};
