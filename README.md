# Taodock integration for Zapier

[Taodock](https://taodock.com) is a unified AI API for text, image and video generation. This [Zapier Platform CLI](https://docs.zapier.com/integrations/build/cli) integration connects Taodock to Zapier workflows.

## Actions

| Action | Description |
|---|---|
| **List Available Models** | Lists the AI models available to your API key (`GET /v1/models`). |
| **Create Chat Completion** | Generates a text response from a chat model (`POST /v1/chat/completions`). |
| **Generate Image** | Generates one or more images from a prompt (`POST /v1/images/generations`). |
| **Create Video** | Starts an async video generation task (`POST /v1/videos`). |
| **Get Video Status** | Checks a video task's current state (`GET /v1/videos/{id}`). |

Model fields use a dynamic dropdown backed by `GET /v1/models`, so they always reflect what the connected key can use. Model availability and pricing are dynamic — see the [model catalog](https://taodock.com/models).

## Connect Taodock to Zapier

1. Create an API key in the [Taodock console](https://taodock.com/keys).
2. In Zapier, choose a Taodock action and paste the key when connecting a new account. The key is stored by Zapier and is never part of this repository.

Video generation is asynchronous: use **Create Video** to start a task, add a **Delay**, then **Get Video Status** until the status is `completed`.

## Development

```bash
npm install
npm test            # mocha + nock unit tests against the mocked Taodock API
npx zapier validate # schema validation (requires zapier-platform-cli)
```

## Publishing status

The integration targets the Zapier App Directory. Public listing additionally requires (per [Zapier's publishing requirements](https://docs.zapier.com/integrations/publish/integration-publishing-requirements)):

- an integration team with at least one admin using a `@taodock.com` email,
- a permanent Taodock test account for `integration-testing@zapier.com`,
- live test Zaps with successful run history for every action,
- `zapier login` + `zapier push`/`zapier promote` from an authorized account.

## License

MIT — see [LICENSE](LICENSE).
