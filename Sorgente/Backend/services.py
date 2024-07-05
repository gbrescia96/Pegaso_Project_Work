import os
import json
from models.prenotazione import Prenotazione

# Crea un puntamento relativo alla cartella storage partendo dalla posizione del file attualmente in esecuzione
current_directory = os.path.dirname(os.path.abspath(__file__))
LOCAL_STORAGE_FOLDER = os.path.join(current_directory, 'storage')

def svc_get_prenotazione(id):
    json_files = _get_data_from_disk(id)

    if len(json_files) > 0:
        return Prenotazione().from_json(json_files[0])

    return None

def svc_get_lista_prenotazioni():
    json_files = _get_data_from_disk()
    result_list = []

    for json in json_files:
       result_list.append(Prenotazione().from_json(json))

    return result_list


def svc_add_prenotazione(prenotazione):
    is_success = False
   
    if _is_file_present(prenotazione.id):
        raise Exception("Un record con questo ID è già presente")

    _write_data_on_disk(prenotazione)

    return prenotazione


def svc_update_prenotazione(prenotazione):
    is_success = False
   
    if _is_file_present(prenotazione.id):
        is_success = _write_data_on_disk(prenotazione)

    if is_success == False:
        return None
    
    return prenotazione


def svc_delete_prenotazione(id):
    has_been_deleted = False
    if _is_file_present(id):
        os.remove(_get_file_name_from_id(id, True))
        has_been_deleted = True

    return has_been_deleted


def _get_data_from_disk(id = None):
    json_files = []

    # Creazione cartella storage al primo accesso in lettura/scrittura
    if not os.path.exists(LOCAL_STORAGE_FOLDER):
        os.makedirs(LOCAL_STORAGE_FOLDER)

    # Se id è stato specificato carica solo il file stabilito
    if id != None:
        if _is_file_present(id):
           with open(_get_file_name_from_id(id, True), 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    json_files.append(data) 
    else: 
        for filename in os.listdir(LOCAL_STORAGE_FOLDER):
            if filename.endswith('.json'):
                file_path = os.path.join(LOCAL_STORAGE_FOLDER, filename)
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    json_files.append(data)

    return json_files


def _write_data_on_disk(prenotazione):
    is_success = False

    with open(_get_file_name_from_id(prenotazione.id, True), 'w', encoding='utf-8') as f:
        json.dump(prenotazione.to_json(), f)
        is_success = True

        
    return is_success


def _is_file_present(id):
    return os.path.exists(os.path.join(LOCAL_STORAGE_FOLDER, _get_file_name_from_id(id)))


def _get_file_name_from_id(id, with_full_path = False):
    file_name = "pr_" + str(id) + ".json"
    if with_full_path:
        file_name = os.path.join(LOCAL_STORAGE_FOLDER, file_name)

    return file_name