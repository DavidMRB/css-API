# Todo App - HTML + CSS + JavaScript

Proyecto 1: Aplicación de gestión de tareas (Todo App) desarrollada con HTML, CSS puro y JavaScript vanilla, que consume una API REST.

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados con diseño responsive
- **JavaScript (ES6+)**: Lógica de la aplicación y consumo de API
- **Fetch API**: Para las peticiones HTTP
- **Nginx**: Servidor web para Docker

## 📋 Funcionalidades

La aplicación implementa las operaciones CRUD completas:

- ✅ **GET** - Listar todos los todos
- ✅ **GET by ID** - Consultar un todo específico
- ✅ **POST** - Crear nuevos todos
- ✅ **PUT** - Actualizar todos existentes
- ✅ **DELETE** - Eliminar todos

### Características Adicionales

- Sistema de prioridades (Baja, Media, Alta)
- Marcar tareas como completadas
- Fechas de vencimiento
- Diseño responsive (móvil, tablet, desktop)
- Validación de formularios
- Manejo de errores
- Modal de edición

## 🌐 API

**Base URL**: `https://todoapitest.juansegaliz.com`

**Documentación**: [Swagger](https://todoapitest.juansegaliz.com/swagger/index.html)

## 📦 Estructura del Proyecto

```
proyecto-1-html-css-js/
├── index.html              # Aplicación completa (HTML + CSS + JS)
├── Dockerfile             # Configuración de Docker
├── docker-compose.yml     # Build y run local
├── docker-compose-run.yml # Run desde DockerHub
└── README.md             # Documentación
```

## 🐳 Instalación y Uso

### Opción 1: Ejecutar localmente (sin Docker)

Simplemente abre el archivo `index.html` en tu navegador.

### Opción 2: Docker Build Local

```bash
# Construir y ejecutar con docker-compose
docker-compose up --build

# La aplicación estará disponible en http://localhost:8080
```

### Opción 3: Ejecutar desde DockerHub

```bash
# Ejecutar desde imagen publicada
docker-compose -f docker-compose-run.yml up

# La aplicación estará disponible en http://localhost:8080
```

### Opción 4: Docker manual

```bash
# Construir imagen
docker build -t tu-usuario/todo-app-html-css-js:latest .

# Ejecutar contenedor
docker run -d -p 8080:80 --name todo-app tu-usuario/todo-app-html-css-js:latest

# Acceder a la aplicación
# http://localhost:8080
```

## 🔨 Comandos útiles

```bash
# Ver logs del contenedor
docker-compose logs -f

# Detener la aplicación
docker-compose down

# Reconstruir sin caché
docker-compose build --no-cache

# Verificar contenedores en ejecución
docker ps
```

## 📤 Publicar en DockerHub

```bash
# 1. Login en DockerHub
docker login

# 2. Construir la imagen
docker build -t tu-usuario/todo-app-html-css-js:latest .

# 3. Subir a DockerHub
docker push tu-usuario/todo-app-html-css-js:latest
```

## 🎨 Diseño Responsive

La aplicación se adapta a diferentes tamaños de pantalla:

- **Desktop**: > 1024px - Diseño completo con todas las funcionalidades
- **Tablet**: 768px - 1024px - Layout optimizado
- **Mobile**: < 768px - Diseño vertical con botones adaptados
- **Mobile Small**: < 480px - Optimización para pantallas pequeñas

## 📸 Capturas de Pantalla

*(Agrega aquí tus propias capturas de pantalla para el reporte)*

## 👤 Autor

**[Tu Nombre]**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- DockerHub: [tu-usuario](https://hub.docker.com/u/tu-usuario)

## 📄 Licencia

Este proyecto fue desarrollado como parte de un proyecto académico.

## 🔗 Enlaces

- **Repositorio GitHub**: [https://github.com/tu-usuario/todo-app-html-css-js](https://github.com/tu-usuario/proyecto)
- **DockerHub**: [https://hub.docker.com/r/tu-usuario/todo-app-html-css-js](https://hub.docker.com/r/tu-usuario/imagen)
- **API Documentation**: [https://todoapitest.juansegaliz.com/swagger/index.html](https://todoapitest.juansegaliz.com/swagger/index.html)