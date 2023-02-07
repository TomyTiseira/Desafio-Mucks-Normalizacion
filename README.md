# Chat con Websocket

Añadir al proyecto un canal de chat entre clientes y el servidor.

Para inicializar la base de datos hacerlo mediante el comando:

```
npm run initDb
```

## Aspectos a incluir :

- En la parte inferior del formulario de ingreso se presentará el centro de mensajes almacenados en el servidor, donde figuren los mensajes de todos los usuarios identificados por su email.
- El formato a representar será: email (texto negrita en azul) [fecha y hora (DD/MM/YYYY HH:MM:SS)] (texto normal en marrón) : mensaje (texto italic en verde).

# Mocks

Crear una vista en forma de tabla que consuma desde la ruta ‘/api/productos-test’ del servidor una lista con 5 productos generados al azar utilizando Faker.js como generador de información aleatoria de test (en lugar de tomarse desde la base de datos). Elegir apropiadamente los temas para conformar el objeto ‘producto’ (nombre, precio y foto).

# Normalización

Reformar el formato de los mensajes y la forma de comunicación del chat (centro de mensajes).
El nuevo formato de mensaje será:

```json
{
  "author": {
    "id": "mail del usuario",
    "nombre": "nombre del usuario",
    "apellido": "apellido del usuario",
    "edad": "edad del usuario",
    "alias": "alias del usuario",
    "avatar": "url avatar (foto, logo) del usuario"
  },
  "text": "mensaje del usuario",
  "date": "fecha del mensaje",
  "id": "id del mensaje"
}
```

## Aspectos a incluir en el entregable

- Modificar la persistencia de los mensajes para que utilicen un contenedor que permita guardar objetos anidados (archivos, mongodb, firebase).
- El mensaje se envía del frontend hacia el backend, el cual lo almacenará en la base de datos elegida. Luego cuando el cliente se conecte o envie un mensaje, recibirá un array de mensajes a representar en su vista.
- El array que se devuelve debe estar normalizado con normalizr, conteniendo una entidad de autores. Considerar que el array tiene sus autores con su correspondiente id (mail del usuario), pero necesita incluir para el proceso de normalización un id para todo el array en su conjunto (podemos asignarle nosotros un valor fijo).
  Ejemplo: { id: ‘mensajes’, mensajes: [ ] }
- El frontend debería poseer el mismo esquema de normalización que el backend, para que este pueda desnormalizar y presentar la información adecuada en la vista.
- Cambiar el nombre del id que usa normalizr por el email del autor, agregando un tercer parametro a la función schema.Entity, por ejemplo:

```javascript
const schemaAuthor = new schema.Entity('author',{...},{idAttribute: 'email'});
```

- Presentar en el frontend (a modo de test) el porcentaje de compresión de los mensajes recibidos. Puede ser en el título del centro de mensajes.
