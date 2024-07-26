import os
import json
import uuid
from datetime import datetime
from models.prenotazione import Prenotazione

# Crea un puntamento relativo alla cartella storage partendo dalla posizione del file attualmente in esecuzione
current_directory = os.path.dirname(os.path.abspath(__file__))
LOCAL_STORAGE_FOLDER = os.path.join(current_directory, 'storage')

def svc_get_reservation(id: str, cf: str, ts: str):
    """
    Recupera una prenotazione specifica dal disco basandosi sull'ID, il codice fiscale (CF) e il codice della tessera sanitaria (TS).
    
    Args:
        id (str): L'ID della prenotazione
        cf (str): Il codice fiscale
        ts (str): Il codice della tessera sanitaria
        
    Returns:
        Prenotazione: L'oggetto Prenotazione se trovato, altrimenti None.
    """
    cf = cf.upper()
    json_files = _get_data_from_disk()

    for json in json_files:
        if json["data"].get("id") == id and json["data"].get("cf") == cf and json["data"].get("ts") == ts:
            return Prenotazione().from_json(json["data"])

    return None


def svc_get_reservation_list(cf: str, ts: str):
    """
    Recupera una lista di prenotazioni in base a codice fiscale (CF) e codice della tessera sanitaria (TS).
    
    Args:
        cf (str): Il codice fiscale
        ts (str): Il codice della tessera sanitaria
        
    Returns:
        list: Lista di oggetti Prenotazione trovati.
    """
    cf = cf.upper()
    json_files = _get_data_from_disk()
    result_list = []

    for json in json_files:
       if json["data"].get("cf") == cf and json["data"].get("ts") == ts:
        result_list.append(Prenotazione().from_json(json["data"]))

    return result_list


def svc_add_reservation(prenotazione: Prenotazione):
    """
    Aggiunge una nuova prenotazione.
    
    Args:
        prenotazione (Prenotazione): Oggetto Prenotazione da aggiungere
        
    Returns:
        Prenotazione: Prenotazione aggiunta
    """
    data_ora = datetime.now()
    prenotazione.data_ora_inserimento = data_ora.strftime("%Y/%m/%dT%H:%M:%S")
    prenotazione.data_ora_prenotazione = prenotazione.data_ora_prenotazione

    prenotazione.id = _get_file_unique_id()
    file_full_path = os.path.join(LOCAL_STORAGE_FOLDER, "pr_" +  prenotazione.id + ".json")
    _write_data_on_disk(prenotazione, file_full_path)

    return prenotazione


def svc_update_reservation(new_info: Prenotazione):
    """
    Aggiorna una prenotazione esistente in base a codice fiscale (CF) e codice della tessera sanitaria (TS). 
    
    Args:
        new_info (Prenotazione): L'oggetto Prenotazione con le nuove informazioni.
        
    Returns:
        Prenotazione: L'oggetto Prenotazione aggiornato.
        
    Raises:
        Exception: Se la prenotazione non viene trovata.
    """
    json_files = _get_data_from_disk()
    record = None
    file_is_present = False
    file_full_path = None
    for json in json_files:
        if json["data"].get("id") == new_info.id and json["data"].get("cf") == new_info.cf:
            file_full_path = json["file_path"]
            record = Prenotazione.from_json(json["data"])
            file_is_present = True
            break

    if not file_is_present:
        raise Exception("Il record non è stato trovato")
    
    # Aggiornamento campi sul record riletto precedentemente
    data_ora = datetime.now()
    record.data_ora_modifica = data_ora.strftime("%Y/%m/%dT%H:%M:%S")
    record.data_ora_prenotazione = new_info.data_ora_prenotazione
    record.laboratorio = new_info.laboratorio
    record.lista_esami = new_info.lista_esami

    _write_data_on_disk(record, file_full_path)

    return record


def svc_delete_reservation(cf: str, id: str, ts: str):
    """
    Elimina una prenotazione specifica basandosi sull'ID, il codice fiscale (CF) e il codice della tessera sanitaria (TS).
    
    Args:
        cf (str): Il codice fiscale.
        id (str): L'ID della prenotazione.
        ts (str): Il codice della tessera sanitaria
        
    Raises:
        Exception: Se la prenotazione non viene trovata.
    """
    cf = cf.upper()
    json_files = _get_data_from_disk()

    for json in json_files:
        if json["data"].get("id") == id and json["data"].get("cf") == cf and json["data"].get("ts") == ts:
            os.remove(json["file_path"])
            return
    
    raise Exception("Prenotazione non trovata")


def _get_data_from_disk():
    """
    Recupera tutti i file JSON dalla cartella storage.
    
    Returns:
        list: Lista di dizionari contenenti, per ogni prenotazione, i dati della stessa e il path completo del file.
    """
    json_files = []

    # Creazione cartella storage al primo accesso in lettura/scrittura
    if not os.path.exists(LOCAL_STORAGE_FOLDER):
        os.makedirs(LOCAL_STORAGE_FOLDER)

    for filename in os.listdir(LOCAL_STORAGE_FOLDER):
        if filename.endswith('.json'):
            file_path = os.path.join(LOCAL_STORAGE_FOLDER, filename)
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                json_files.append({
                    'file_path': file_path,
                    'data': data
                })

    return json_files


def _write_data_on_disk(prenotazione: Prenotazione, file_path: str):
    """
    Scrive un JSON che rappresenta una prenotazione.
    
    Args:
        prenotazione (Prenotazione): L'oggetto Prenotazione da scrivere.
        file_path (str): Il percorso completo del file dove scrivere i dati.
    """
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(prenotazione.to_json(), f)

def _get_file_unique_id():
    """
    Genera un ID unico basato su UUID1, che utilizza l'indirizzo MAC del computer, un timestamp e un numero casuale.
    
    Returns:
        str: ID univoco.
    """
    return uuid.uuid1()