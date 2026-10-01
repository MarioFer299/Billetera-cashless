    # Módulo 10: Billetera Cashless - Festival Picnic 2026

    API REST del módulo de billetera cashless para el Festival Picnic 2026. Permite registrar recargas y consumos, consultar movimientos y obtener el saldo de un asistente.

    ## Instalación

    ```powershell
    npm install
    Copy-Item .env.example .env
    ```

    Configura en `.env` la conexión PostgreSQL entregada por el docente:

    ```env
    DATABASE_URL="postgresql://USUARIO:CONTRASENA@HOST:5432/NOMBRE_BASE?schema=public"
    PORT=3000
    ```

    La base de datos es compartida. Para sincronizar el esquema usa únicamente:

    ```powershell
    npm run sync
    ```

    No ejecutes `prisma migrate` ni `prisma db push`.

    ## Ejecución

    ```powershell
    npm run dev
    ```

    La API queda disponible en `http://localhost:3000`.

    ## Endpoints

    - `GET /api/movimientos?page=1&limit=10&asistente_id=1&tipo=RECARGA`
    - `GET /api/movimientos/:id`
    - `POST /api/movimientos`
    - `PATCH /api/movimientos/:id`
    - `DELETE /api/movimientos/:id`
    - `GET /api/billeteras/:asistenteId/saldo`

    ## Regla de negocio: saldo nunca negativo

    El saldo es la suma de las recargas activas menos la suma de los consumos activos. Un consumo que supere el saldo actual responde `409` y no se guarda. Además, anular una recarga se rechaza con `409` si dejaría el saldo por debajo de cero.

    Estas reglas están en `src/application/usecases/RegistrarMovimientoUseCase.ts` y `src/application/usecases/EliminarMovimientoUseCase.ts`. El repositorio solo consulta y persiste datos; los controladores reciben la petición, delegan al caso de uso y responden.

    ## Arquitectura

    - `domain/`: interfaces de repositorio.
    - `application/`: casos de uso y reglas de negocio.
    - `infrastructure/`: Prisma y PostgreSQL.
    - `interface/`: rutas y controladores HTTP.
    # Módulo 10: Billetera Cashless - Festival Picnic 2026

## 👥 Integrantes y Roles
- **Nombre 1** ([@usuario1](https://github.com/usuario1)): Casos de uso y reglas de negocio (Application).
- **Nombre 2** ([@usuario2](https://github.com/usuario2)): Implementación de repositorios y conexión a BD (Infrastructure).
- **Nombre 3** ([@usuario3](https://github.com/usuario3)): Controladores, rutas y validaciones de entrada (Interface).
- **Nombre 4** ([@usuario4](https://github.com/usuario4)): Pruebas, README y coordinación de Git.

## 🚀 Instalación y Ejecución
1. Clonar el repositorio: `git clone https://github.com/MarioFer299/Billetera-cashless.git`
2. Instalar dependencias: `npm install`
3. Copiar el archivo de entorno: `cp .env.example .env`
4. Configurar la variable `DATABASE_URL` en el `.env` con la conexión proporcionada por el docente.
5. Sincronizar con la base de datos compartida (¡NUNCA usar migrate!): `npm run sync`
6. Iniciar el servidor en modo desarrollo: `npm run dev`

## 🧠 Regla de Negocio Explicada: "Saldo nunca en negativo"
**¿Qué valida?**  
El sistema debe garantizar que un asistente no pueda realizar un consumo si el monto a descontar es superior a su saldo actual. El saldo final nunca puede ser menor a cero.

**¿En qué archivo está?**  
Esta lógica reside estrictamente en la capa de aplicación, específicamente en el archivo `src/application/usecases/RegistrarConsumoUseCase.ts` (o el nombre que le hayas dado). El caso de uso primero consulta el saldo total del asistente sumando sus movimientos, y si `saldo_actual - monto_consumo < 0`, lanza un error de negocio antes de llamar al repositorio.

**¿Cómo la probamos?**  
1. Se registra una recarga de $50.000 para el asistente ID 1.
2. Se intenta registrar un consumo de $60.000 para el mismo asistente.
3. La API debe responder con un estado HTTP 400 (Bad Request) y un mensaje de error claro como "Saldo insuficiente para realizar esta transacción", sin llegar a guardar el movimiento en la base de datos.