#!/usr/bin/env node

const exec = require('child_process').execSync;

const generator = require('./generator');
const fu = require('./futil');

const dirs = [
  //Flux
  './app',
  './app/actions',
  './app/constants',
  './app/components',
  './app/dispatcher',
  './app/stores',
  './app/utils',

  //Build
  './public',
  './public/css',
  './public/img',
  './public/js',
  
  //Jest
  './__tests__'
]

const npms = [
  //Babel
  'yarn add --dev babel-cli',
  'yarn add --dev babel-preset-env',
  'yarn add --dev babel-preset-react',
  'yarn add --dev babel-preset-stage-0',

  //React.js
  'yarn add react',
  'yarn add react-dom',
  'yarn add prop-types',
  'yarn add --dev raf',

  //Flux
  'yarn add flux',

  //Immutable.js
  'yarn add immutable',
  
  //Jest
  'yarn add --dev jest-cli',
  'yarn add --dev babel-jest',
  'yarn add --dev babel-polyfill',

  //WebPack
  'yarn add --dev webpack',
  'yarn add --dev webpack-cli',
  'yarn add --dev webpack-dev-server',
  'yarn add --dev babel-loader',
  'yarn add --dev webpack-bundle-analyzer',

  //ESLint
  'yarn add --dev eslint',
  'yarn add --dev babel-eslint',
  'yarn add --dev eslint-plugin-import',
  'yarn add --dev eslint-plugin-react',
  'yarn add --dev eslint-plugin-jsx-a11y',
  'yarn add --dev eslint-config-airbnb',

  //Prettier
  'yarn add --dev prettier',
  'yarn add --dev eslint-plugin-prettier',
  'yarn add --dev eslint-config-prettier'
]

const npms_plus = [
  'yarn add react-tap-event-plugin',
  'yarn add material-ui@next',
  'yarn add material-ui-icons',
  'yarn add react-router-dom',  
  'yarn add axios'  
]

const repository = {
  "type":"git", 
  "url":"https://example.com"
};

const jest = {
  "unmockedModulePathPatterns": [
    "<rootDir>/node_modules/react",
    "<rootDir>/node_modules/react-dom",
    "<rootDir>/node_modules/react-addons-test-utils"
  ],
  "transform": { 
    "^.+\\.jsx?$": "babel-jest"
  },
  "moduleFileExtensions": [
    "js",
    "json"
  ],
  "setupFiles": [
    "raf/polyfill"
  ]
};

const scripts = {
  "start": "webpack-dev-server --progress --colors --mode development",
  "dev": "webpack -p --progress --colors --mode development",
  "build": "webpack -p --progress --colors --mode production",
  "test": "BABEL_JEST_STAGE=0 jest",
  "lint": "eslint app/** __tests__/**",
  "fix": "eslint app/** __tests__/** --fix",
  "bundle-analyze": "webpack --profile --json > stats.json && webpack-bundle-analyzer ./stats.json"
};

const eslint = {
  "extends": [
    "airbnb",
    "prettier",
    "prettier/react"
  ],
  "parser": "babel-eslint",
  "env": {
     "browser": true,
     "jest": true
  },
  "plugins": [
    "prettier"
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js"] }],   
    "react/no-find-dom-node": 0,
    "jsx-a11y/anchor-is-valid": [ "error", {
      "components": [ "Link" ],
      "specialLink": [ "to", "hrefLeft", "hrefRight" ],
      "aspects": [ "noHref", "invalidHref", "preferButton" ]
    }]
  }
}

const keywords = {
  "keywords": [
    "react",
    "flux"
  ]
}

main();

function main() {
  console.log('*** starter-react-flux ***');
  const args = process.argv;
  switch (args.length) {
    case 3:
      if (args[2] == 'init') {
        setupReact();
        setupReactPlus();
        showComplete();
      } else if (args[2] == 'init-basic'){
        setupReact();
        showUsage();
      }
      break;
    case 4:
      if (args[2] == 'generate' && args[3] == 'test') {
        generator.ComponentTestFiles();
        showComplete();
      } else {
        showUsage();
      }
      break;
    case 5:
      if (args[2] == 'generate' && args[3] == 'store') {
        generator.StoreFile(args[4]);
        showComplete();
      } else if (args[2] == 'generate' && args[3] == 'action') {
        generator.ActionFile(args[4]);
        showComplete();
      } else if (args[2] == 'generate' && args[3] == 'container') {
        generator.ContainerFile(args[4]);
        showComplete();
      } else if (args[2] == 'generate' && args[3] == 'component') {
        generator.ComponentFile(args[4]);
        showComplete();
      } else {
        showUsage();
      }
      break;
    default:
      showUsage();
      break;
  }
}

function showUsage() {
  console.log('*** starter-react-flux ***');
  console.log('Usage:');
  console.log('starter-react-flux init                      : Setup a React/Flux project.');
  console.log('starter-react-flux generate container [Name] : Generate the Component.');
  console.log('starter-react-flux generate component [Name] : Generate the Container.');
  console.log('starter-react-flux generate store  [Name]    : Generate the Store. ');
  console.log('starter-react-flux generate action [Name]    : Generate the ActionCreators.');
  console.log('starter-react-flux generate test             : Generate tests of components.');
  process.exit(-1);
}

function showComplete() {
  console.log('Completed!');
}

function setupReact(arg) {
  fu.createDirectories(dirs);
  exec('npm init -y', fu.puts);
  fu.fixJSON('package.json', 'description', 'React template.');
  fu.fixJSON('package.json', 'repository', repository);
  fu.fixJSON('package.json', 'jest', jest); 
  fu.fixJSON('package.json', 'scripts', scripts); 
  fu.fixJSON('package.json', 'keywords', keywords); 
  fu.fixJSON('package.json', 'license', 'MIT'); 

  fu.createJSON('.eslintrc', eslint);
  fu.createJSON('.babelrc', {"presets":["react", "env", "stage-0"]});
  console.log(__dirname);
  fu.createFile('./public/index.html', fu.readFile('./public/index.html'));
  fu.createFile('./public/css/style.css', fu.readFile('./public/main.css'));
  fu.createFile('webpack.config.js', fu.readFile('./app/webpack.js'));
  fu.createFile('./app/App.js', fu.readFile('./app/App.js'));
  fu.createFile('./app/dispatcher/AppDispatcher.js', fu.readFile('./app/dispatcher/dispatcher.js'));
  fu.createFile('./app/constants/AppConstants.js', fu.readFile('./app/constants/constant.js'));
  fu.createFile('./app/components/Navi.js', fu.readFile('./app/components/Navi.js'));
  fu.createFile('./app/components/Menu.js', fu.readFile('./app/components/Menu.js'));
  fu.createFile('./app/components/Content.js', fu.readFile('./app/components/Content.js'));
  fu.createFile('./__tests__/Content-test.js', fu.readFile('./__tests__/Content-test.js'));

  generator.StoreFile('Sample');
  generator.ActionFile('Sample');
  generator.ContainerFile('Top');
  generator.ContainerFile('Sample');
  npmInstall(npms);
}

function setupReactPlus() {
  npmInstall(npms_plus);
}

function npmInstall(npms) {
  npms.map(command => {
    console.log(command);
    exec(command, fu.puts);
  });
}


