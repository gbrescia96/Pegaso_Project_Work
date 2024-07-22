const API_BASE_URL = "http://127.0.0.1:5000/api/";
const API_GET_PRENOTAZIONE = "getPrenotazione";
const API_GET_LISTA_PRENOTAZIONI = "getListaPrenotazioni";
const API_DELETE_PRENOTAZIONE = "deletePrenotazione";
const API_ADD_PRENOTAZIONE = "addPrenotazione";
const API_UPDATE_PRENOTAZIONE = "updatePrenotazione";
const API_PING = "ping";

/**
 * Astrazione di chiamata API al server. Ritorna l'oggetto Response (modello di risposta presente sul server)
 *
 * @param {string} methodType - Un metodo HTTP tra: GET | POST | DELETE.
 * @param {{}} [urlParams={}] - Lista di parametri da concatenare all'url della richiesta
 * @param {string} apiEndpoint - L'endpoint dell'API da chiamare (verrà concatenato all'endpoint del server).
 * @param {Object} [body=null] - Body della richesta se presente.
 * @returns {Promise<Object>} Oggetto della risposta API, se presente, altrimenti null
 */
async function ExecuteApiCall(methodType, apiEndpoint, urlParams = {}, body = null) 
{
  //Mapping dei parametri nel formato param=value con concatenazione di multipli parametri con &
  var urlParamsString = Object.keys(urlParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(urlParams[key])}`)
    .join("&");

  try 
  {
    var url = API_BASE_URL + apiEndpoint;
    //All'url di base + api viene concatenata la stringa dei parametri, se presente
    if (urlParamsString != "") 
    {
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
  } 
  catch (error) 
  {
    return { code: 503, error_message: "Il server non risponde" };
  }
}

function HasHttpSuccessCode(code) 
{
  return code >= 200 && code <= 299;
}

/**
 * Creazione della notifica. Il messaggio supporta encoding HTML
 *
 * @param {string} type - Un tipo tra: success | error | info | notice.
 * @param {string} msg - Messaggio della notifica
 */
function PushNotification(type, msg) 
{
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

  switch (type) 
  {
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
function ClearChildrenNodes(tag) 
{
  var elem = document.getElementById(tag);
  while (elem.firstChild) 
  {
    elem.removeChild(elem.lastChild);
  }
}

//Da eseguire ogni 15 secondi il ping al server
setInterval(CheckServerStatus, 15000);
CheckServerStatus();
async function CheckServerStatus() 
{
  isOnline = true;
  return;
}

/**
 * Genera e visualizza un modal con un messaggio custom e due handler per i tasti NO e CONFERM
 *
 * @param {string} message - messaggio custom
 * @param {function} [onClickYes] - handler al click su CONFERMA (di default non ha alcun comportamento)
 * @param {function} [onClickNo] - handler al click su NO (di default chiude il modal)
 * @example
 *
 * Esempio di invocazione con due handler
 * GeneratePromptModal('Testo custom',
 *                  function() {
 *                      alert('Invocato handler CONFERMA');
 *                  },
 *                  function() {
 *                      alert('Invocato handler NO');
 *                  });
 */
function GeneratePromptModal(message, onClickYes, onClickNo) 
{
  // Rimuovi modal con lo stesso ID pre-esistenti
  $("#wDivGeneratedModal").remove();

  var htmlModal = `
    <div class="modal fade" id="wDivGeneratedModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" hidden>Conferma</h5>
                    <button id="wGeneratedModalCloseButton" type="button" class="btn btn-light w-100">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${message}
                </div>
                <div class="modal-footer">
                    <div class="row justify-content-between">
                        <div class="col-6">
                            <button id="wGeneratedModalNoButton" type="button" class="btn btn-secondary fw-bold w-100">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="col-6">
                            <button id="wGeneratedModalYesButton" type="button" class="btn btn-success fw-bold w-100">
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
  $("#wGeneratedModalYesButton").on("click", function () 
  {
    if (onClickYes) 
    {
      onClickYes();
    }

    $("#wDivGeneratedModal").modal("hide");
  });

  //Gestione dell'evento on click sul NO
  $("#wGeneratedModalNoButton").on("click", function () 
  {
    if (onClickNo) 
    {
      onClickNo();
    }

    $("#wDivGeneratedModal").modal("hide");
  });

  //Gestione dell'evento sul pulsante di chiusura del modal
  $("#wGeneratedModalCloseButton").on("click", function () 
  {
    $("#wDivGeneratedModal").modal("hide");
  });

  //Trigger di visualizzazione
  $("#wDivGeneratedModal").modal("show");
}

/**
 * Genera e visualizza un modal con un messaggio custom
 *
 * @param {string} message - messaggio custom
 * @example
 *
 * Esempio di invocazione con due handler
 * GenerateInfoModal('Testo custom')
 */
function GenerateInfoModal(message) 
{
    // Rimuovi modal con lo stesso ID pre-esistenti
    $("#wDivGeneratedModal").remove();

    var htmlModal = `
        <div class="modal fade" id="wDivGeneratedModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" hidden>Conferma</h5>
                        <button id="wGeneratedModalCloseButton" type="button" class="btn btn-light w-100">
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
    $("#wGeneratedModalCloseButton").on("click", function () 
    {
        $("#wDivGeneratedModal").modal("hide");
    });

    //Trigger di visualizzazione
    $("#wDivGeneratedModal").modal("show");
}

function GetDateTimeFromString(dateTimeString)
{
    var dateTime = new Date(dateTimeString);
    if (isNaN(dateTime))
    {
        return null;
    }

    return dateTime;
}

function DateTimeSplit(datetime) 
{
    return {
        Date: datetime.substring(0, 10),
        Time: datetime.substring(11, 16),
    };
}

function FormatDateDDMMAAAA(datetime, separator = "/") 
{
    var dateParts = datetime.substring(0, 10);
    var dateComponents = dateParts.split("-");

    var year = dateComponents[0];
    var month = dateComponents[1];
    var day = dateComponents[2];

    return `${day}${separator}${month}${separator}${year}`;
}

function GetHoursMinutesFromDateTime(datetime) 
{
    return datetime.substring(11, 16);
}

//Automazioni al caricamento di ogni pagina
$(document).ready(function () 
{
  //Creazione navbar
  GenerateNavbar();

  //Creazione footer 
  GenerateFooter();
  
  var path = window.location.pathname;
  var page = path.split("/").pop();

  //Gestione link attivo sulla navbar basandosi sulla pagina attuale
  $(".navbar-nav .nav-link").each(function () 
  {
    var href = $(this).attr("href");
    if (href === page) 
    {
      $(this).parent().addClass("active");
    } 
    else 
    {
      $(this).parent().removeClass("active");
    }
  });

  //Rendering del contenuto nel div "main-content" lasciando lo spazio necessario dalla navbar
  //20 pixel extra sono stati aggiungi per un padding maggiore oltre a quello minimo definito dall'outer height
  var navbarHeight = $(".navbar").outerHeight();
  $(".main-content").css("padding-top", navbarHeight + "px");
});

function GenerateNavbar() 
{
  var navbar = `
     <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div class="container">
                <a class="navbar-brand fw-bold" href="#" style="font-size: 2rem">
                    <i class="fas fa-vials"></i>
                    <!-- <img src="img/background_lab.png" alt="Laboratory" width="30" height="30" class="d-inline-block align-top" hidden> -->
                    L.A.B.
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#wDivNavbar">
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
                    </ul>
                </div>
            </div>
        </nav>`;

  $("body").prepend(navbar);
}

function GenerateFooter()
{
  var footer = `<footer class="footer mt-auto py-1 bg-light">
                  <div class="container text-center">
                    <span class="text-muted">&copy; Unipegaso - Project Work L.A.B. Laboratorio Analisi Brescia - Traccia 1.4</span>
                  </div>
                </footer>`;

  $("body").append(footer);
}

function ValidatorCodiceFiscale(cf) 
{
  if (cf.length !== 16) 
  {
    return false;
  }

  //     ^: Inizio della stringa. Questo assicura che la stringa da testare inizi esattamente con il pattern specificato.
  // [A-Z0-9]{6}: Sei caratteri alfanumerici. [A-Z0-9] indica una classe di caratteri che permette lettere maiuscole (A-Z) e numeri (0-9). {6} indica che questo pattern deve ripetersi esattamente sei volte.
  // [0-9]{2}: Due numeri. [0-9] indica una classe di caratteri che permette solo numeri, e {2} specifica che questo pattern deve ripetersi esattamente due volte.
  // [A-Z]: Una lettera maiuscola. [A-Z] indica una classe di caratteri che permette solo lettere maiuscole. Non ci sono quantificatori, quindi deve apparire esattamente una volta.
  // [0-9]{2}: Due numeri. Stessa logica di prima, due cifre numeriche.
  // [A-Z]: Una lettera maiuscola. Stessa logica di prima, una singola lettera maiuscola.
  // [0-9]{3}: Tre numeri. [0-9] indica una classe di caratteri che permette solo numeri, e {3} specifica che questo pattern deve ripetersi esattamente tre volte.
  // [A-Z]: Una lettera maiuscola. Stessa logica di prima, una singola lettera maiuscola.
  // $: Fine della stringa. Questo assicura che la stringa da testare termini esattamente con il pattern specificato.
  return /^[A-Z0-9]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.test(cf);
}

function ValidatorTesseraSanitaria(codice) 
{
  if (codice.length !== 20) 
  {
    return false;
  }

  // Il primo carattere è 0
  if (codice.charAt(0) !== "0") 
  {
    return false;
  }

  // Codice Tipo Tessera (fisso "80" per prestazioni sanitarie)
  if (codice.substring(1, 3) !== "80") 
  {
    return false;
  }

  // Codice Stato: (fisso "380" per Italia)
  if (codice.substring(3, 6) !== "380") 
  {
    return false;
  }

  // Codice Ente: deve essere cinque cifre (primi due "00" seguiti dalle tre cifre specifiche della regione o ente)
  if (codice.substring(6, 8) !== "00") 
  {
    return false;
  }

  let ente = codice.substring(8, 11);
  if (!ValidatorCodiceEnte(ente)) 
  {
    return false;
  }

  // I successivi 9 caratteri devono essere cifre
  if (!/^\d{9}$/.test(codice.substring(11, 20))) 
  {
    return false;
  }

  return true;
}

function ValidatorCodiceEnte(codiceRegione) 
{
  const regioniValide = new Set([
    "010", "020", "030", "041", "042", "050", "060", "070", "080", "090", "100",
    "110", "120", "130", "140", "150", "160", "170", "180", "190", "200", "001", "002", "003",
  ]);

  return regioniValide.has(codiceRegione);
}