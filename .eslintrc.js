module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
        'jest': true,
    },
    'extends': ['eslint:recommended', 'plugin:react/recommended'],
    'parserOptions': {
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true,
            'jsx': true,
        },
        'sourceType': 'module',
    },
    'plugins': [
        'react',
    ],
    'rules': {
        'indent': [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        'quotes': [
            'error',
            'single',
        ],
        'semi': [
            'error',
            'always',
        ],
        'comma-dangle': ['error', 'always-multiline'],
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
    },
};
