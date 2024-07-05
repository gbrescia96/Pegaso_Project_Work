class Prenotazione:
    # Converti da classe a json
    def to_json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "cognome": self.cognome,
            "email": self.email
        }
    
    # Converti da json a classe
    def from_json(self, json):
        self.id = json.get("id")
        self.nome = json.get("nome")
        self.cognome = json.get("cognome")
        self.email = json.get("email")
        return self
        