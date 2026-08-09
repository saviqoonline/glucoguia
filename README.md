# GlucoGuía MVP

Aplicación web/mobile-first para seguimiento de diabetes: glucosa, insulina, medicamentos, comidas, recordatorios, historial, reportes y seguridad.

> Importante: esta versión **no calcula dosis de insulina**, **no diagnostica** y **no reemplaza el criterio médico**. Está pensada como diario, recordatorio y generador de reportes.

## Funciones incluidas

- Dashboard con resumen del día.
- Registro de glucosa en mg/dL con contexto, síntomas y notas.
- Registro de insulina con tipo, dosis aplicada, hora y zona de aplicación.
- Registro de medicamentos.
- Registro básico de comidas.
- Historial tipo línea de tiempo con filtros.
- Reporte imprimible o guardable como PDF desde el navegador.
- Exportación JSON de respaldo.
- Recordatorios internos.
- Perfil del paciente con rango objetivo, médico y contacto de emergencia.
- Pantalla de seguridad con límites del producto y texto base de consentimiento.

## Dónde se guardan los datos

La aplicación es **100% estática y sin backend**. Todo el estado se guarda en
`localStorage` del navegador, bajo la clave `glucoguia-state-v1`.

Esto implica que los datos no salen del dispositivo, pero tampoco se sincronizan
entre navegadores ni equipos, y se pierden si se limpia el almacenamiento del
navegador. Usa la exportación JSON como respaldo.

## Cómo correrlo

```bash
npm install
npm run dev
```

Luego abre la URL que muestre Vite, normalmente:

```bash
http://localhost:5173
```

> No abras `index.html` con Live Server (por ejemplo, en el puerto 5500 o
> 5525). El proyecto usa React/JSX y necesita que Vite transforme el código.
> Si se sirve como HTML estático, la aplicación no puede iniciar.

## Build de producción

```bash
npm run build
npm run preview
```

## Publicación

El sitio se despliega solo en GitHub Pages con cada push a `main`, mediante el
workflow `.github/workflows/deploy.yml`.

URL: https://saviqoonline.github.io/glucoguia/

Como se sirve desde una subruta, `vite.config.js` fija `base: '/glucoguia/'`. Si
el proyecto se mueve a un dominio propio, hay que actualizar ese valor y el
`start_url` de `public/manifest.json`.

## Estructura principal

```txt
src/
  App.jsx
  main.jsx
  styles.css
  components/
  pages/
  data/
  utils/
```

## Próximos pasos recomendados

Nota: el backend aún no existe. Los puntos 1 y 2 son el trabajo pendiente para
que los datos dejen de vivir solo en el navegador.

1. Conectar Auth real con Google/email.
2. Guardar registros en Firestore por paciente.
3. Agregar permisos reales de cuidador.
4. Implementar notificaciones push.
5. Mejorar reportes PDF con plantilla formal.
6. Agregar carga de fotos de comidas con Firebase Storage.
7. Crear modo profesional/médico solo lectura.
8. Revisar cumplimiento legal para datos sensibles en Colombia.
9. Si algún día se quiere sugerir dosis, hacer ruta clínica y regulatoria antes de escribir una sola línea de algoritmo.

## Modelo Firestore sugerido (diseño a futuro, no implementado)

```txt
users/{userId}
patients/{patientId}
patients/{patientId}/glucoseLogs/{logId}
patients/{patientId}/insulinLogs/{logId}
patients/{patientId}/medicationLogs/{logId}
patients/{patientId}/mealLogs/{logId}
patients/{patientId}/reminders/{reminderId}
patients/{patientId}/caregivers/{caregiverUid}
```

## Nota de producto

El MVP funciona como diario de autocuidado y seguimiento. Para uso real con pacientes, hay que validar textos, flujos de emergencia, consentimiento, política de tratamiento de datos, roles de acceso y alcance clínico.
