REMOTE_HOST=
APP_NAME=sdbooking-web
EXPOSE_PORT=8080
INTERNAL_PORT=80

build-deploy:
	docker build --platform linux/amd64 -t ${APP_NAME} .
	docker save ${APP_NAME} > ${APP_NAME}.tar
	docker rmi -f ${APP_NAME}
	scp ./${APP_NAME}.tar ${REMOTE_HOST}:~
	rm ./${APP_NAME}.tar
	ssh -t ${REMOTE_HOST} 'sudo docker stop $$(sudo docker ps -qf "name=${APP_NAME}") \
	&&  sudo docker rm $$(sudo docker ps -aqf "name=${APP_NAME}") -f \
	&&  sudo docker rmi $$(sudo docker images -aqf "reference=${APP_NAME}") -f \
	&&  sudo docker load < ${APP_NAME}.tar \
	&&  rm ${APP_NAME}.tar \
	&&  sudo docker run -d -p ${EXPOSE_PORT}:${INTERNAL_PORT} --name ${APP_NAME} ${APP_NAME}'

init-deploy:
	docker build --platform linux/amd64 -t ${APP_NAME} .
	docker save ${APP_NAME} > ${APP_NAME}.tar
	docker rmi -f ${APP_NAME}
	scp ./${APP_NAME}.tar ${REMOTE_HOST}:~
	rm ./${APP_NAME}.tar
	ssh -t ${REMOTE_HOST} 'sudo docker load < ${APP_NAME}.tar \
	&&  rm ${APP_NAME}.tar \
	&&  sudo docker run -d -p ${EXPOSE_PORT}:${INTERNAL_PORT} --name ${APP_NAME} ${APP_NAME}'