import os
import json
import re
from datetime import datetime
from models.prenotazione import Prenotazione

# Crea un puntamento relativo alla cartella storage partendo dalla posizione del file attualmente in esecuzione
current_directory = os.path.dirname(os.path.abspath(__file__))
LOCAL_STORAGE_FOLDER = os.path.join(current_directory, 'storage')


def svc_get_prenotazione(cf, id):
    cf = cf.upper()
    json_files = _get_data_from_disk()

    for json in json_files:
        print(json["data"].get("id") + " " + json["data"].get("cf"))
        if json["data"].get("id") == id and json["data"].get("cf") == cf:
            return Prenotazione().from_json(json["data"])

    return None


def svc_get_lista_prenotazioni(cf):
    cf = cf.upper()
    json_files = _get_data_from_disk()
    result_list = []

    for json in json_files:
       if json["data"].get("cf") == cf:
        result_list.append(Prenotazione().from_json(json["data"]))

    return result_list


def svc_add_prenotazione(prenotazione):
    data_ora = datetime.now()
    prenotazione.data_ora_inserimento = data_ora.strftime("%Y/%m/%dT%H:%M:%S")
    prenotazione.data_ora_prenotazione = prenotazione.data_ora_prenotazione

    prenotazione.id = _get_file_unique_id()
    new_file_name = "pr" +  prenotazione.id + ".json"
    new_file_name = os.path.join(LOCAL_STORAGE_FOLDER, new_file_name)
    _write_data_on_disk(prenotazione, new_file_name)

    return prenotazione


def svc_update_prenotazione(prenotazione):
    data_ora = datetime.now()
    prenotazione.data_ora_modifica = data_ora.strftime("%Y/%m/%dT%H:%M:%S")
    prenotazione.data_ora_prenotazione = prenotazione.data_ora_prenotazione

    json_files = _get_data_from_disk()
    file_is_present = False
    file_name = None

    for json in json_files:
        if json["data"].get("id") == id and json["data"].get("cf") == prenotazione.cf:
            file_name = json["file_name"]
            file_is_present = True
            break

    if file_is_present == False:
        raise Exception("Il record non è stato trovato")
    
    _write_data_on_disk(prenotazione, file_name)

    return prenotazione


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
    data_ora = datetime.now()
    year = data_ora.year
    month = f"{data_ora.month:02}"
    day = f"{data_ora.day:02}" 
    hours = f"{data_ora.hour:02}"  
    minutes = f"{data_ora.minute:02}" 
    seconds = f"{data_ora.second:02}"  
    milliseconds = f"{data_ora.microsecond // 1000:03}"
         
    return f"{year}{month}{day}{hours}{minutes}{seconds}{milliseconds}"
