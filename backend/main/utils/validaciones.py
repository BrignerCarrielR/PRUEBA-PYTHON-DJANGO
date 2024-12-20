from django.core.exceptions import ValidationError
from main.models import Usuario


def validar_nombre_usuario(username):
    if len(username) < 8 or len(username) > 20:
        raise ValidationError("El nombre de usuario debe tener entre 8 y 20 caracteres.")

    # revisar si tiene al menos una mayuscula
    tiene_mayuscula = False
    for c in username:
        if c.isupper():
            tiene_mayuscula = True
            break
    if not tiene_mayuscula:
        raise ValidationError("El nombre de usuario debe contener al menos una letra mayuscula.")

    # revisar si tiene al menos un numero
    tiene_numero = False
    for c in username:
        if c.isdigit():
            tiene_numero = True
            break
    if not tiene_numero:
        raise ValidationError("El nombre de usuario debe contener al menos un numero.")

    # revisar si es alfanumerico
    if not username.isalnum():
        raise ValidationError("El nombre de usuario no debe contener signos.")

    # revisar si el nombre de usuario ya existe
    if Usuario.objects.filter(UserName=username).exists():
        raise ValidationError("El nombre de usuario ya esta en uso.")


def validar_contrasena(password):
    if len(password) < 8:
        raise ValidationError("La contrasena debe tener al menos 8 caracteres.")

    # revisar si tiene al menos una mayuscula
    tiene_mayuscula = False
    for c in password:
        if c.isupper():
            tiene_mayuscula = True
            break
    if not tiene_mayuscula:
        raise ValidationError("La contrasena debe contener al menos una letra mayuscula.")

    # revisar si tiene al menos un signo
    tiene_signo = False
    for c in password:
        if not c.isalnum():
            tiene_signo = True
            break
    if not tiene_signo:
        raise ValidationError("La contrasena debe contener al menos un signo.")

    # revisar si tiene espacios
    if " " in password:
        raise ValidationError("La contrasena no debe contener espacios.")


def validar_identificacion(identificacion):
    # revisar que tenga 10 caracteres y que todos sean digitos
    if len(identificacion) != 10 or not identificacion.isdigit():
        raise ValidationError("La identificacion debe contener exactamente 10 digitos y solo numeros.")

    # revisar que no haya 4 digitos consecutivos iguales
    for i in range(len(identificacion) - 3):
        if identificacion[i] == identificacion[i + 1] == identificacion[i + 2] == identificacion[i + 3]:
            raise ValidationError("La identificacion no debe contener un mismo numero repetido 4 veces consecutivas.")


def generar_correo(nombres, apellidos):
    inicial_nombre = nombres[0].lower()
    apellido = apellidos.split(" ")[0].lower()
    correo_base = f"{inicial_nombre}{apellido}@mail.com"
    contador = 1
    correo = correo_base
    while Usuario.objects.filter(Mail=correo).exists():
        correo = f"{inicial_nombre}{apellido}{contador}@mail.com"
        contador += 1
    return correo
