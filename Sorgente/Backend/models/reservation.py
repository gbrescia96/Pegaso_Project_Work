import re
from datetime import datetime, timedelta

class Reservation:
    def __init__(self):
        self._id = None
        self._nome = None
        self._cognome = None
        self._email = None
        self._data_ora_inserimento = None
        self._data_ora_modifica = None
        self._data_ora_prenotazione = None
        self._cf = None
        self._ts = None
        self._laboratorio = None
        self._lista_esami = None

    @property
    def id(self):
        return self._id
    @id.setter
    def id(self, value):
        self._id = value

    @property
    def nome(self):
        return self._nome
    @nome.setter
    def nome(self, value):
        self._nome = value

    @property
    def cognome(self):
        return self._cognome
    @cognome.setter
    def cognome(self, value):
        self._cognome = value

    @property
    def email(self):
        return self._email
    @email.setter
    def email(self, value):
        if self.validator_email(value):
            self._email = value
        else:
            raise ValueError("E-mail non valida")

    @property
    def data_ora_inserimento(self):
        return self._data_ora_inserimento
    @data_ora_inserimento.setter
    def data_ora_inserimento(self, value):
        self._data_ora_inserimento = value

    @property
    def data_ora_modifica(self):
        return self._data_ora_modifica
    @data_ora_modifica.setter
    def data_ora_modifica(self, value):
        self._data_ora_modifica = value

    @property
    def data_ora_prenotazione(self):
        return self._data_ora_prenotazione
    @data_ora_prenotazione.setter
    def data_ora_prenotazione(self, value):
        if isinstance(value, str):
            value = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")

        if not self.check_reservation_is_next_day(value):
            raise ValueError("La data della prenotazione dev'essere successiva ad oggi")

        if not self.check_reservation_day_range(value):
            raise ValueError("La data della prenotazione deve essere compresa tra lunedì e venerdì")

        if not self.check_reservation_time_range(value):
            raise ValueError("L'orario della prenotazione deve essere compreso tra le 08:00 e le 18:00")

        self._data_ora_prenotazione = value

    @property
    def cf(self):
        return self._cf
    @cf.setter
    def cf(self, value):
        if self.validator_codice_fiscale(value):
            self._cf = value.upper()
        else:
            raise ValueError("Codice Fiscale non valido")

    @property
    def ts(self):
        return self._ts
    @ts.setter
    def ts(self, value):
        if self.validator_tessera_sanitaria(value):
            self._ts = value
        else:
            raise ValueError("Codice Tessera Sanitaria non valido")

    @property
    def laboratorio(self):
        return self._laboratorio
    @laboratorio.setter
    def laboratorio(self, value):
        self._laboratorio = value

    @property
    def lista_esami(self):
        return self._lista_esami
    @lista_esami.setter
    def lista_esami(self, value):
        self._lista_esami = value

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
            "cf": self.cf,
            "ts": self.ts,
            "laboratorio": self.laboratorio,
            "listaEsami": self.lista_esami
        }

    # Converti da json a classe
    def from_json(self, json):
        self.id = json.get("id")
        self.nome = json.get("nome")
        self.cognome = json.get("cognome")
        self.email = json.get("email")
        self.data_ora_inserimento = json.get("dataOraInserimento", None)
        self.data_ora_modifica = json.get("dataOraModifica", None)
        self.data_ora_prenotazione = json.get("dataOraPrenotazione")
        self.cf = json.get("cf").upper()
        self.ts = json.get("ts")
        self.laboratorio = json.get("laboratorio")
        self.lista_esami = json.get("listaEsami", [])
        return self

    # Validatore codice fiscale
    @staticmethod
    def validator_codice_fiscale(codice_fiscale):
        if len(codice_fiscale) != 16:
            return False

        if not codice_fiscale[:6].isalnum():
            return False
        
        if not codice_fiscale[6:8].isdigit():
            return False
        
        if not codice_fiscale[8].isalpha():
            return False
        
        if not codice_fiscale[9:11].isdigit():
            return False
        
        if not codice_fiscale[11:].isalnum():
            return False

        return True


    # Validatore per codice tessera sanitaria
    @staticmethod
    def validator_tessera_sanitaria(codice):
        if len(codice) != 20:
            return False

        # Codice Tipo Tessera (fisso "80" per prestazioni sanitarie)
        if codice[1:3] != "80":
            return False

        # Codice Stato: (fisso "380" per Italia)
        if codice[3:6] != "380":
            return False

        # Codice Ente: deve essere cinque cifre (primi due "00" seguiti dalle tre cifre specifiche della regione o ente)
        if codice[6:8] != "00":
            return False
        
        if not codice[3:6].isdigit():
            return False

        ente = codice[8:11]
        if not Reservation.validator_codice_ente(ente):
            return False

        # I successivi 9 caratteri devono essere cifre
        if not codice[11:20].isdigit():
            return False

        return True
    

    # Oltre alle regioni vi sono i tre codici speciali (001, 002, 003) di SASN Genova, Napoli e AIRE
    @staticmethod
    def validator_codice_ente(codice_regione):
        regioni_valide = {
            "010", "020", "030", "041", "042", "050", "060", "070", "080", "090",
            "100", "110", "120", "130", "140", "150", "160", "170", "180", "190", "200",
            "001", "002", "003"
        }

        return codice_regione in regioni_valide
    
    # Validatore struttura email
    @staticmethod
    def validator_email(email):
      # Definisci la regex per validare l'email
      email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
      
      if re.match(email_regex, email):
          return True
      else:
          return False
      
    # Validatore per il range del giorno della prenotazione
    @staticmethod
    def check_reservation_day_range(date_time):
        if date_time is None:
            return False

        day = date_time.weekday()  # Lunedì (0) - Domenica (6)
        return 0 <= day <= 4  # Lunedì (0) - Venerdì (4)

    # Validatore per il range dell'orario della prenotazione
    @staticmethod
    def check_reservation_time_range(date_time):
        if date_time is None:
            return False

        hours = date_time.hour
        return 8 <= hours <= 18  # Tra le 08:00 e le 18:00

    # Validatore se la data è uguale o maggiore del giorno successivo ad oggi
    @staticmethod
    def check_reservation_is_next_day(date_time_reservation):
        if date_time_reservation is None:
            return False

        date_time_next_day = datetime.now()
        # Aggiungi un delta di un giorno
        date_time_next_day = date_time_next_day.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)

        return (date_time_reservation.day >= date_time_next_day.day and
                date_time_reservation.month >= date_time_next_day.month and
                date_time_reservation.year >= date_time_next_day.year)
