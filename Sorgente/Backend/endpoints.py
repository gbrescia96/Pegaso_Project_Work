from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from models.response import Response as HttpResponse
from services import *

app = Flask(__name__)
CORS(app)  # Abilita CORS per tutte le route

@app.route('/api/ping', methods=['GET'])
def ping():
    return HttpResponse(200).to_json()

@app.route('/api/getPrenotazione', methods=['GET'])
def get_prenotazione():
    try:
        cf = request.args.get('cf', type=str)
        id = request.args.get('id', type=str)
        prenotazione = svc_get_prenotazione(cf, id)
        if prenotazione:
            return HttpResponse(200, data=prenotazione.to_json()).to_json()
        else:
            return HttpResponse(404, error_message="Prenotazione non trovata").to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()


@app.route('/api/getListaPrenotazioni', methods=['GET'])
def get_lista_prenotazioni():
    try:
        cf = request.args.get('cf', type=str)
        prenotazioni = svc_get_lista_prenotazioni(cf)
        if prenotazioni:
            lista_prenotazioni = []
            for prenotazione in prenotazioni:
                lista_prenotazioni.append(prenotazione.to_json())

            return HttpResponse(200, data=lista_prenotazioni).to_json()
        else:
            return HttpResponse(404, error_message="Il codice fiscale indicato non ha prenotazioni registrate").to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()


@app.route('/api/addPrenotazione', methods=['POST'])
def add_prenotazione():
    try:
        json_data = request.get_json()
        if json_data == None:
            return HttpResponse(403, error_message="Il payload non contiene dati").to_json()
        
        prenotazione = None
        try:
            prenotazione = Prenotazione().from_json(json_data)
        except:
            return HttpResponse(403, error_message="Il payload non coincide con il modello previsto").to_json()

        prenotazione = svc_add_prenotazione(prenotazione)    
        return HttpResponse(200, data=prenotazione.to_json()).to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()


@app.route('/api/updatePrenotazione', methods=['POST'])
def update_prenotazione():
    try:
        json_data = request.get_json()
        if json_data == None:
            return HttpResponse(403, error_message="Il payload non contiene dati").to_json()
        
        prenotazione = None
        try:
            prenotazione = Prenotazione().from_json(json_data)
        except:
            return HttpResponse(403, error_message="Il payload non coincide con il modello previsto").to_json()

        prenotazione = svc_update_prenotazione(prenotazione)    
        return HttpResponse(200, data=prenotazione.to_json()).to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()

@app.route('/api/deletePrenotazione', methods=['DELETE'])
def delete_prenotazione():
    try:
        cf = request.args.get('cf', type=str)
        id = request.args.get('id', type=str)
        svc_delete_prenotazione(cf, id) 
        return HttpResponse(204, data=None).to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()

if __name__ == '__main__':
    app.run(debug=True)