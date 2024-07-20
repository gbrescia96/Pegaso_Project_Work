class Response:
    def __init__(self, code, error_message=None, payload=None):
        self.code = code
        self.error_message = error_message
        self.payload = payload

    # Converti da classe a json
    def to_json(self):
        return {
            "code": self.code,
            "error_message": self.error_message,
            "payload": self.payload
        }
