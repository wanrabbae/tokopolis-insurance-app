# Variables
MYSQL_USER="anshor"
MYSQL_PASS="vpsdb"
MYSQL_DB="db_tokopolis"

# Config MySQL
mysql -u root << EOFMYSQL

CREATE DATABASE ${MYSQL_DB};
CREATE USER '${MYSQL_USER}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_PASS}';
USE ${MYSQL_DB};
GRANT ALL PRIVILEGES ON ${MYSQL_DB}.* TO '${MYSQL_USER}'@'localhost';

EOFMYSQL

# Set Project Environment
cp .env.admin core-admin/.env
cp .env.client core-client/.env
cp .env.email email-service/.env
cp .env.payment payment-service/.env

# Config Admin
cd core-admin/
npm run packaging
npm run build
pm2 start npm --name "tokopolis-admin" -- start

# Config Client
cd ../core-client/
npm run packaging
npm run build
pm2 start npm --name "tokopolis-client" -- start

# Config Payment
cd ../payment-service/
npm run packaging
pm2 start npm --name "tokopolis-payment" -- dev

# Config Nginx
cp nginx-admin.conf /etc/nginx/sites-available/tokopolis-admin.conf
ln -sf /etc/nginx/sites-available/tokopolis-admin.conf /etc/nginx/sites-enabled/tokopolis-admin.conf

cp nginx-client.conf /etc/nginx/sites-available/tokopolis-client.conf
ln -sf /etc/nginx/sites-available/tokopolis-client.conf /etc/nginx/sites-enabled/tokopolis-client.conf

nginx -t
systemctl restart nginx