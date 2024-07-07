const {createServer} = require("http");
const {createReadStream} = require("fs");

function contentType(extension){
    if(extension == "html") return "text/html";
    if(extension == "css") return "text/css";
    if(extension == "js") return "text/javascript";
    if(extension == "jpg" || extension == "jpeg" ) return "image/jpeg";
    if(extension == "png") return "image/png";
    if(extension == "json") return "application/json";
    return "text/plain";
}

function servirFichero(respuesta,ruta,tipo,status){
    respuesta.writeHead(status, { "Content-type" : tipo });

    let fichero = createReadStream(ruta);

    fichero.pipe(respuesta);

    fichero.on("end", () => {
        respuesta.end();
    });

}

const servidor = createServer((peticion,respuesta) => {
    servirFichero(respuesta,"./publico/index.html",contentType("html"),200);
});

servidor.listen(process.env.PORT || 3000);