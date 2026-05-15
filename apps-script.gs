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

function doPost(e) {
  try {
    var p = e.parameter;

    var day   = parseInt(p.day,   10);
    var month = parseInt(p.month, 10) - 1;
    var year  = parseInt(p.year,  10);
    var hour  = parseInt(p.hour,  10);
    var min   = parseInt(p.min,   10) || 0;

    var start = new Date(year, month, day, hour, min, 0);
    var end   = new Date(year, month, day, hour + 2, min, 0);

    var title = 'TURNO - ' + p.car + ' - ' + p.services;

    var desc = 'Cliente: ' + p.name + '\n'
             + 'Telefono: ' + p.phone + '\n'
             + 'Auto: ' + p.car + '\n'
             + 'Servicios: ' + p.services + '\n'
             + 'Horario: ' + p.horario;

    var cal = CalendarApp.getCalendarById(CALENDAR_ID);

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

function doGet() {
  return ContentService
    .createTextOutput('Script activo OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
