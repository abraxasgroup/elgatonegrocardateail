/**
 * El Gato Negro Car Detail — Google Apps Script
 *
 * INSTRUCCIONES DE INSTALACIÓN (5 minutos):
 *
 * 1. Abrir https://script.google.com con la cuenta elgatonegrocarshop@gmail.com
 * 2. Clic en "Nuevo proyecto"
 * 3. Reemplazar el contenido con TODO este archivo
 * 4. Guardar (Ctrl+S) y darle un nombre, ej: "Turnos El Gato Negro"
 * 5. Clic en "Implementar" → "Nueva implementación"
 * 6. Tipo: "Aplicación web"
 *    - Ejecutar como: Yo (elgatonegrocarshop@gmail.com)
 *    - Quién tiene acceso: Cualquier usuario
 * 7. Clic "Implementar" → Autorizar cuando pida permisos → Aceptar todo
 * 8. Copiar la URL que aparece (empieza con https://script.google.com/macros/s/...)
 * 9. Pegar esa URL en index.html donde dice: const GAS_URL = 'PEGAR_URL_AQUI'
 *
 * ¡Listo! Cada turno que se reserve aparecerá automáticamente en Google
 * Calendar de elgatonegrocarshop@gmail.com con notificación al celular.
 */

var CALENDAR_ID = 'elgatonegrocarshop@gmail.com';
var POPUP_REMINDER_MIN = 30;   // notificación popup 30 min antes
var EMAIL_REMINDER_MIN = 120;  // email recordatorio 2 hs antes

function doPost(e) {
  try {
    var p = e.parameter;

    var day   = parseInt(p.day,   10);
    var month = parseInt(p.month, 10) - 1; // JS months: 0-11
    var year  = parseInt(p.year,  10);
    var hour  = parseInt(p.hour,  10);
    var min   = parseInt(p.min || '0', 10);

    var start = new Date(year, month, day, hour, min, 0);
    var end   = new Date(year, month, day, hour + 2, min, 0);

    var title = '🏁 ' + p.car + ' · ' + p.services;
    var desc  =
      'Cliente: '   + p.name     + '\n' +
      'Teléfono: '  + p.phone    + '\n' +
      'Auto: '      + p.car      + '\n' +
      'Servicio(s): '+ p.services + '\n' +
      'Horario: '   + p.horario;

    var cal   = CalendarApp.getCalendarById(CALENDAR_ID);
    var event = cal.createEvent(title, start, end, {
      description: desc,
      location: 'El Gato Negro Car Detail, Cañuelas, Buenos Aires'
    });

    event.addPopupReminder(POPUP_REMINDER_MIN);
    event.addEmailReminder(EMAIL_REMINDER_MIN);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, id: event.getId() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET de prueba — abrí la URL del script en el navegador para verificar que funciona
function doGet() {
  return ContentService
    .createTextOutput('El Gato Negro — script activo ✅')
    .setMimeType(ContentService.MimeType.TEXT);
}
