/* eslint-env node */
module.exports = {
    "root": true,
    env: {
        browser: true,
        node: true,
        "vue/setup-compiler-macros": true,
    },
    "extends": [
        "plugin:vue/vue3-essential",
        "eslint:recommended"
    ],
    "rules": {
        "vue/multi-word-component-names": 0,
    }
}
