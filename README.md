# Assetsment backend Edinael Sanguino
------------
Por favor dirijase a la documentación de los endpoints para conocer el funcionamiento de la API.

## Documentación General
Este cumple con las caracteristicas de una API RestFull para una aplicación de listas de favoritos y cumple con los siguientes requisitos.

#### 1 Usuarios

1.1 Creación de usuarios con email y contraseña para poder usar la API RestFull.
	- El email es obligatorio escribirlo en formato email, ya que cuenta con validación.
	- La contraseña debe ser de minimo 8 caracteres y debe estar formada por numeros, caracteres numericos, letras minusculas y letras mayusculas o caracteres especiales.
	- La creación correcta del usuario, crea un token para poder realizar acciones dentro de la API, sin este token, no tiene acceso a ningún endpoint y no podrá ejecutar ninguna petición.

1.2 Login del usuario con a la API.
	- El usuario podra iniciar sesión mientras tenga una cuenta, deberá ingresar su usuario y contraseña de forma correcta para que se le sea asignado un token y pueda tener acceso a las peticiones.
	- El token generado debe ser ingresado en las cabeceras de la petición con el nombre 'x-token'.
	- La aplicación cuenta con la validación del token, por lo que si se ingresa un token incorrecto, no se podrá ejecutar ninguna petición y saldrá error en el sistema.

1.3 modelo usuarios
-  **Registrar un usuario** Le permitirá al usuario guardar su correo y contraseña de la aplicación para poder acceder y realizar peticiones. Debe realizar una petición de tipo **POST** a la dirección *http://localhost:8080/auth/register* y enviar al body de la pertición su usuario y contraseña en formato JSON.
```json
{
	"email": "test@example.com",
	"password": "123456Aa"
}
```
Una vez registrado el usuario, se le asignará un token que le permitirá realizar las peticiones.

- ** Inicio de sesión de un usuario** Le permitirá al usuario ingresar de forma valida a la aplicación API. Debe realizar una petición de tipo **POST** a la dirección *http://localhost:8080/auth/login* y enviar al body de la pertición su usuario y contraseña en formato JSON con los que se registró anteriormente.
```json
{
	"email": "test@example.com",
	"password": "123456Aa"
}
```
Una vez registrado el usuario, se le asignará un token que le permitirá realizar las peticiones.

- **Obtener todos los usuarios guardados de la colección users en la base de datos** Para obtener todos los usuarios de la base de datos, se debe hacer una petición de tipo **GET** a la dirección *http://localhost:8080/auth*, la respuesta recibida vendrá sin la contraseña el usuario y se verá de la siguiente forma.
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

- **Obtener un solo usuario de la colección users en la base de datos por su id** Para obtener un solo usuario de la base de datos, se debe hacer una petición de tipo **GET** a la dirección *http://localhost:8080/auth/:id*, la respuesta recibida vendrá sin la contraseña el usuario y se verá de la siguiente forma.
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

- **Eliminar usuario de la base de datos** Para eliminar un usuario de la base de datos, se debe realizar una petición **DELETE** a la dirección *http://localhost:8080/auth/:id* con el id del usuario. Es importante aclarar que no se puede eliminar un usuario si no hay token o si el token que se encuentra en la cabera no le pertenece al usuario que se está eliminando, por lo que un usuario no puede eliminar a otro usuario.
Al eliminar un usuario de la base de datos, se elimina junto con él, las listas de favoritos y favoritos creados por este usuario en cascada. Para realizar esta petición, es necesario tener el token generado para el usuario en la cabecera de la petición (header) con el nombre 'x-token'.


#### 2 Lista de favoritos
