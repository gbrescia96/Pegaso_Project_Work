class Response:
    def __init__(self, code, error_message=None, data=None):
        self.code = code
        self.error_message = error_message
        self.response_data = data

    def to_json(self):
        return {
            "code": self.code,
            "error_message": self.error_message,
            "response_data": self.response_data
        }
