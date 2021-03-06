#! /bin/sh
BASEDIR=$(dirname $0)

# BREEDS
for f in "$BASEDIR"/breeds/*; do
	if [[ $f == *.json ]] 
	then
		filename=breeds/$(basename "$f")
		http POST http://192.168.59.103:8080/api/v1/breeds Content-Type:application/json < $filename
	fi
	if [[ $f == *.yml ]] 
	then
		filename=breeds/$(basename "$f")
		http POST http://192.168.59.103:8080/api/v1/breeds Content-Type:application/x-yaml < $filename
	fi
done

# BLUEPRINTS
for f in "$BASEDIR"/blueprints/*; do
	if [[ $f == *.json ]] 
	then
		filename=blueprints/$(basename "$f")
		http POST http://192.168.59.103:8080/api/v1/blueprints Content-Type:application/json < $filename
	fi
	if [[ $f == *.yml ]] 
	then
		filename=blueprints/$(basename "$f")
		http POST http://192.168.59.103:8080/api/v1/blueprints Content-Type:application/x-yaml < $filename
	fi
done

# DEPLOYMENTS
for f in "$BASEDIR"/deployments/*; do
	if [[ $f == *.json ]] 
	then
		filename=deployments/$(basename "$f")
		http POST http://192.168.59.103:8080/api/v1/deployments Content-Type:application/json < $filename
	fi
	if [[ $f == *.yml ]] 
	then
		filename=deployments/$(basename "$f")
		http POST http://192.168.59.103:8080/api/v1/deployments Content-Type:application/x-yaml < $filename
	fi
done
