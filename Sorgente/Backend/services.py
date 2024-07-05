import os
import json
from models.prenotazione import Prenotazione

# Crea un puntamento relativo alla cartella storage partendo dalla posizione del file attualmente in esecuzione
current_directory = os.path.dirname(os.path.abspath(__file__))
LOCAL_STORAGE_FOLDER = os.path.join(current_directory, 'storage')

def svc_get_prenotazione(id):
    json_files = _get_data_from_disk()

    for json in json_files:
        if json.get("id") != id:
            continue

        return Prenotazione().from_json(json)

    return None

def svc_get_lista_prenotazioni():
    json_files = _get_data_from_disk()
    result_list = []

    for json in json_files:
       result_list.append(Prenotazione().from_json(json))

    return result_list

def svc_add_prenotazione():
    return ""

def svc_update_prenotazione():
    return ""

def svc_delete_prenotazione(id):
    return ""

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
                json_files.append(data)

    return json_files
