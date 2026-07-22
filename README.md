# labs.home-finances.view.portal.angular

SPA Angular del portal Home Finances.

## Desarrollo con Dev Container

No hace falta tener Node ni Angular instalados en el host.

1. Abrí esta carpeta en VS Code o Cursor.
2. Ejecutá **Dev Containers: Reopen in Container**.
3. Esperá a que termine `postCreateCommand` (`npm install`).
4. Arrancá el server con `ng serve`, `npm start` o la task **ng serve**.
5. Abrí [http://localhost:4200](http://localhost:4200).

El contenedor usa Node 22, cachea npm en un volumen Docker y reenvía el puerto `4200`.
La CLI (`ng`) queda disponible vía `node_modules/.bin` (se agrega al `PATH` del contenedor tras `npm install`).
