### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
#### Installation

 1. ENV schema
    SECRET=sd2b6m8q
    url = http://1.1.1.1:1111
    DB_URL=mysql://root:pass@mysqldb:3306/atgarant
    DB_URL_DEV=mysql://admin:admin@127.0.0.1:3306/atgarant
    DB_PASSWORD=pass
    DB_NAME=atgarant
    PORT=3000

#### launch

    #debug
    NODE_ENV=debug docker-compose up -d --build
    #prod 
docker-compose up -d --build



```

### Documentation

important notes
1. payment methods must fit pattern paymentMethod_XXXX where XXXX is currency code from multicoin-address-validator npm package https://www.npmjs.com/package/multicoin-address-validator
