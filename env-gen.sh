#!/bin/bash
read -e -p "secret_key: " -i $(head -c 5 /dev/urandom | base64) secret_key
read -e -p "public adress:" -i "http://54.37.75.228" url
read -e -p "db_password:" -i "ssqwec" DB_PASSWORD
read -e -p "db_name:" -i "atgarant" DB_NAME
read -e -p "db_port:" -i "3306" DB_PORT
read -e -p "db_user:" -i "root" DB_USER
read -e -p "db_host:" -i "mysqldb" DB_HOST
read -e -p "app_port:" -i "3000" PORT
echo -e "SECRET=$secret_key\nurl=$url:$PORT\nDB_URL=mysql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME\nDB_PASSWORD=$DB_PASSWORD\nDB_NAME=$DB_NAME\nPORT=$PORT" > .env
echo "env file created"