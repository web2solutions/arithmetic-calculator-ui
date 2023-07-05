const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: process.env,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
