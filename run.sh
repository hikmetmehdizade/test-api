#!/bin/bash
docker-compose -f docker-compose-postgres.yml -f docker-compose-api.yml build &&   docker-compose -f docker-compose-postgres.yml -f docker-compose-api.yml up