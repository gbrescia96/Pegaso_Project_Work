from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from models.response import Response as HttpResponse
from services import *

app = Flask(__name__)
CORS(app)  # Abilita CORS per tutte le route

@app.route('/api/getReservation', methods=['GET'])
def get_reservation():
    try:
        id = request.args.get('id', type=str)
        cf = request.args.get('cf', type=str)
        ts = request.args.get('ts', type=str)
        reservation = svc_get_reservation(id, cf, ts)
        if reservation:
            return HttpResponse(200, payload=reservation.to_json()).to_json()
        else:
            return HttpResponse(404, error_message="Prenotazione non trovata").to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()


@app.route('/api/getReservationList', methods=['GET'])
def get_reservation_list():
    try:
        cf = request.args.get('cf', type=str)
        ts = request.args.get('ts', type=str)
        prenotazioni = svc_get_reservation_list(cf, ts)
        if prenotazioni:
            lista_prenotazioni = []
            for reservation in prenotazioni:
                lista_prenotazioni.append(reservation.to_json())

            return HttpResponse(200, payload=lista_prenotazioni).to_json()
        else:
            return HttpResponse(404, error_message="Il codice fiscale indicato non ha prenotazioni registrate").to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()


@app.route('/api/addReservation', methods=['POST'])
def add_reservation():
    try:
        json_data = request.get_json()
        if json_data == None:
            return HttpResponse(403, error_message="Il payload non contiene dati").to_json()
        
        reservation = None
        print(json_data)
        try:
            reservation = Reservation().from_json(json_data)
        except:
            return HttpResponse(403, error_message="Il payload non coincide con il modello previsto").to_json()

        reservation = svc_add_reservation(reservation)    
        return HttpResponse(200, payload=reservation.to_json()).to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()


@app.route('/api/updateReservation', methods=['POST'])
def update_reservation():
    try:
        json_data = request.get_json()
        if json_data == None:
            return HttpResponse(403, error_message="Il payload non contiene dati").to_json()
        
        reservation = None
        try:
            reservation = Reservation().from_json(json_data)
        except:
            return HttpResponse(403, error_message="Il payload non coincide con il modello previsto").to_json()

        reservation = svc_update_reservation(reservation)    
        return HttpResponse(200, payload=reservation.to_json()).to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()

@app.route('/api/deleteReservation', methods=['DELETE'])
def delete_reservation():
    try:
        id = request.args.get('id', type=str)
        cf = request.args.get('cf', type=str)
        ts = request.args.get('ts', type=str)
        svc_delete_reservation(cf, id, ts) 
        return HttpResponse(204, payload=None).to_json()
    except Exception as ex:
        return HttpResponse(500, error_message=f"{str(ex)}").to_json()

if __name__ == '__main__':
    app.run(debug=True)