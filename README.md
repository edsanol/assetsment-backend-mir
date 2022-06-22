# Assetsment backend Edinael Sanguino
------------
Por favor dirijase a la documentación de los endpoints para conocer el funcionamiento de la API.

## Documentación General
Este proyecto cumple con las caracteristicas de una API RestFull para una aplicación de listas de favoritos. Esta aplicación back end fue desarrollada en node.js con express para crear el servidor, bcrypt para la encriptación de las contraseñas, JWT para la generación de tokens de autenticación, mongoose para realizar las consultas a la base de datos, MongoDB como base de datos, mongo atlas como daas para la base de datos MongoDB y la aplicación fue desarrollada en el lenguaje TypeScript. La aplicación también cuenta con test unitarios realizados con las liberias de Jest y Supertest.

Cada campo que recibe la aplicación para ser almacenada en la base de datos cuenta con validaciones para solo almacenar el tipo y formato correcto de los datos entrantes, todas las validaciones fueron hechas en TypeScript de forma manual y no se usaron librerias de validaciones como express-validator o las validaciones que vienen con mongoose por motivos estrictamente educativos para familiarizarme con el lenguaje de TypeScript.

Cada modelo de las colecciones debe cumplir con un tipado de datos estricto y todos los datos son obligatorios, el tipado de los modelos se muestran a continuación.

```javascript
// Modelo de usuarios
export interface UserEntry extends Document {
  id: string
  email: string
  password: string
  lists: listModel[]
  createdAt: Date | string
  updatedAt: Date | string
}

// Modelo de listas
export interface listModel extends Document {
  id: string
  userId: string
  name: string
  favs: favsModel[]
  createdAt: Date | string
  updatedAt: Date | string
}

// Modelo de favoritos
export interface favsModel extends Document {
  id: string
  listId: string
  userId: string
  title: string
  description: string
  url: string
  createdAt: Date | string
  updatedAt: Date | string
}
```

#### Test

Los resultados de los test realizados a la aplicación muestraron los siguientes resultados.

[![test-assetsment.png](https://i.postimg.cc/3RVLLcBT/test-assetsment.png)](https://postimg.cc/Hc04n3RZ)

------------

## Ejecución de la aplicación

Para utilizar esta API, puede clonar el repositorio con el comando `git clone https://github.com/edsanol/assetsment-backend-mir.git`, en seguida ejecute el código `npm install` desde la terminal, ubicado en la carpeta en donde clonó este repositorio.

Si desea ejecutar la aplicación en modo de desarrollo utilice la instrucción `npm run dev`, este comando ejecuta la aplicación transpilando directamente el código de TypeScript, si desea ejecutar la aplicación en modo de producción ejecute primeramente la instrucción `npm run tsc`, esta instrucción transpilará todo el código TypeScript a JavaScript y lo guardará en la carpeta *build* y a continuación, podrá ejecutar el comando `npm start` para que se ejecute la aplicación directamente desde JavaScript.

Por ultimo, si desea ejecutar los test puede usar el comando `npm run test` y si desea ejecutar los test y mostrar en la consola los resultados obtenidos y los porcentajes de código testeado ejecute la instrucción `npm run test:coverage`

------------

## Documentación de la funcionalidad de la aplicación


## 1. Usuarios

1.1 Creación de usuarios con email y contraseña para poder usar la API RestFull.
- El email es obligatorio escribirlo en formato email, ya que cuenta con validación y debe ser de tipo string, de lo contrario saltará el siguiente error `the email format is incorrect`
- La contraseña debe ser de minimo 8 caracteres y debe estar formada por numeros, caracteres numericos, letras minusculas y letras mayusculas o caracteres especiales y además, la contraseña ingresado debe ser de tipo string, de lo contrario, saltará el error de la validación con el siguiente mensaje `the password format is incorrect`
- La creación correcta del usuario, crea un token para poder realizar acciones dentro de la API, sin este token, no tiene acceso a ningún endpoint y no podrá ejecutar ninguna petición.

1.2 Login del usuario con a la API.
- El usuario podra iniciar sesión mientras tenga una cuenta, deberá ingresar su usuario y contraseña de forma correcta y como tipo de dato string para que se le sea asignado un token y pueda tener acceso a las peticiones.
- El token generado debe ser ingresado en las cabeceras de la petición con el nombre 'x-token'.
- La aplicación cuenta con la validación del token, por lo que si se ingresa un token incorrecto, no se podrá ejecutar ninguna petición y saldrá error en el sistema.

1.3 modelo usuarios

### - Registrar un usuario:

Le permitirá al usuario guardar su correo y contraseña de la aplicación para poder acceder y realizar peticiones. Debe realizar una petición de tipo **POST** a la dirección *http://localhost:8080/auth/register* y enviar al body de la pertición su usuario y contraseña en formato JSON.
```json
{
	"email": "test@example.com",
	"password": "123456Aa"
}
```
Una vez registrado el usuario, se le asignará un token que le permitirá realizar las peticiones.

### - ***Inicio de sesión de un usuario:***
Le permitirá al usuario ingresar de forma valida a la aplicación API. Debe realizar una petición de tipo **POST** a la dirección *http://localhost:8080/auth/login* y enviar al body de la pertición su usuario y contraseña en formato JSON con los que se registró anteriormente.
```json
{
	"email": "test@example.com",
	"password": "123456Aa"
}
```
Una vez registrado el usuario, se le asignará un token que le permitirá realizar las peticiones.

### - ***Obtener todos los usuarios guardados de la colección users en la base de datos:*** 
Para obtener todos los usuarios de la base de datos, se debe hacer una petición de tipo **GET** a la dirección *http://localhost:8080/auth*, si la respuesta es correcta y con status *200* la respuesta recibida vendrá sin la contraseña el usuario y se verá de la siguiente forma.
```json
{
    "ok": true,
    "message": "Users found",
    "data": [
        {
            "email": "test1@test.com",
            "lists": [
                {
                    "userId": "62b11c73a4baa524b962bdf9",
                    "name": "movies",
                    "favs": [
                        "62b29fcaa429e3e73dff1f80"
                    ],
                    "id": "62b11cd7a4baa524b962be02"
                }
            ],
            "id": "62b11c73a4baa524b962bdf9"
        },
        {
            "email": "test3@test.com",
            "lists": [],
            "id": "62b2230c1ffa1077543182a9"
        }
    ]
}
```

### - ***Obtener un solo usuario de la colección users en la base de datos por su id:***
Para obtener un solo usuario de la base de datos, se debe hacer una petición de tipo **GET** a la dirección *http://localhost:8080/auth/:id*, si la respuesta es correcta y con status *200* la respuesta recibida vendrá sin la contraseña y el usuario y se verá de la siguiente forma.
```json
{
    "ok": true,
    "message": "User found",
    "data": {
        "email": "test1@test.com",
        "lists": [
            {
                "name": "movies",
                "favs": [
                    "62b29fcaa429e3e73dff1f80"
                ],
                "id": "62b11cd7a4baa524b962be02"
            }
        ],
        "createdAt": "2022-06-21T01:18:43.397Z",
        "updatedAt": "2022-06-21T01:20:23.444Z",
        "id": "62b11c73a4baa524b962bdf9"
    }
}
```
Para realizar esta petición, es necesario tener el token generado para el usuario en la cabecera de la petición (header) con el nombre 'x-token'.
[![cap-token.png](https://i.postimg.cc/hPqjmZdB/cap-token.png)](https://postimg.cc/5jnbd3g7)

### - ***Eliminar usuario de la base de datos:*** 
Para eliminar un usuario de la base de datos, se debe realizar una petición **DELETE** a la dirección *http://localhost:8080/auth/:id* con el id del usuario. Es importante aclarar que no se puede eliminar un usuario si no hay token o si el token que se encuentra en la cabera no le pertenece al usuario que se está eliminando, por lo que un usuario no puede eliminar a otro usuario.
Al eliminar un usuario de la base de datos, se elimina junto con él, las listas de favoritos y favoritos creados por este usuario en cascada. Para realizar esta petición, es necesario tener el token generado para el usuario en la cabecera de la petición (header) con el nombre 'x-token'.


------------




## 2. Lista de favoritos

La lista de favoritos, será una lista creada por el usuario que le permitirá guardar sus favoritos de forma clasificada, esto le ayudará a acceder a sus favoritos por categorias y de forma ordenada. La lista de favoritos cuenta con las llaves de name, userId y favs[]. userId referencia a la colección de usuarios con la colección de listas y favs[] referencia la colección de listas con la colección de favoritos.

2.1 modelo de listas de favoritos

### - ***Crear lista de favoritos:***
Para crear una lista de favoritos se debe hacer una petición de tipo **POST** a la dirección *http://localhost:8080/api/list* y debe enviar en el body de la petición el nombre que quiere darle a la lista de favoritos de tipo string como se muestra en el siguiente JSON.
```json
{
    "name": "movies"
}
```
Si ha cumplido con los requerimientos y las validaciones de los campos han pasado correctamente y el status es *200*, se devolverá un mensaje en formato JSON con la siguiente información.
```json
{
    "ok": true,
    "message": "User created",
    "data": {
        "userId": "62b11c73a4baa524b962bdf9",
        "name": "movies",
        "favs": [],
        "createdAt": "2022-06-22T16:32:21.372Z",
        "updatedAt": "2022-06-22T16:32:21.372Z",
        "id": "62b344156b0e9fa74c19cac6"
    }
}
```
Si el nombre ingresado no cumple con las validaciones, la aplicación responderá con el siguiente mensaje. `the name format is incorrect` y el status será *404*.

El userId con el que se referencia al usuario que ha creado la colección de listas de favoritos se obtiene del token de autenticación que debe ser ingresado en la cabecera de la petición con el nombre 'x-token'. si no se envía token en la petición, la aplicación responderá con el mensaje `No token provided` y si el token es invalido, responderá con el mensaje `Invalid token` y el status será *404*.

### - ***Obtener todas las listas de favoritos por usuario:***
El usuario podrá solicitar todas la listas de favoritos creadas por el y no todas las listas de favoritos de la base de datos, se penso de esta manera para brindar mayor privacidad y no poder acceder a listas que no le pertenecen. Para realizar esta solicitud, se debe hacer una petición de tipo **GET** a la dirección *http://localhost:8080/api/list* y tener en la cabecera de la petición su token, el sistema responderá con todas las listas creadas por este usuario obteniendo el id del usuario del token suministrado, si no se envía token en la petición, la aplicación responderá con el mensaje `No token provided` y si el token es invalido, responderá con el mensaje `Invalid token` y en ambos casos el status será *404*. Si la petición es correcta, la aplicación responderá con el siguiente JSON.
```json
{
    "ok": true,
    "message": "List founded",
    "data": [
        "62b11cd7a4baa524b962be02",
        "62b344156b0e9fa74c19cac6"
    ]
}
```

### - ***Obtener la lista de favoritos por su id por usuario:***
Por privacidad, el usuario solo podrá realizar esta petición para traer sus listas creadas, si intenta obtener una lista por su id que no ha sido creada por él, saltará el siguiente mensaje `Invalid user` y devolverá un status *404*. Para realizar esta solicitud, se debe hacer una petición de tipo **GET** a la dirección *http://localhost:8080/api/list/:id* donde el id corresponderá al id de la lista a la que se quiere acceder y tener en la cabecera de la petición su token, el sistema responderá con la lista solicitada por este usuario obteniendo el id del usuario del token suministrado, si no se envía token en la petición, la aplicación responderá con el mensaje `No token provided` y si el token es invalido, responderá con el mensaje `Invalid token` y en ambos casos el status será *404*. Si la petición es correcta y el status es *200*, la aplicación responderá con el siguiente JSON.
```json
{
    "ok": true,
    "message": "List found",
    "data": {
        "userId": "62b11c73a4baa524b962bdf9",
        "name": "movies",
        "favs": [
            {
                "title": "Batman vs Superman",
                "description": "Fiction",
                "url": "url",
                "id": "62b29fcaa429e3e73dff1f80"
            }
        ],
        "createdAt": "2022-06-21T01:20:23.347Z",
        "updatedAt": "2022-06-22T04:51:22.302Z",
        "id": "62b11cd7a4baa524b962be02"
    }
}
```
### - ***Eliminar una lista de favoritos por su id por usuario:***
Por seguridad, el usuario solo podrá realizar esta petición para eliminar sus listas, si intenta eliminar una lista que no ha sido creada por él, saltará el siguiente mensaje `list not found` y devolverá un status *404*. Para realizar esta solicitud, se debe hacer una petición de tipo **DELETE** a la dirección *http://localhost:8080/api/list/delete/:id* donde el id corresponderá al id de la lista a la que se quiere acceder y tener en la cabecera de la petición su token, el sistema responderá con la lista solicitada por este usuario obteniendo el id del usuario del token suministrado, si no se envía token en la petición, la aplicación responderá con el mensaje `No token provided` y si el token es invalido, responderá con el mensaje `Invalid token`.

Cuando se elimine una lista de favoritos, se eliminará junto con ella todos los favoritos relacionados al documento eliminado en cascada y se eliminará el id de esta lista de favoritos del array lists del usuario.

------------



## 3. Favoritos
Los favoritos son una colección en donde el usuario podrá crear sus favoritos agregandolos a una colección de lista de favoritos para clasificar de forma adecuada sus favoritos. La colección de favoritos cuenta con los siguientes campo: listId, UserId, title, description y url. Todos estos campos cuentan con la validación de ser campos de tipo string, si no se cumple con esta validación, saltará el siguiente mensaje de error. `the format is incorrect`.

3.1 modelo de listas de favoritos

### - ***Crear favoritos:***

Para crear un favorito, se debe realizar una petición de tipo **POST** a la dirección *http://localhost:8080/api/favs* y debe enviar en el body de la petición un JSON con la siguiente información de ejemplo.
```json
{
    "listId": "62b11cd7a4baa524b962be02",
    "title": "Batman vs Superman",
    "description": "Fiction",
    "url": "url"
}
```
Si ha cumplido con los requerimientos, las validaciones de los campos han pasado correctamente y el status es *200*, se devolverá un mensaje en formato JSON con la siguiente información.
```json
{
    "ok": true,
    "message": "Favs created",
    "data": {
        "listId": "62b11cd7a4baa524b962be02",
        "title": "Shutter Island",
        "description": "Thriller",
        "url": "url",
        "createdAt": "2022-06-22T17:14:06.401Z",
        "updatedAt": "2022-06-22T17:14:06.401Z",
        "id": "62b34dde53bcb72983978a62"
    }
}
```
El userId con el que se referencia al usuario que ha creado la colección de favoritos se obtiene del token de autenticación que debe ser ingresado en la cabecera de la petición con el nombre 'x-token'. si no se envía token en la petición, la aplicación responderá con el mensaje `No token provided` y si el token es invalido, responderá con el mensaje `Invalid token`.

### - ***Obtener todos los favoritos por usuario:***
El usuario podrá acceder a todos los favoritos creados por él y por lista de favoritos pasando el id de la lista por parametro. Para realizar esta solicitud, se debe hacer una petición de tipo **GET** a la dirección*http://localhost:8080/api/favs/:id* pasando el id de la lista de favoritos como parametro en la ruta, en este caso la lista de favoritos de movies. Si la petición es correcta y el status es *200*, la aplicación responderá con un JSON similar al que se muestra a continuación de ejemplo.
```json
{
    "ok": true,
    "message": "Favs found",
    "data": [
        {
            "title": "Batman vs Superman",
            "description": "Fiction",
            "url": "url",
            "id": "62b29fcaa429e3e73dff1f80"
        },
        {
            "title": "Shutter Island",
            "description": "Thriller",
            "url": "url",
            "id": "62b34dde53bcb72983978a62"
        }
    ]
}
```
El userId con el que se referencia al usuario que ha creado la colección de favoritos se obtiene del token de autenticación que debe ser ingresado en la cabecera de la petición con el nombre 'x-token'. si no se envía token en la petición, la aplicación responderá con el mensaje `No token provided` y si el token es invalido, responderá con el mensaje `Invalid token` y devolverá un status *404*.

### - ***Obtener los favoritos por id por usuario:***
El usuario podrá acceder a un favorito por su id, mientras este haya sido creado por el, para realizar esta solicitud, el usuario deberá hacer una petición de tipo **GET** a la direccíon *http://localhost:8080/api/favs/search/:id* ingresando el id del favorito como parametro y enviando en el body de la petición el id de la lista de favoritos al que pertenece este favorito. 
```json
{
    "listId": "62b11cd7a4baa524b962be02"
}
```
Si la petición es correcta y su status es *200*, la aplicación responderá con un JSON similar al mostrado a continuación como ejemplo.
```json
{
    "ok": true,
    "message": "Fav founded",
    "data": {
        "listId": "62b11cd7a4baa524b962be02",
        "title": "Batman vs Superman",
        "description": "Fiction",
        "url": "url",
        "createdAt": "2022-06-22T04:51:22.201Z",
        "updatedAt": "2022-06-22T04:51:22.201Z",
        "id": "62b29fcaa429e3e73dff1f80"
    }
}
```
El userId con el que se referencia al usuario que ha creado la colección de favoritos se obtiene del token de autenticación que debe ser ingresado en la cabecera de la petición con el nombre 'x-token'. si no se envía token en la petición, la aplicación responderá con el mensaje `No token provided` y si el token es invalido, responderá con el mensaje `Invalid token` y devolverá un status *404*.

### - ***Eliminar favorito por su id por usuario:***

Por seguridad, el usuario solo podrá eliminar sus favoritos y no los favoritos creados por otro usuario, esta validación se realiza con el token del usuario. Para realizar esta solicitud, se debe hacer una petición de tipo **DELETE** a la dirección *http://localhost:8080/api/favs/delete/:id* y pasar como parametro el id del favorito que desea eliminar. Si la petición es correcta y responde con un status *200* se eliminará este documento de la colección de favoritos y se eliminará su id del campo favs de la colección de lista de favoritos en cascada.

El userId con el que se referencia al usuario que ha creado la colección favoritos se obtiene del token de autenticación que debe ser ingresado en la cabecera de la petición con el nombre 'x-token'. si no se envía token en la petición, la aplicación responderá con el mensaje `No token provided` y si el token es invalido, responderá con el mensaje `Invalid token` y devolverá un status *404*.


------------


