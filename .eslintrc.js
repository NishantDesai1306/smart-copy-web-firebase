module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "airbnb",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "modules": true,
            "experimentalObjectRestSpread": true
        }
    },
    "settings": {
        "import/resolver": {
            "node": {
                "paths": ["node_modules"]
            }
        }
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-param-reassign": "off",
        "operator-linebreak": ["error", "after"],
        "no-console": "off",
        "no-tabs": "off",
        "indent": ["error", "tab", { "SwitchCase": 1 }],
        "brace-style": ["error", "stroustrup"],
        "react/jsx-indent": [2, "tab"],
        "arrow-parens": ["error", "always"],
        "react/forbid-prop-types": "off",
        "react/jsx-indent-props": [2, "tab"],
        "jsx-a11y/anchor-is-valid": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "jsx-a11y/label-has-for": "off",
        "max-len": "off",
    }
};