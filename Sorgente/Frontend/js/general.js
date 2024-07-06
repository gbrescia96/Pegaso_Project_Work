const API_BASE_URL = "http://127.0.0.1:5000/api/";
const API_GET_PRENOTAZIONE = "getPrenotazione"
const API_GET_LISTA_PRENOTAZIONI = "getListaPrenotazioni"
const API_DELETE_PRENOTAZIONE = "deletePrenotazione"
const API_ADD_PRENOTAZIONE = "addPrenotazione"
const API_UPDATE_PRENOTAZIONE = "updatePrenotazione"
const API_PING = "ping"

/**
 * Astrazione di chiamata API al server. Gestisce automaticamente la notifica di successo/fallimento e ritorna il response_data della richiesta.
 * 
 * @param {string} methodType - Un metodo HTTP tra: GET | POST | DELETE.
 * @param {{}} [urlParams={}] - Lista di parametri da concatenare all'url della richiesta
 * @param {string} apiEndpoint - L'endpoint dell'API da chiamare (verrà concatenato all'endpoint del server).
 * @param {Object} [body=null] - Body della richesta se presente.
 * @param {boolean} [showNotification=true] - Visualizza automaticamente le notifiche
 * @returns {Promise<Object>} Oggetto della risposta API, se presente, altrimenti null
 */
async function ExecuteApiCall(methodType, apiEndpoint, urlParams = {}, body = null, showNotification = true)
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

        const data = await response.json();

        console.log(`[${methodType}] ${url} => ${data.code}`, data);

        //Controllo del codice restituito dalla richiesta nel modello Response del backend
        if (data.code >= 200 && data.code <= 299) {
            if (showNotification)
                PushNotification("success", "Operazione completata con successo!");
            return data.response_data;
        } else {
            if (showNotification)
                PushNotification("error", `Errore: ${data.error_message}`);
            return null;
        }
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        if (showNotification)
            PushNotification("error", "Il server non ha risposto alla richiesta: " + error.message);
        return null;
    }
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
        delay: 1300,
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

