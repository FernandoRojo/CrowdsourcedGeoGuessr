docker run -p 5000:5000 --rm --detach --name geo-server crowdsourced-geoguesser;
docker run -p 5001:3001 --rm --detach --name index-client cg-supportindexer-client;
#docker kill geo-client ; ./client/build.ps1 ; docker run -p 3000:3000 --rm --name geoclient geo-client;
docker kill geo-server ; ./build.ps1 ; docker run -p 5000:5000 --rm --name geo-server crowdsourced-geoguesser;