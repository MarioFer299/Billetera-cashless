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