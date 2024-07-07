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

    ClearChildrenNodes("wBtnNavbarServerStatus");
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