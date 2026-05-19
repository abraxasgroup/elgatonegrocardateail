// ============================================================
// El Gato Negro Car Detail - Google Apps Script
//
// INSTRUCCIONES:
// 1. Abrir https://script.google.com con elgatonegrocarshop@gmail.com
// 2. Nuevo proyecto -> borrar contenido -> pegar este archivo
// 3. Guardar (Ctrl+S)
// 4. Implementar -> Nueva implementacion -> Aplicacion web
//    Ejecutar como: Yo
//    Quien tiene acceso: Cualquier usuario
// 5. Autorizar permisos -> copiar la URL generada
// 6. Pegar esa URL en index.html donde dice: const GAS_URL = 'PEGAR_URL_AQUI'
// ============================================================

var CALENDAR_ID = 'elgatonegrocarshop@gmail.com';

function doGet(e) {
  // Cuando se ejecuta desde el editor el evento llega undefined
  if (!e || !e.parameter) {
    return ContentService
      .createTextOutput('Script activo OK (ejecutado desde editor)')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  var p = e.parameter;

  // Prueba sin parametros via URL
  if (!p.action && !p.name) {
    return ContentService
      .createTextOutput('Script activo OK')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  // Consulta de disponibilidad
  if (p.action === 'availability') {
    return getAvailability(p.date);
  }

  // Crear turno
  return createTurno(p);
}

// Devuelve los eventos del dia como [{start, end}] en horas decimales
function getAvailability(dateStr) {
  try {
    var parts    = dateStr.split('-');
    var year     = parseInt(parts[0], 10);
    var month    = parseInt(parts[1], 10) - 1;
    var day      = parseInt(parts[2], 10);
    var dayStart = new Date(year, month, day, 0,  0,  0);
    var dayEnd   = new Date(year, month, day, 23, 59, 59);

    var cal    = CalendarApp.getCalendarById(CALENDAR_ID);
    var events = cal.getEvents(dayStart, dayEnd);

    var result = events.map(function(ev) {
      var s = ev.getStartTime();
      var e = ev.getEndTime();
      return {
        start: s.getHours() + s.getMinutes() / 60,
        end:   e.getHours() + e.getMinutes() / 60
      };
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, events: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, events: [], error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function createTurno(p) {
  try {
    var day   = parseInt(p.day,   10);
    var month = parseInt(p.month, 10) - 1;
    var year  = parseInt(p.year,  10);
    var hour  = parseInt(p.hour,  10);
    var min   = parseInt(p.min,   10) || 0;
    var dur   = parseFloat(p.dur) || 2;

    var start = new Date(year, month, day, hour, min, 0);
    var end   = new Date(start.getTime() + dur * 3600000);

    var title = 'TURNO - ' + p.car + ' - ' + p.services;

    var desc = 'Cliente: '   + p.name     + '\n'
             + 'Telefono: '  + p.phone    + '\n'
             + 'Auto: '      + p.car      + '\n'
             + 'Servicios: ' + p.services + '\n'
             + 'Horario: '   + p.horario;

    var cal   = CalendarApp.getCalendarById(CALENDAR_ID);
    var event = cal.createEvent(title, start, end, {
      description: desc,
      location: 'El Gato Negro Car Detail, Canuelas, Buenos Aires'
    });

    event.addPopupReminder(30);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
