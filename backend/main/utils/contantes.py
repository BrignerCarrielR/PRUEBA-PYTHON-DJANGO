class Constantes:
    def __init__(self):
        pass

    def ConstSessionActive(self):
        data = [
            ('A', 'Activo'),
            ('I', 'Inactivo'),
        ]
        return data

    def ConstStatus(self):
        data = [
            ('Activo', 'Se encuentra activo'),
            ('Inactivo', 'Se encuentra Inactivo'),
            ('Bloqueado', 'Se encuentra Bloqueado')
        ]
        return data
