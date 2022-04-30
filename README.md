### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
### Installation
 1. ENV params  
    database = [mysql://][user]:[pass]@[host]:[port]/[database]  
    url = [http://][ip]  
    jwt-secret = [any]  
    port = [number]  

#### Usage

``` bash


#prod
pm2 start index.js --name "atgarant" -- -prod --max-memory-restart 500M

#modules
npm install --production

```

### Documentation

important notes
1. payment methods must fit pattern paymentMethod_XXXX where XXXX is currency code from multicoin-address-validator npm package https://www.npmjs.com/package/multicoin-address-validator

