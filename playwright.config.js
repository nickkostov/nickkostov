const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    outputDir: './test-results',
    reporter: 'list',
    use: {
        baseURL: process.env.CV_BASE_URL || 'http://127.0.0.1:8090',
        browserName: 'chromium',
        headless: true
    }
});
