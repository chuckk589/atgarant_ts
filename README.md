### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
### Installation


#### Usage

``` bash
# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

#prod
pm2 start index.js --name "atgarant" -- -prod --max-memory-restart 500M

#modules
npm install --production

```

For a detailed explanation on how things work, check out the [Vue CLI Guide](https://cli.vuejs.org/guide/).

### Documentation

important notes
1. payment methods must fit pattern paymentMethod_XXXX where XXXX is currency code from multicoin-address-validator npm package https://www.npmjs.com/package/multicoin-address-validator

