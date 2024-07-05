def get_hello_message():
    return {'message': 'Hello, World!'}

def get_greet_message(name):
    if not name:
        name = 'Guest'
    return {'message': f'Hello, {name}!'}
