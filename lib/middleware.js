'use strict';

const { CLIENT_HEADER_VALUE } = require('./constants');

// Adds the user's API key and the integration's client header to
// every outgoing request. The key lives only in bundle.authData and
// is never logged.
const addAuthHeader = (request, z, bundle) => {
  if (bundle.authData.api_key) {
    request.headers.Authorization = `Bearer ${bundle.authData.api_key}`;
  }
  request.headers['X-TaoDock-Client'] = CLIENT_HEADER_VALUE;
  return request;
};

function extractErrorMessage(body) {
  if (body === null || body === undefined) {
    return undefined;
  }
  if (typeof body === 'string') {
    const trimmed = body.trim();
    return trimmed ? trimmed.slice(0, 500) : undefined;
  }
  if (typeof body === 'object') {
    if (typeof body.error === 'string' && body.error) {
      return body.error;
    }
    if (body.error && typeof body.error === 'object') {
      const message = body.error.message;
      if (typeof message === 'string' && message) {
        return message;
      }
    }
    if (typeof body.message === 'string' && body.message) {
      return body.message;
    }
  }
  return undefined;
}

// Turns non-2xx responses into readable Zapier errors using the
// API's structured error payload.
const handleErrors = (response, z, bundle) => {
  if (response.status >= 400) {
    const detail = extractErrorMessage(response.data);
    const message = detail
      ? `Taodock API error (HTTP ${response.status}): ${detail}`
      : `Taodock API error (HTTP ${response.status})`;
    throw new z.errors.Error(message, undefined, response.status);
  }
  return response;
};

module.exports = {
  addAuthHeader,
  handleErrors,
};
