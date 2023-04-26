PROJECT_NAME=tokopolis

create-env:
	cp core-admin/.env.example .env.admin
	cp core-client/.env.example .env.client
	cp email-service/.env.example .env.email
	cp payment-service/.env.example .env.payment
	cp payment-test/.env.example .env.payment.test

apply-env:
	mv .env.admin core-admin/.env
	mv .env.client core-client/.env
	mv .env.email email-service/.env
	mv .env.payment payment-service/.env
	mv .env.payment.test payment-test/.env

build-core:
	@docker-compose -p ${PROJECT_NAME} up --detach --build

build-admin:
	@docker-compose -p ${PROJECT_NAME} -f core-admin/docker-compose.yml --env-file ./core-admin/.env up --detach --build

build-client:
	@docker-compose -p ${PROJECT_NAME} -f core-client/docker-compose.yml --env-file ./core-client/.env up --detach --build

build-email:
	@docker-compose -p ${PROJECT_NAME} -f email-service/docker-compose.yml --env-file ./email-service/.env up --detach --build

build-payment:
	@docker-compose -p ${PROJECT_NAME} -f payment-service/docker-compose.yml --env-file ./payment-service/.env up --detach --build

build-payment-test:
	@docker-compose -p ${PROJECT_NAME} -f payment-test/docker-compose.yml --env-file ./payment-test/.env up --detach --build

build-all: build-core build-admin build-client build-email build-payment build-payment-test