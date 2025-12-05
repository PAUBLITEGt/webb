# Guía de Despliegue en VPS (DigitalOcean)

## 1. Crear el Droplet en DigitalOcean

1. Ve a https://www.digitalocean.com
2. Crea un Droplet con:
   - **OS:** Ubuntu 22.04 LTS
   - **Plan:** Basic $4-6/mes (1GB RAM, 1 vCPU)
   - **Región:** La más cercana a Guatemala (ej: NYC o SFO)
3. Copia la IP del servidor

## 2. Conectarte al Servidor

```bash
ssh root@TU_IP_DEL_SERVIDOR
```

## 3. Instalar Dependencias

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib

# Instalar PM2 (para mantener la app corriendo)
npm install -g pm2

# Instalar Nginx (para servir la app)
apt install -y nginx
```

## 4. Configurar PostgreSQL

```bash
# Entrar a PostgreSQL
sudo -u postgres psql

# Crear base de datos y usuario
CREATE DATABASE paudronix_db;
CREATE USER paudronix_user WITH ENCRYPTED PASSWORD 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE paudronix_db TO paudronix_user;
\q
```

## 5. Subir el Código

Opción A - Con Git:
```bash
cd /var/www
git clone TU_REPOSITORIO app
cd app
```

Opción B - Con SFTP:
- Usa FileZilla o similar para subir los archivos a `/var/www/app`

## 6. Configurar Variables de Entorno

```bash
cd /var/www/app
nano .env
```

Agregar:
```
DATABASE_URL=postgresql://paudronix_user:tu_contraseña_segura@localhost:5432/paudronix_db
NODE_ENV=production
PORT=3000
```

## 7. Instalar y Construir la App

```bash
npm install
npm run build
npm run db:push
```

## 8. Iniciar con PM2

```bash
pm2 start dist/index.cjs --name "paudronix-app"
pm2 save
pm2 startup
```

## 9. Configurar Nginx

```bash
nano /etc/nginx/sites-available/paudronix
```

Agregar:
```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activar:
```bash
ln -s /etc/nginx/sites-available/paudronix /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 10. Configurar SSL (HTTPS Gratis)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tudominio.com -d www.tudominio.com
```

## 11. Configurar tu Dominio

En el panel de tu registrador de dominio (donde compraste el dominio):
- Crea un registro **A** apuntando a la IP de tu VPS
- Ejemplo: `tudominio.com` -> `123.456.789.0`

## Comandos Útiles

```bash
# Ver logs de la app
pm2 logs paudronix-app

# Reiniciar app
pm2 restart paudronix-app

# Ver estado
pm2 status

# Actualizar código
cd /var/www/app
git pull
npm install
npm run build
pm2 restart paudronix-app
```

## Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```
