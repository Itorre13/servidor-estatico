const {createServer} = require("http");
const {createReadStream,stat} = require("fs");

function contentType(extension){ // función que recibe una extension y retorna un contentType. Para que cada vez que llegue una petición al servidor quiero coger la url y de acuerdo a lo que diga revisar si ese fichero existe en la carpeta público: si existe se lo vamos a servir y si no existe vamos a responder con un 404
    if(extension == "html") return "text/html"; // si extension es igual a un html retorna un contentType text/html
    if(extension == "css") return "text/css"; // si extension es igual a un css retorna un contentType text/css
    if(extension == "js") return "text/javascript"; // si extension es igual a un js retorna un contentType text/javascript
    if(extension == "jpg" || extension == "jpeg" ) return "image/jpeg"; // si extension es igual a un jpg o jpeg retorna un contentType image/jpeg
    if(extension == "png") return "image/png"; // si extension es igual a un png retorna un contentType image/png
    if(extension == "json") return "application/json"; // si extension es igual a un json retorna un contentType application/json
    return "text/plain"; // si ninguna de las anteriores se logró retornaremos texto plano
}

function servirFichero(respuesta,ruta,tipo,status){ // creamos otra función que recibe una respuesta, la ruta del fichero que vamos a servir, el tipo de contenido y por último el status
    respuesta.writeHead(status, { "Content-type" : tipo }); // la respuesta le vamos a escribir su cabecera en la que le pondremos su status y el content-type tipo --> el que sea que entre en la función

    let fichero = createReadStream(ruta); // creamos una variable llamada fichero que será igual a crear un flujo de lectura del fichero que está en esa ruta

    fichero.pipe(respuesta); // quiero que este fichero fluyan sus datos en la respuesta

    fichero.on("end", () => { // cuando termines de fluir (end) invoca este callback
        respuesta.end(); // en el que presionamos enter en la respuesta para que viaje al cliente. Enviamos la respuesta al cliente
    });

}

const servidor = createServer((peticion,respuesta) => {
    if(peticion.url == "/"){ // si la url de la peticion es igual a barrita quiero servir el index
        servirFichero(respuesta,"./publico/index.html",contentType("html"),200); // serviremos el index que está en nuestra ruta al index.html, el content-type en html y un status 200 de que todo salió ok
    }else{ // si no haz esto otro
        let ruta = "./publico" + peticion.url; // creamos una variable que llamaremos ruta que será igual a nuestra carpeta conquetenada a peticion.url --> así tendremos la ruta 'completa'

        stat(ruta, (error,info) => { // stat verifica si existe y cnd acabe pasará un error o la información del fichero
            if(!error && info.isFile()){ // si no da error y la información es un fichero haz lo siguiente --> podría ser un fichero o un directorio
                return servirFichero(respuesta,ruta,contentType(ruta.split(".").pop()),200); // retorna servirFichero con la respuesta, la ruta y el contentType con lo que está al final de esa ruta separada por puntitos, y por último un status 200 diciendo que el fichero existe
            }
            servirFichero(respuesta,"./404.html",contentType("html"),404); // si no hemos entrado en ese if serviremos el fichero utilizando la respuesta, con el 404.html, el contentType será el html y el status será 404.
        });
    }
});

servidor.listen(process.env.PORT || 3000); // el servidor escucha en process.env.PORT es donde render guarda el puerto que el nos asigna o en el puerto 3000