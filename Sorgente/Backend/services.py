import os
import json

def svc_get_prenotazione(id):
    # Esempio di dati della prenotazione, in pratica dovresti recuperarli da un database
    prenotazioni = {
        1: {"id": 1, "cliente": "Mario Rossi", "data": "2024-07-10"},
        2: {"id": 2, "cliente": "Luigi Bianchi", "data": "2024-07-11"}
    }
    return prenotazioni.get(id)

def svc_get_lista_prenotazioni():
    return ""

def svc_add_prenotazione():
    return ""

def svc_update_prenotazione():
    return ""

def svc_delete_prenotazione(id):
    return ""

def _get_data_from_disk():
    # Creazione cartella storage al primo accesso in lettura/scrittura
    if not os.path.exists("json"):
        os.makedirs("json")

    return ""