'use strict';

const { expect } = require('chai');
const nock = require('nock');
const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const authData = { api_key: 'sk-test' };

async function expectRejects(promise, pattern) {
  let error;
  try {
    await promise;
  } catch (err) {
    error = err;
  }
  expect(error, 'expected the call to reject').to.be.an('error');
  expect(error.message).to.match(pattern);
}

describe('model trigger (dropdown)', () => {
  afterEach(() => nock.cleanAll());

  it('returns sorted id/name pairs', async () => {
    nock('https://taodock.com')
      .get('/v1/models')
      .reply(200, { data: [{ id: 'b-model' }, { id: 'a-model' }, { id: 'b-model' }] });

    const results = await appTester(App.triggers.model.operation.perform, {
      authData,
      inputData: {},
    });
    expect(results).to.deep.equal([
      { id: 'a-model', name: 'a-model' },
      { id: 'b-model', name: 'b-model' },
    ]);
  });
});

describe('list_models action', () => {
  afterEach(() => nock.cleanAll());

  it('returns the model id list', async () => {
    nock('https://taodock.com')
      .get('/v1/models')
      .reply(200, { data: [{ id: 'gpt-5' }, { id: 'image-gen-2' }] });

    const result = await appTester(App.creates.list_models.operation.perform, {
      authData,
      inputData: {},
    });
    expect(result.models).to.deep.equal(['gpt-5', 'image-gen-2']);
  });
});

describe('create_chat_completion action', () => {
  afterEach(() => nock.cleanAll());

  it('sends the chat body and returns the content', async () => {
    const scope = nock('https://taodock.com')
      .post('/v1/chat/completions', {
        model: 'gpt-5',
        messages: [
          { role: 'system', content: 'be terse' },
          { role: 'user', content: 'hi' },
        ],
        temperature: 0.7,
        max_tokens: 128,
      })
      .reply(200, {
        model: 'gpt-5',
        choices: [{ message: { content: 'hello back' } }],
        usage: { total_tokens: 21 },
      });

    const result = await appTester(App.creates.create_chat_completion.operation.perform, {
      authData,
      inputData: {
        model: 'gpt-5',
        prompt: 'hi',
        systemMessage: 'be terse',
        temperature: 0.7,
        maxTokens: 128,
      },
    });
    expect(scope.isDone()).to.equal(true);
    expect(result.content).to.equal('hello back');
    expect(result.usage.total_tokens).to.equal(21);
  });
});

describe('generate_image action', () => {
  afterEach(() => nock.cleanAll());

  it('sends the image body and returns the images', async () => {
    const scope = nock('https://taodock.com')
      .post('/v1/images/generations', {
        model: 'image-gen-2',
        prompt: 'a fox',
        response_format: 'b64_json',
        output_format: 'webp',
        n: 2,
      })
      .reply(200, {
        data: [{ b64_json: 'aW1hZ2U=' }, { b64_json: 'b3RoZXI=' }],
      });

    const result = await appTester(App.creates.generate_image.operation.perform, {
      authData,
      inputData: {
        model: 'image-gen-2',
        prompt: 'a fox',
        outputFormat: 'webp',
        count: 2,
      },
    });
    expect(scope.isDone()).to.equal(true);
    expect(result.images).to.have.length(2);
  });

  it('throws when the API returns no image data', async () => {
    nock('https://taodock.com')
      .post('/v1/images/generations')
      .reply(200, { data: [] });

    await expectRejects(
      appTester(App.creates.generate_image.operation.perform, {
        authData,
        inputData: { model: 'm', prompt: 'p' },
      }),
      /no image data/,
    );
  });
});

describe('create_video action', () => {
  afterEach(() => nock.cleanAll());

  it('sends the video body and returns the task', async () => {
    const scope = nock('https://taodock.com')
      .post('/v1/videos', {
        model: 'video-model',
        prompt: 'a wave',
        duration: 5,
        audio: true,
      })
      .reply(200, { id: 'task-1', status: 'queued' });

    const result = await appTester(App.creates.create_video.operation.perform, {
      authData,
      inputData: {
        model: 'video-model',
        prompt: 'a wave',
        duration: 5,
        audio: true,
      },
    });
    expect(scope.isDone()).to.equal(true);
    expect(result.task_id).to.equal('task-1');
    expect(result.status).to.equal('queued');
  });

  it('throws when the response has no task id', async () => {
    nock('https://taodock.com')
      .post('/v1/videos')
      .reply(200, { status: 'queued' });

    await expectRejects(
      appTester(App.creates.create_video.operation.perform, {
        authData,
        inputData: { model: 'm', prompt: 'p' },
      }),
      /did not include an ID/,
    );
  });
});

describe('get_video_status action', () => {
  afterEach(() => nock.cleanAll());

  it('returns the task with normalized id and status', async () => {
    nock('https://taodock.com')
      .get('/v1/videos/task-9')
      .reply(200, { id: 'task-9', status: 'Completed', progress: 100 });

    const result = await appTester(App.creates.get_video_status.operation.perform, {
      authData,
      inputData: { taskId: 'task-9' },
    });
    expect(result.task_id).to.equal('task-9');
    expect(result.status).to.equal('completed');
    expect(result.progress).to.equal(100);
  });

  it('maps API errors to readable messages', async () => {
    nock('https://taodock.com')
      .get('/v1/videos/nope')
      .reply(404, { error: { message: 'task not found' } });

    await expectRejects(
      appTester(App.creates.get_video_status.operation.perform, {
        authData,
        inputData: { taskId: 'nope' },
      }),
      /task not found/,
    );
  });
});
