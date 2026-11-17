# Installation Instructions

There are two ways of installing the CFM Toolbox Webeditor.
The first an easiest way is to use the pre-build docker images.
The second one is to build the docker images from source.
Both ways will be described in this document.

## Installing using pre-build docker images

1. Prerequisites: docker, docker-compose
2. Create an installation folder:
	2.1 `cfmtoolbox-webeditor`
	2.2 `cd cfmtoolbox-webeditor`
3. Create a `compose.yaml` file with the following content:
```yaml
services:
  backend:
    image: ghcr.io/kit-tva/cfmtoolbox-webeditor-backend:main
    ports:
      - "3001:8000"
    environment:
      ALLOWED_ORIGINS: '["<your IP or hostname>"]'
  frontend:
    image: ghcr.io/kit-tva/cfmtoolbox-webeditor-frontend:main
    ports:
      - "80:3000"
    depends_on:
      - backend
```
4. Start the services using `docker compose up -d`


## Building from source

If it is desired to build the CFM Toolbox Webeditor from source,
for instance to costumize the `CFM_TOOLBOX_BACKEND_IP` during build time,
use the following instructions.

1. Prerequisites: git, docker, docker-compose
2. Clone this repository:
	2.1 `git clone https://github.com/KIT-TVA/cfmtoolbox-webeditor.git`
	2.2 `cd cfmtoolbox-webeditor`
3. Create a `compose.yaml` file with the following content:
```yaml
services:
  backend:
    build: backend/Dockerfile
    ports:
      - "3001:8000"
    environment:
      ALLOWED_ORIGINS: '["<your IP or hostname>"]'
  frontend:
    build: frontend/Dockerfile
    ports:
      - "80:3000"
    depends_on:
      - backend
```
4. Start the service using `docker compose up -d`

