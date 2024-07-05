const API_BASE_URL = "http://127.0.0.1:5000/api/";
const API_GET_PRENOTAZIONE = "getPrenotazioneById"
const API_GET_LISTA_PRENOTAZIONI = "getListaPrenotazioni"

/**
 * Astrazione di chiamata API al server. Gestisce automaticamente la notifica di successo/fallimento e ritorna il response_data della richiesta.
 * 
 * @param {string} methodType - Un metodo HTTP tra: GET | POST | DELETE.
 * @param {{}} [urlParams={}] - Lista di parametri da concatenare all'url della richiesta
 * @param {string} apiEndpoint - L'endpoint dell'API da chiamare (verrà concatenato all'endpoint del server).
 * @param {Object} [body=null] - Body della richesta se presente.
 * @returns {Promise<Object>} Oggetto della risposta API, se presente, altrimenti null
 */
async function executeApiCall(methodType, apiEndpoint, urlParams = {}, body = null)
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

        console.log(`[${methodType}] ${url} => ${response.status}`, data);

        //Controllo del codice restituito dalla richiesta nel modello Response del backend
        if (data.code == 200) {
            pushNotification("success", "Operazione completata con successo!");
            return data.response_data;
        } else {
            pushNotification("error", `Errore: ${data.error_message}`);
            return null;
        }
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        pushNotification("error", "Il server non ha risposto alla richiesta: " + error.message);
        return null;
    }
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
        delay: 5000,
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
            option.text = "Eccezione pushNotification: type non riconosciuto";
            PNotify.error(option);
            break;
    }
};
