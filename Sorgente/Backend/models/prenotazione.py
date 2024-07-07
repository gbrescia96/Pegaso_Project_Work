class Prenotazione:
    # Converti da classe a json
    def to_json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "cognome": self.cognome,
            "email": self.email,
            "dataOraInserimento": self.data_ora_inserimento,
            "dataOraModifica": self.data_ora_modifica,
            "dataOraPrenotazione": self.data_ora_prenotazione,
            "cf": self.cf.upper()
        }
    
    # Converti da json a classe
    def from_json(self, json):
        self.id = json.get("id")
        self.nome = json.get("nome")
        self.cognome = json.get("cognome")
        self.email = json.get("email")
        self.data_ora_inserimento = json.get("dataOraInserimento")
        self.data_ora_modifica = json.get("dataOraModifica")
        self.data_ora_prenotazione = json.get("dataOraPrenotazione")
        self.cf = json.get("cf").upper()
        return self