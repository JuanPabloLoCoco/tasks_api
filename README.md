# tasks_api

Descargue el codigo y ejecute en el directorio raiz

```bash
npm install
```

Para correr testeos

```bash
npm test
```

Para builder la aplicacion

```bash
npm build
```

Para desarrollar la aplicacion

```bash
npm run dev
```

Para correr la aplicacion sin builder

```bash
npm start
```

## Decisiones tomadas e implementadas

Es requerido correr con Node 18. He usado NVM para setear node 18

```bash
nvm use 18
```

Desde un primer momento se ha seteado el proyecto con Node, Typescript y Jest.
Lo primero que se hizo fue setear la configuracion de Express.
Luego empece armando una estructura usando los principios SOLID de Servicios y Repositorios.
Arranque teniendo un repositorio en memoria e implemente todos los metodos. De esta manera,
implementar el repositorio version Firebase seria mucho mas sencillo.

Los testeos son testeos de caja negra usando jest y supertest. Se testean los endpoints con
validaciones.

Las validaciones de los endpoints los realice a mano. Podria haber usado librerias como JOI, pero
opte por no hacerlo dado que eran pocas validaciones. Para no diversificar casos, los mensajes de
error son genericos. Una opcion podria ser que los mensajes tengan distintos tipos de codigo y un
mensaje default en ingles. De esta manera el cliente podria internacionalizar los mensajes.

Como añadidos, se opto por loggear las peticiones con la liberia _morgan_

No he podido setear el firebase emulator suite, por lo tanto he hecho pruebas usando la base de
produccion. Esto es una mala practica, pero a los efectos del ejercio fue lo maximo que pude hacer.

Para correr los testeos con firebase se debe cambiar la linea 9 el path que indicara donde
se encuentra el certificado para correr firebase.

Para setear el repositorio con Firebase se debe descomentar en el archivo test, los campos necesarios y señalar al certificado de Firebase.
