import os
import json
import re
import uuid
from datetime import datetime
from models.prenotazione import Prenotazione

# Crea un puntamento relativo alla cartella storage partendo dalla posizione del file attualmente in esecuzione
current_directory = os.path.dirname(os.path.abspath(__file__))
LOCAL_STORAGE_FOLDER = os.path.join(current_directory, 'storage')

def svc_get_prenotazione(cf, ts, id):
    cf = cf.upper()
    json_files = _get_data_from_disk()

    for json in json_files:
        print(json["data"].get("id") + " " + json["data"].get("cf"))
        if json["data"].get("id") == id and json["data"].get("cf") == cf and json["data"].get("ts") == ts:
            return Prenotazione().from_json(json["data"])

    return None


def svc_get_lista_prenotazioni(cf, ts):
    cf = cf.upper()
    json_files = _get_data_from_disk()
    result_list = []

    for json in json_files:
       if json["data"].get("cf") == cf and json["data"].get("ts") == ts:
        result_list.append(Prenotazione().from_json(json["data"]))

    return result_list


def svc_add_prenotazione(prenotazione):
    data_ora = datetime.now()
    prenotazione.data_ora_inserimento = data_ora.strftime("%Y/%m/%dT%H:%M:%S")
    prenotazione.data_ora_prenotazione = prenotazione.data_ora_prenotazione

    prenotazione.id = _get_file_unique_id()
    file_full_path = os.path.join(LOCAL_STORAGE_FOLDER, "pr_" +  prenotazione.id + ".json")
    _write_data_on_disk(prenotazione, file_full_path)

    return prenotazione


def svc_update_prenotazione(new_info):

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

    if file_is_present == False:
        raise Exception("Il record non è stato trovato")
    
    # Aggiornamento campi sul record riletto precedentemente
    data_ora = datetime.now()
    record.data_ora_modifica = data_ora.strftime("%Y/%m/%dT%H:%M:%S")
    record.data_ora_prenotazione = new_info.data_ora_prenotazione
    record.laboratorio = new_info.laboratorio
    record.lista_esami = new_info.lista_esami

    _write_data_on_disk(record, file_full_path)

    return record


def svc_delete_prenotazione(cf, id):
    cf = cf.upper()
    json_files = _get_data_from_disk()

    for json in json_files:
        if json["data"].get("id") == id and json["data"].get("cf") == cf:
            os.remove(json["file_path"])
            return
    
    raise Exception("Prenotazione non trovata")

#
def _get_data_from_disk():
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


def _write_data_on_disk(prenotazione, file_path):
    """
    Scrive su disco un modello json che rappresenta una prenotazione nel file indicato
    """

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(prenotazione.to_json(), f)


def _get_file_unique_id():
    #UUID1: Generato utilizzando una combinazione di indirizzo MAC del computer, timestamp e un numero casuale. È unico nel contesto di spazio e tempo.
    return uuid.uuid1()
