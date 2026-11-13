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

describe('authentication', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('passes when the API key is valid', async () => {
    const scope = nock('https://taodock.com')
      .get('/v1/models')
      .matchHeader('Authorization', 'Bearer sk-test')
      .matchHeader('X-TaoDock-Client', 'taodock-zapier/1.0.0')
      .reply(200, { data: [{ id: 'gpt-5' }] });

    await appTester(App.authentication.test, { authData });
    expect(scope.isDone()).to.equal(true);
  });

  it('throws a readable error for an invalid key', async () => {
    nock('https://taodock.com')
      .get('/v1/models')
      .reply(401, { error: { message: 'invalid api key' } });

    await expectRejects(
      appTester(App.authentication.test, { authData }),
      /invalid api key/,
    );
  });
});
