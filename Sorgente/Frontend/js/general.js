const API_BASE_URL = "http://127.0.0.1:5000/api/";
const API_GET_PRENOTAZIONE = "getPrenotazione"
const API_GET_LISTA_PRENOTAZIONI = "getListaPrenotazioni"
const API_DELETE_PRENOTAZIONE = "deletePrenotazione"
const API_ADD_PRENOTAZIONE = "addPrenotazione"
const API_UPDATE_PRENOTAZIONE = "updatePrenotazione"
const API_PING = "ping"

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
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(urlParams[key])}`)
        .join('&');

    try {
        var url = API_BASE_URL + apiEndpoint;
        //All'url di base + api viene concatenata la stringa dei parametri, se presente
        if (urlParamsString != "")
            url += "?" + urlParamsString;

        const response = await fetch(url, {
            method: methodType.toUpperCase(),
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });

        return await response.json();
    } catch (error) {
        return {"code": 500, error_message: "Il server non risponde"};
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
function PushNotification(type, msg) {
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
                context: document.body
        }),
        labels: { close: "chiudi", pin: "blocca", unstick: "sblocca" }
    };

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
};


/** Svuota tutti i tag html figli all'interno di un tag padre
  * 
  * @param {string} tagID - ID del campo padre (senza #)
  */
function ClearChildrenNodes(tag)
{
    var elem = document.getElementById(tag);
    while (elem.firstChild)
        elem.removeChild(elem.lastChild);
};



//Da eseguire ogni 15 secondi il ping al server
setInterval(CheckServerStatus, 15000);
CheckServerStatus();
async function CheckServerStatus()
{
    var response = await ExecuteApiCall("GET", API_PING, {}, null, false);
    var isOnline = HasHttpSuccessCode(response.code);

    //ClearChildrenNodes("wBtnNavbarServerStatus");
    var iconTag = $("<i></i>").addClass("fa-solid fa-circle");
    var statusLabelTag = $("<span></span>").addClass("ml-2");
    
    if (isOnline)
    {
        iconTag.css("color", "darkgreen");
        statusLabelTag.text("Connesso").css("color", "darkgreen");
    }
    else
    {
        iconTag.css("color", "darkred");
        statusLabelTag.text("Non connesso").css("color", "darkred");
    }
    
    $("#wBtnNavbarServerStatus").append(iconTag, statusLabelTag);
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
 * GenerateModal('Testo custom', 
 *                  function() {
 *                      alert('Invocato handler CONFERMA');
 *                  }, 
 *                  function() {
 *                      alert('Invocato handler NO');
 *                  });
 */
function GenerateModal(message, onClickYes, onClickNo) {
    // Rimuovi modal con lo stesso ID pre-esistenti
    $('#wDivGeneratedModal').remove();

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
    $('body').append(htmlModal);

    //Gestione dell'evento on click sul CONFERMA
    if (onClickYes) {
        $('#wGeneratedModalYesButton').on('click', function() {
            onClickYes();
            $('#wDivGeneratedModal').modal('hide');
        });
    }

    //Gestione dell'evento on click sul NO (di default nasconde il modal)
    $('#wGeneratedModalNoButton').on('click', function() {
        if (onClickNo) {
            onClickNo();
        };

        $('#wDivGeneratedModal').modal('hide');
    });

    //Gestione dell'evento sul pulsante di chiusura del modal 
    $('#wGeneratedModalCloseButton').on('click', function() {
        $('#wDivGeneratedModal').modal('hide');
    });

    //Trigger di visualizzazione
    $('#wDivGeneratedModal').modal('show');
}

function FormatDateDDMMAAAA(datetime, separator = "/")
{
    var dateParts = datetime.substring(0, 10);
    var dateComponents = dateParts.split('-');

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
$(document).ready(function() {
    //Creazione navbar
    GenerateNavbar();

    var path = window.location.pathname;
    var page = path.split("/").pop();

    //Gestione link attivo sulla navbar basandosi sulla pagina attuale
    $(".navbar-nav .nav-link").each(function() {
        var href = $(this).attr('href');
        if (href === page) 
        {
            $(this).parent().addClass('active');
        }
        else
        {
            $(this).parent().removeClass('active');
        }
    });

    //Rendering del contenuto nel div "main-content" lasciando lo spazio necessario dalla navbar
    //20 pixel extra sono stati aggiungi per un padding maggiore oltre a quello minimo definito dall'outer height
    var navbarHeight = $('.navbar').outerHeight();
    $('.main-content').css('padding-top', (navbarHeight) + 'px');
});


function GenerateNavbar()
{
    var navbar = `
     <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div class="container">
                <a class="navbar-brand" href="#">
                    <i class="fas fa-vials"></i>
                    <!-- <img src="img/background_lab.png" alt="Laboratory" width="30" height="30" class="d-inline-block align-top" hidden> -->
                    Brescia
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#wDivNavbar" aria-controls="wDivNavbar" aria-expanded="false" aria-label="Toggle navigation">
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
                            <a class="nav-link" href="about.html">Contatti</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>`;

        $('body').prepend(navbar);
}