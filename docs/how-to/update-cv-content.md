# Update CV content

Edit `content/content.json` to change any displayed CV fact. The home introduction, biography, skills, work history, projects, contacts, statistics, quotes, detailed experience, certifications, and detailed skills are all stored there.

The biography under `about` separates `summary`, narrative `story` paragraphs, ordered `journey` stages, and `motivation`. Keep educational status exact: Darbi College is the completed graduation, while HAN University of Applied Sciences represents one year of Biomedical Sciences study rather than a completed degree.

Each `certifications` entry requires `name` and an HTTPS `credentialUrl`. Add `credentialId` when a verifier requires a separately entered ID, and use `status` for context such as a certification program that is no longer supported. The statistics certification count should match the number of entries.

Keep the existing JSON structure and value types. Required text must be non-empty, list sections must remain non-empty arrays, and statistics must be numbers. On invalid content, the website keeps the terminal input disabled and displays the exact failing field path.

Validate changes from the repository root:

```sh
jq empty content/content.json
npm run test:smoke
```

The browser tests exercise every content-backed command and the missing-field and invalid-type startup paths.
