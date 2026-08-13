# Run the CV in a local container

From the repository root:

```sh
docker compose up --build -d
```

Open <http://localhost:8090>. The Compose service is healthy when its healthcheck can retrieve the root page.

Useful verification commands:

```sh
docker compose ps
curl --fail http://localhost:8090/
curl --fail http://localhost:8090/content/content.json
curl --fail --head http://localhost:8090/resume/resume.pdf
```

Stop the local environment with:

```sh
docker compose down
```

Set `CV_PORT` if port 8090 is already in use, for example `CV_PORT=8091 docker compose up --build -d`.

## Browser smoke tests

Install the test dependency and Chromium once:

```sh
npm ci
npm run test:setup
```

Run the browser smoke suite:

```sh
npm run test:smoke
```

The test command builds and starts the Compose service, waits for the site, tests startup and core terminal interactions in Chromium, and stops the service when finished.

## Terminal command completion

Press Tab after a partial command or alias. One match completes in the input; multiple matches are printed above the active prompt. Examples include `abo` to `about` and `cat r` to `cat resume`.

Available aliases are shown by `help`: `ls`, `whoami`, and `cat resume`. The `cv` command includes work history and the resume download. Use `pdf` or the **PDF** navigation button to build a printable CV, then choose **Save as PDF** in the browser print dialog. Enable **Background graphics** in the dialog if the saved PDF should retain the dark terminal background and colors.
