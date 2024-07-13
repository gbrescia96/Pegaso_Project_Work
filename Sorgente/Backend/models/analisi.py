class Analisi:
     # Converti da classe a json
    def to_json(self):
        return {
            "tipo": self.type,
            "nome": self.nome,
        }
    
    # Converti da json a classe
    def from_json(self, json):
        self.tipo = json.get("tipo")
        self.nome = json.get("nome")
        return self