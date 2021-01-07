#!/bin/bash
OUR_PORT=$1;


if [ -z "$OUR_PORT" ];
then
	echo "Usage: ./setup.sh PORT
	exit 0
fi

sqlite3 db/database.db < db/schema.sql