'use strict';

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function finiteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function buildChatBody(input) {
  const body = {
    model: input.model,
    messages: [{ role: 'user', content: input.prompt }],
  };
  const system = nonEmptyString(input.systemMessage);
  if (system) {
    body.messages.unshift({ role: 'system', content: system });
  }
  const temperature = finiteNumber(input.temperature);
  const maxTokens = finiteNumber(input.maxTokens);
  if (temperature !== undefined) body.temperature = temperature;
  if (maxTokens !== undefined) body.max_tokens = maxTokens;
  return body;
}

function buildImageBody(input) {
  const body = {
    model: input.model,
    prompt: input.prompt,
    response_format: 'b64_json',
  };
  const size = nonEmptyString(input.size);
  const quality = nonEmptyString(input.quality);
  const outputFormat = nonEmptyString(input.outputFormat);
  const aspectRatio = nonEmptyString(input.aspectRatio);
  const negativePrompt = nonEmptyString(input.negativePrompt);
  const referenceImageUrl = nonEmptyString(input.referenceImageUrl);
  const count = finiteNumber(input.count);
  const seed = finiteNumber(input.seed);
  if (size) body.size = size;
  if (quality) body.quality = quality;
  if (outputFormat) body.output_format = outputFormat;
  if (aspectRatio) body.aspect_ratio = aspectRatio;
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (referenceImageUrl) body.image_url = referenceImageUrl;
  if (count !== undefined) body.n = count;
  if (seed !== undefined && seed > 0) body.seed = seed;
  return body;
}

function buildVideoBody(input) {
  const body = {
    model: input.model,
    prompt: input.prompt,
  };
  const duration = finiteNumber(input.duration);
  const resolution = nonEmptyString(input.resolution);
  const aspectRatio = nonEmptyString(input.aspectRatio);
  const imageUrl = nonEmptyString(input.imageUrl);
  const negativePrompt = nonEmptyString(input.negativePrompt);
  const seed = finiteNumber(input.seed);
  if (duration !== undefined && duration > 0) body.duration = duration;
  if (resolution) body.resolution = resolution;
  if (aspectRatio) body.aspect_ratio = aspectRatio;
  if (imageUrl) body.image_url = imageUrl;
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (typeof input.audio === 'boolean') body.audio = input.audio;
  if (seed !== undefined && seed > 0) body.seed = seed;
  return body;
}

/** Taodock returns the video task id as `id` or `task_id`. */
function extractTaskId(task) {
  if (task === null || typeof task !== 'object') {
    return '';
  }
  const value = task.id ?? task.task_id;
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

function extractTaskStatus(task) {
  if (task === null || typeof task !== 'object') {
    return 'unknown';
  }
  const value = task.status;
  return typeof value === 'string' && value ? value.toLowerCase() : 'unknown';
}

function parseModelList(response) {
  const list = Array.isArray(response)
    ? response
    : response && typeof response === 'object' && Array.isArray(response.data)
      ? response.data
      : [];
  const seen = new Set();
  const models = [];
  for (const entry of list) {
    const id = typeof entry === 'string' ? entry : entry && entry.id;
    if (typeof id === 'string' && id && !seen.has(id)) {
      seen.add(id);
      models.push({ id, name: id });
    }
  }
  models.sort((a, b) => a.id.localeCompare(b.id));
  return models;
}

module.exports = {
  buildChatBody,
  buildImageBody,
  buildVideoBody,
  extractTaskId,
  extractTaskStatus,
  parseModelList,
};
