const API_BASE_URL = "http://127.0.0.1:5000/api/";
const API_GET_RESERVATION = "getReservation";
const API_GET_RESERVATION_LIST = "getReservationList";
const API_DELETE_RESERVATION = "deleteReservation";
const API_ADD_RESERVATION = "addReservation";
const API_UPDATE_RESERVATION = "updateReservation";

/**
 * Astrazione di chiamata API al server. Ritorna l'oggetto Response (modello di risposta presente sul server)
 *
 * @param {string} methodType - Un metodo HTTP tra: GET | POST | DELETE.
 * @param {{}} [urlParams={}] - Lista di parametri da concatenare all'url della richiesta
 * @param {string} apiEndpoint - L'endpoint dell'API da chiamare (verrà concatenato all'endpoint del server).
 * @param {Object} [body=null] - Body della richesta se presente.
 * @returns {Promise<Object>} Oggetto della risposta API, se presente, altrimenti null
 */
async function executeApiCall(methodType, apiEndpoint, urlParams = {}, body = null) {
  //Mapping dei parametri nel formato param=value con concatenazione di multipli parametri con &
  var urlParamsString = Object.keys(urlParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(urlParams[key])}`)
    .join("&");

  try {
    var url = API_BASE_URL + apiEndpoint;
    //All'url di base + api viene concatenata la stringa dei parametri, se presente
    if (urlParamsString != "") {
      url += "?" + urlParamsString;
    }

    const response = await fetch(url, {
      method: methodType.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    return await response.json();
  } catch (error) {
    return { code: 503, error_message: "Il server non risponde" };
  }
}

/**
 * Verifica se il codice HTTP indica un successo.
 *
 * @param {number} code - Codice di stato HTTP.
 * @returns {boolean} True se il codice indica successo, false altrimenti.
 */
function hasHttpSuccessCode(code) {
  return code >= 200 && code <= 299;
}

/**
 * Creazione della notifica. Il messaggio supporta encoding HTML
 *
 * @param {string} type - Un tipo tra: success | error | info | notice.
 * @param {string} msg - Messaggio della notifica
 */
function pushNotification(type, msg) {
  var option = {
    title: "Esito Operazione",
    text: msg,
    textTrusted: true,
    maxTextHeight: null,
    autoOpen: true,
    remove: true,
    destroy: true,
    delay: 2000,
    stack: new PNotify.Stack({
      dir1: "down",
      dir2: "left",
      firstpos1: 25,
      firstpos2: 25,
      modal: false,
      overlayClose: true,
      push: "bottom",
      maxOpen: 5,
      maxStrategy: "close",
      context: document.body,
    }),
    labels: { close: "chiudi", pin: "blocca", unstick: "sblocca" },
  };

  PNotify.defaults.mode = 'light';

  switch (type) {
    case "success":
      PNotify.success(option);
      break;

    case "error":
      PNotify.error(option);
      break;

    case "info":
      PNotify.info(option);
      break;

    case "notice":
      PNotify.notice(option);
      break;

    default:
      option.text = "Eccezione PushNotification: type non riconosciuto";
      PNotify.error(option);
      break;
  }
}

/** Svuota tutti i tag html figli all'interno di un tag padre
 *
 * @param {string} tagID - ID del campo padre (senza #)
 */
function clearChildrenNodes(tagID) {
  var elem = document.getElementById(tagID);
  while (elem.firstChild) {
    elem.removeChild(elem.lastChild);
  }
}

/**
 * Genera e visualizza un modal con un messaggio custom e due handler per i tasti CONFERMA e ANNULLA
 *
 * @param {string} message - messaggio custom
 * @param {function} [onClickYes] - handler al click su YES/CONFERMA (di default chiude il modal)
 * @param {function} [onClickNo] - handler al click su NO/ANNULLA (di default chiude il modal)
 * @example
 *
 * Esempio di invocazione con due handler
 * generatePromptModal('Testo custom',
 *                  function() {
 *                      alert('Invocato handler CONFERMA');
 *                  },
 *                  function() {
 *                      alert('Invocato handler NO');
 *                  });
 */
function generatePromptModal(message, onClickYes, onClickNo) {
  // Rimuovi modal con lo stesso ID pre-esistenti
  $("#generatedModal").remove();

  var htmlModal = `
    <div class="modal fade" id="generatedModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" hidden>Conferma</h5>
                    <button id="generatedModalCloseButton" type="button" class="btn btn-light w-100">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${message}
                </div>
                <div class="modal-footer">
                    <div class="row justify-content-between">
                        <div class="col-6">
                            <button id="generatedModalNoButton" type="button" class="btn btn-secondary fw-bold w-100">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="col-6">
                            <button id="generatedModalYesButton" type="button" class="btn btn-success fw-bold w-100">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;

  //Aggiungi al DOM, successivamente verranno gestiti eventuali handler sui pulsanti
  $("body").append(htmlModal);

  //Gestione dell'evento on click sul CONFERMA
  $("#generatedModalYesButton").on("click", function () {
    if (onClickYes) {
      onClickYes();
    }

    $("#generatedModal").modal("hide");
  });

  //Gestione dell'evento on click sul NO
  $("#generatedModalNoButton").on("click", function () {
    if (onClickNo) {
      onClickNo();
    }

    $("#generatedModal").modal("hide");
  });

  //Gestione dell'evento sul pulsante di chiusura del modal
  $("#generatedModalCloseButton").on("click", function () {
    $("#generatedModal").modal("hide");
  });

  //Trigger di visualizzazione
  $("#generatedModal").modal("show");
}

/**
 * Genera e visualizza un modal con un messaggio custom
 *
 * @param {string} message - messaggio custom
 * @example
 *
 * Esempio di invocazione con due handler
 * generateInfoModal('Testo custom')
 */
function generateInfoModal(message) {
  // Rimuovi modal con lo stesso ID pre-esistenti
  $("#generatedModal").remove();

  var htmlModal = `
        <div class="modal fade" id="generatedModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" hidden>Conferma</h5>
                        <button id="generatedModalCloseButton" type="button" class="btn btn-light w-100">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${message}
                    </div>
                </div>
            </div>
        </div>
    `;

  //Aggiungi al DOM, successivamente verranno gestiti eventuali handler sui pulsanti
  $("body").append(htmlModal);

  //Gestione dell'evento sul pulsante di chiusura del modal
  $("#generatedModalCloseButton").on("click", function () {
    $("#generatedModal").modal("hide");
  });

  //Trigger di visualizzazione
  $("#generatedModal").modal("show");
}

/**
 * Converte una stringa di data e ora in un oggetto Date
 *
 * @param {string} dateTimeString - La stringa della data e ora
 * @returns {Date|null} L'oggetto Date se valido, altrimenti null
 */
function getDateTimeFromString(dateTimeString) {
  var dateTime = new Date(dateTimeString);
  if (isNaN(dateTime)) {
    return null;
  }

  return dateTime;
}

/**
 * Divide una stringa datetime in data e ora
 *
 * @param {string} datetime - La stringa datetime
 * @returns {Object} Un oggetto con le proprietà Date e Time
 */
function dateTimeSplit(datetime) {
  return {
    Date: datetime.substring(0, 10),
    Time: datetime.substring(11, 16),
  };
}

/**
 * Formatta una data nel formato DD/MM/AAAA
 *
 * @param {string} datetime - La stringa datetime
 * @param {string} [separator='/'] - Il separatore tra giorno, mese e anno
 * @returns {string} La data formattata
 */
function formatDateDDMMYYYY(datetime, separator = "/") {
  var dateParts = datetime.substring(0, 10);
  var dateComponents = dateParts.split("-");

  var year = dateComponents[0];
  var month = dateComponents[1];
  var day = dateComponents[2];

  return `${day}${separator}${month}${separator}${year}`;
}

/**
 * Estrae ore e minuti da una stringa datetime
 *
 * @param {string} datetime - La stringa datetime
 * @returns {string} Le ore e i minuti nel formato HH:MM
 */
function getHoursMinutesFromDateTime(datetime) {
  return datetime.substring(11, 16);
}

//Visualizza o nascondi l'alert della guida in una sezione specifica. 
//ForceStatus è utilizzato per forzare la visibilità/chiusura a prescindere dallo stato attuale
function showHelpAlert(alert, forceStatus = null) {
  var guide = $(alert).find("div");
  if (forceStatus == "open")
    guide.show();
  else if (forceStatus == "close")
    guide.hide();
  else if (guide.is(":hidden")) 
    guide.show();
  else if (guide.is(":hidden") == false) 
    guide.hide();
}

//Automazioni al caricamento di ogni pagina
$(document).ready(function () {
  //Creazione navbar
  generateNavbar();

  //Creazione footer 
  generateFooter();

  var path = window.location.pathname;
  var page = path.split("/").pop();

  //Gestione link attivo sulla navbar basandosi sulla pagina attuale
  $(".navbar-nav .nav-link").each(function () {
    var href = $(this).attr("href");
    if (href === page) {
      $(this).parent().addClass("active");
    } else {
      $(this).parent().removeClass("active");
    }
  });

  //Rendering del contenuto nel div "main-content" lasciando lo spazio necessario dalla navbar
  var navbarHeight = $(".navbar").outerHeight();
  $(".main-content").css("padding-top", navbarHeight + "px");
});

function generateNavbar() {
  var navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" style="font-size: 2rem">
          <i class="fas fa-vials"></i>
          L.A.B.
        </a>
        <button class="navbar-toggler" type="button" onclick="$('#wDivNavbar').collapse('toggle');">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="wDivNavbar">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" href="homepage.html">Homepage</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="prenotazione.html">Prenotazione</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="ricerca.html">Ricerca</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="about.html">About</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>`;
  $("body").prepend(navbar);
}

function generateFooter() {
  var footer = `<footer class="footer mt-auto py-1 bg-light">
                  <div class="container text-center">
                    <span class="text-muted">&copy; Unipegaso - CdL L-31 - Project Work AA 2023/2024: <b>L.A.B. Laboratorio Analisi Dr. Brescia </b> - Traccia 1.4 - Gianluca Brescia</span>
                  </div>
                </footer>`;

  $("body").append(footer);
}

//Validatore di codice fiscale
function validatorCF(cf) {
  //Il codice, di default, parte da uno stato di errore
  var validatorResult = { IsValid: false, Error: "il codice è errato" };
  
  if (cf.length !== 16) {
    validatorResult.Error = "il codice non è di 16 caratteri";
    return validatorResult;
  }

  cf = cf.toUpperCase();
  
  // Verifica i primi sei caratteri alfabetici
  for (let i = 0; i < 6; i++) {
    if (!/[A-Z]/.test(cf.charAt(i))) {
      return validatorResult;
    }
  }
  // Verifica i successivi due caratteri numerici (anno nascita)
  for (let i = 6; i < 8; i++) {
    if (!/[0-9]/.test(cf.charAt(i))) {
      return validatorResult;
    }
  }
  // Verifica il carattere relativo al mese di nascita
  if (!/[A-Z]/.test(cf.charAt(8))) {
    return validatorResult;
  }
  // Verifica i due caratteri numerici del giorno di nascita
  for (let i = 9; i < 11; i++) {
    if (!/[0-9]/.test(cf.charAt(i))) {
      return validatorResult;
    }
  }
  // Verifica il carattere successivo come lettera relativa al sesso
  if (!/[A-Z]/.test(cf.charAt(11))) {
    return validatorResult;
  }
  // Verifica i successivi tre caratteri numerici
  for (let i = 12; i < 15; i++) {
    if (!/[0-9]/.test(cf.charAt(i))) {
      return validatorResult;
    }
  }
  // Verifica la presenza del check digit (non viene controllato se è corretto o meno)
  if (!/[A-Z]/.test(cf.charAt(15))) {
    return validatorResult;
  }

  validatorResult.IsValid = true;
  validatorResult.Error = null;
  return validatorResult;
}

//Validatore di codice tessera sanitaria 
function validatorTS(code) {
  //Il codice, di default, parte da uno stato di errore
  var validatorResult = { IsValid: false, Error: "il codice è errato" };

  if (code.length !== 20) {
    validatorResult.Error = "il codice non è di 20 caratteri";
    return validatorResult;
  }

  // Codice Tipo Tessera (fisso "80" per prestazioni sanitarie)
  if (!code.startsWith('80')) {
    return validatorResult;
  }

  // Codice Stato: (fisso "380" per Italia)
  if (code.substring(2, 5) !== '380') {
    return validatorResult;
  }

  // Codice Ente: deve essere cinque cifre (primi due "00" seguiti dalle tre cifre specifiche della regione o ente)
  if (code.substring(5, 7) !== '00') {
    return validatorResult;
  }

  const validRegions = new Set([
    "010", "020", "030", "041", "042", "050", "060", "070", "080", "090", "100",
    "110", "120", "130", "140", "150", "160", "170", "180", "190", "200",
    "001", "002", "003", //enti speciali
  ]);
  let entity = code.substring(7, 10);
  if (!validRegions.has(entity)) {
    return validatorResult;
  }

  // I successivi 9 caratteri devono essere cifre
  for (let i = 10; i < 19; i++) {
    if (!/\d/.test(code.charAt(i))) {
      return validatorResult;
    } 
  }

   // Presenza del checkdigit
   if (!code.charAt(19)) {
    return validatorResult;
  }

  validatorResult.IsValid = true;
  validatorResult.Error = null;
  return validatorResult;
}

function validatorEmail(email) {
  var validatorResult = { IsValid: false, Error: null };
  validatorResult.IsValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  if (!validatorResult.IsValid) {
    validatorResult.Error = "non valida";
  }

  return validatorResult;
}

function isNullOrEmpty(text) {
  return (text == null || text === undefined || text == "");
}

function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value);
}