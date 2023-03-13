# Variables
MYSQL_USER="anshor"
MYSQL_PASS="vpsdb"
MYSQL_DB="db_tokopolis"

# Install Node JS and PM2
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.profile
nvm install 14.18.3
npm install -g pm2

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

# Config Nginx
cp nginx-admin.conf /etc/nginx/sites-available/tokopolis-admin.conf
ln -sf /etc/nginx/sites-available/tokopolis-admin.conf /etc/nginx/sites-enabled/tokopolis-admin.conf

cp nginx-client.conf /etc/nginx/sites-available/tokopolis-client.conf
ln -sf /etc/nginx/sites-available/tokopolis-client.conf /etc/nginx/sites-enabled/tokopolis-client.conf

cp nginx-payment-test.conf /etc/nginx/sites-available/tokopolis-payment-test.conf
ln -sf /etc/nginx/sites-available/tokopolis-payment-test.conf /etc/nginx/sites-enabled/tokopolis-payment-test.conf

nginx -t
systemctl restart nginx

# Config Golang
apt-get purge golang*

curl -O https://dl.google.com/go/go1.18.4.linux-amd64.tar.gz
tar xvf go1.18.4.linux-amd64.tar.gz
mv go /usr/local

mkdir ~/.go

echo "export GOROOT=/usr/local/go" >> ~/.profile
echo "export GOPATH=~/.go" >> ~/.profile
echo "export PATH=$PATH:$GOROOT/bin:$GOPATH/bin" >> ~/.profile
source ~/.profile

update-alternatives --install "/usr/bin/go" "go" "/usr/local/go/bin/go" 0
update-alternatives --set go /usr/local/go/bin/go

# ============================================================================

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
pm2 start npm --name "tokopolis-payment" -- run dev

cd ../payment-test/
npm run packaging
pm2 start npm --name "tokopolis-payment-test" -- run dev

# Config Email
cd ../email-service/
go build main.go
pm2 start ./main --name "tokopolis-email"