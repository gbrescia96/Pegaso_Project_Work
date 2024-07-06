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
    json_files = _get_data_from_disk(cf)

    for json in json_files:
        if json.get("id") == id:
            return Prenotazione().from_json(json)

    return None


def svc_get_lista_prenotazioni(cf):
    cf = cf.upper()
    json_files = _get_data_from_disk(cf)
    result_list = []

    for json in json_files:
       result_list.append(Prenotazione().from_json(json))

    return result_list


def svc_add_prenotazione(prenotazione):
    data_ora = datetime.now()
    prenotazione.data = data_ora.strftime("%d/%m/%Y")
    prenotazione.ora = data_ora.strftime("%H:%M:%S")

    _write_data_on_disk(prenotazione)

    return prenotazione


def svc_update_prenotazione(prenotazione):
    data_ora = datetime.now()
    prenotazione.data = data_ora.strftime("%d/%m/%Y")
    prenotazione.ora = data_ora.strftime("%H:%M:%S")

    if not _is_file_present(prenotazione.cf, prenotazione.id):
        raise Exception("Record prenotazione non trovato")   
    
    _write_data_on_disk(prenotazione)

    return prenotazione


def svc_delete_prenotazione(cf, id):
    cf = cf.upper()
    if _is_file_present(id):
        os.remove(_format_prenotazione_file_name(cf, id, True))


def _get_data_from_disk(cf = None):
    json_files = []

    # Creazione cartella storage al primo accesso in lettura/scrittura
    if not os.path.exists(LOCAL_STORAGE_FOLDER):
        os.makedirs(LOCAL_STORAGE_FOLDER)

    for filename in os.listdir(LOCAL_STORAGE_FOLDER):
        if filename.endswith('.json'):
            file_path = os.path.join(LOCAL_STORAGE_FOLDER, filename)
            with open(file_path, 'r', encoding='utf-8') as f:
                # Filtra per CF se presente e se il file contiene la sottostringa del CF. 
                if cf != None and filename.find("_" + cf + "_") == -1:
                    continue

                data = json.load(f)
                json_files.append(data)

    return json_files


def _write_data_on_disk(prenotazione):
    with open(_format_prenotazione_file_name(prenotazione.cf, prenotazione.id, True), 'w', encoding='utf-8') as f:
        json.dump(prenotazione.to_json(), f)

def _is_file_present(cf, id):
    return os.path.exists(os.path.join(LOCAL_STORAGE_FOLDER, _format_prenotazione_file_name(cf, id)))

def _format_prenotazione_file_name(cf, id, with_full_path = False):
    cf = cf.upper()
    file_name = "pr_" + cf + "_" + str(id) + ".json"
    if with_full_path:
        file_name = os.path.join(LOCAL_STORAGE_FOLDER, file_name)

    return file_name
