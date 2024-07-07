const {createServer} = require("http");
const {createReadStream,stat} = require("fs");

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
    if(peticion.url == "/"){
        servirFichero(respuesta,"./publico/index.html",contentType("html"),200);
    }else{
        let ruta = "./publico" + peticion.url;

        stat(ruta, (error,info) => {
            if(!error && info.isFile()){
                return servirFichero(respuesta,ruta,contentType(ruta.split(".").pop()),200);
            }
            servirFichero(respuesta,"./404.html",contentType("html"),404);
        });
    }
});

servidor.listen(process.env.PORT || 3000);