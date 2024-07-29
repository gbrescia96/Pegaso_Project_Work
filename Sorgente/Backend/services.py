import os
import json
import uuid
from datetime import datetime
from models.reservation import Reservation

# Crea un puntamento relativo alla cartella storage partendo dalla posizione del file attualmente in esecuzione
current_directory = os.path.dirname(os.path.abspath(__file__))
LOCAL_STORAGE_FOLDER = os.path.join(current_directory, 'storage')

def svc_get_reservation(id: str, cf: str, ts: str):
    """
    Recupera una reservation specifica dal disco basandosi sull'ID, il codice fiscale (CF) e il codice della tessera sanitaria (TS).
    
    Args:
        id (str): L'ID della reservation
        cf (str): Il codice fiscale
        ts (str): Il codice della tessera sanitaria
        
    Returns:
        Reservation: L'oggetto Reservation se trovato, altrimenti None.
    """
    cf = cf.upper()
    json_files = _get_data_from_disk()

    for json in json_files:
        if json["data"].get("id") == id and json["data"].get("cf") == cf and json["data"].get("ts") == ts:
            return Reservation().from_json(json["data"])

    return None


def svc_get_reservation_list(cf: str, ts: str):
    """
    Recupera una lista di prenotazioni in base a codice fiscale (CF) e codice della tessera sanitaria (TS).
    
    Args:
        cf (str): Il codice fiscale
        ts (str): Il codice della tessera sanitaria
        
    Returns:
        list: Lista di oggetti Reservation trovati.
    """
    cf = cf.upper()
    json_files = _get_data_from_disk()
    result_list = []

    for json in json_files:
       if json["data"].get("cf") == cf and json["data"].get("ts") == ts:
        result_list.append(Reservation().from_json(json["data"]))

    return result_list


def svc_add_reservation(reservation: Reservation):
    """
    Aggiunge una nuova reservation.
    
    Args:
        reservation (Reservation): Oggetto Reservation da aggiungere
        
    Returns:
        Reservation: Reservation aggiunta
    """
    data_ora = datetime.now()
    reservation.data_ora_inserimento = data_ora.strftime("%Y-%m-%dT%H:%M:%S")
    reservation.data_ora_prenotazione = reservation.data_ora_prenotazione

    reservation.id = _get_file_unique_id()
    file_full_path = os.path.join(LOCAL_STORAGE_FOLDER, "pr_" +  reservation.id + ".json")
    _write_data_on_disk(reservation, file_full_path)

    return reservation


def svc_update_reservation(new_info: Reservation):
    """
    Aggiorna una reservation esistente in base a codice fiscale (CF) e codice della tessera sanitaria (TS). 
    
    Args:
        new_info (Reservation): L'oggetto Reservation con le nuove informazioni.
        
    Returns:
        Reservation: L'oggetto Reservation aggiornato.
        
    Raises:
        Exception: Se la reservation non viene trovata.
    """
    json_files = _get_data_from_disk()
    record = None
    file_full_path = None
    for json in json_files:
        if json["data"].get("id") == new_info.id and json["data"].get("cf") == new_info.cf and json["data"].get("ts") == new_info.ts:
            file_full_path = json["file_path"]
            record = Reservation().from_json(json["data"])
            break

    if record == None:
        raise Exception("Il record non è stato trovato")
    
    # Aggiornamento campi sul record riletto precedentemente
    data_ora = datetime.now()
    record.email = new_info.email
    record.data_ora_modifica = data_ora.strftime("%Y-%m-%dT%H:%M:%S")
    record.data_ora_prenotazione = new_info.data_ora_prenotazione
    record.laboratorio = new_info.laboratorio
    record.lista_esami = new_info.lista_esami

    _write_data_on_disk(record, file_full_path)

    return record


def svc_delete_reservation(cf: str, id: str, ts: str):
    """
    Elimina una reservation specifica basandosi sull'ID, il codice fiscale (CF) e il codice della tessera sanitaria (TS).
    
    Args:
        cf (str): Il codice fiscale.
        id (str): L'ID della reservation.
        ts (str): Il codice della tessera sanitaria
        
    Raises:
        Exception: Se la reservation non viene trovata.
    """
    cf = cf.upper()
    json_files = _get_data_from_disk()
    is_deleted = False

    for json in json_files:
        if json["data"].get("id") == id and json["data"].get("cf") == cf and json["data"].get("ts") == ts:
            is_deleted = _delete_data_from_disk(json["file_path"])
            return
    
    if is_deleted == False:
      raise Exception("Reservation non trovata")
    
    return


def _get_data_from_disk():
    """
    Recupera tutti i file JSON dalla cartella storage.
    
    Returns:
        list: Lista di dizionari contenenti, per ogni reservation, i dati della stessa e il path completo del file.
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


def _write_data_on_disk(reservation: Reservation, file_path: str):
    """
    Scrive un JSON che rappresenta una reservation.
    
    Args:
        reservation (Reservation): L'oggetto Reservation da scrivere.
        file_path (str): Il percorso completo del file dove scrivere i dati.
    """
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(reservation.to_json(), f)


def _delete_data_from_disk(file_path: str):
    """
    Rimuove un file dal disco.
    Nota: la os.remove() di per sé non restituisce alcun risultato, rendendo ambiguo il risultato della cancellazione. 
    A tale scopo vi è un flag che controlla l'esistenza del file prima di rimuoverlo e la funzione restituisce il valore del flag.

    Args:
        file_path (str): Il percorso completo del file da rimuovere.
      
    Returns:
        bool: flag che indica se il file esiste ed è stato cancellato.
    """
    is_success = False
    if os.path.exists(file_path):
      os.remove(file_path)
      is_success = True

    return is_success


def _get_file_unique_id():
    """
    Genera un ID unico basato su UUID1, che utilizza l'indirizzo MAC del computer, un timestamp e un numero casuale.
    
    Returns:
        str: ID univoco.
    """
    return str(uuid.uuid1())