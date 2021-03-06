# Notice

**The development of this project is continued in https://github.com/artcom/acms-compose.**

**For the sake of backwards compatibility this repository is archived and set to read-only.**

# Git JSON CMS

This repository provides a `docker-compose` to setup the Git JSON CMS. It creates multiple containers to manage and serve the git content via GIT/HTTP, asset files via WebDav and the [CMS frontend](https://github.com/artcom/git-json-cms-frontend) to easily modify the configuration.

More CMS related details can be found in the [git-json-cms-frontend](https://github.com/artcom/git-json-cms-frontend) repository.

Check the [docker-compose](./docker-compose.yml) file for container setup related details.

## Deployment with Docker

### Requirements
* [Install docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
* [Install docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)

### Deployment
* clone this repository: `git clone https://github.com/artcom/git-json-cms.git`

#### Set up frontend
* download the frontend static files
  ```bash
  wget https://github.com/artcom/git-json-cms-frontend/releases/download/v2.1.0/git-json-cms-frontend-v2.1.0.tar.gz
  tar -xvzf git-json-cms-frontend-v2.1.0.tar.gz -C frontend
  ```
* edit the `frontend/config.json` file
  ```json
  {
    "assetServerUri": "https://<hostname>/asset-server",
    "configServerUri": "https://<hostname>/config-server",
    "cmsConfigPath": "cmsConfig"
  }
  ```

#### Set up HTTPS gateway
* create an `.env` file, available variables are listed in `.env.example`
* edit the `HOST` variable in `.env` with the host name
* edit the `ASSETS` variable in `.env` with the path to the assets directory
* edit the `CERTIFICATE` and `KEY` variables in `.env` with the SSL certificate and key locations
* generate a `dhparam.pem` file
  ```bash
  openssl dhparam -out /path/to/dhparam.pem 2048
  ```
* edit the `DHPARAM` variable in `.env` with the path to the `dhparam.pem` file
* create and setup with docker-compose: `docker-compose -f docker-compose.yml -f docker-compose-gateway.yml up`
  * to detach the process and run `docker-compose` in the background use option `-d`
* use the `--force-recreate` flag when any configurations in `gateway` have changed
* browse to the CMS frontend: `https://<hostname>`

### Set up basic authentication
* create a `.htpasswd` file
```bash
htpasswd -c /path/to/.htpasswd username
```
* edit the `AUTH_FILE` variable in `.env` with the location of the `.htpasswd` file
* deploy with `docker-compose -f docker-compose.yml -f docker-compose-gateway.yml -f docker-compose-basic-auth.yml up`

### Custom gateway
The `docker-compose.yml` file can be used in combination with a custom gateway.

### Unsafe demo with HTTP and no authentication
* download the frontend static files
  ```bash
  wget https://github.com/artcom/git-json-cms-frontend/releases/download/v2.1.0/git-json-cms-frontend-v2.1.0.tar.gz
  tar -xvzf git-json-cms-frontend-v2.1.0.tar.gz -C frontend
  ```
* deploy with `docker-compose --env-file .env.demo -f docker-compose.yml -f docker-compose-gateway-http.yml up`
* the UI can be reached at http://127.0.0.1

## Edit content
The content repository will be set up with some sample data. To replace/alter the content structure you have to edit the JSON files manually:
* `git clone https://<hostname>/content-repo`
* Edit templates and content according to the content repo conventions with your favorite editor.
* Commit and push your changes.
* Reload the CMS.
