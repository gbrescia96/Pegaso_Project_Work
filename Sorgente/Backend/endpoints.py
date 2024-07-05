from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from models.response import Response as HttpResponse
from services import *

app = Flask(__name__)
CORS(app)  # Abilita CORS per tutte le route

@app.route('/api/getPrenotazioneById', methods=['GET'])
def get_prenotazione():
    prenotazione_id = request.args.get('id', type=int)
    prenotazione = svc_get_prenotazione(prenotazione_id)
    if prenotazione:
        return HttpResponse(200, data=prenotazione.to_json()).to_json()
    else:
        return HttpResponse(404, error_message="Prenotazione non trovata").to_json()

@app.route('/api/getListaPrenotazioni', methods=['GET'])
def get_lista_prenotazioni():
    prenotazioni = svc_get_lista_prenotazioni()
    if prenotazioni:
        lista_prenotazioni = []
        for prenotazione in prenotazioni:
            lista_prenotazioni.append(prenotazione.to_json())

        return HttpResponse(200, data=lista_prenotazioni).to_json()
    else:
        return HttpResponse(404, error_message="Prenotazione non trovata").to_json()
    
if __name__ == '__main__':
    app.run(debug=True)