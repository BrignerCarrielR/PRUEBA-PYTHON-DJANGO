from django.core.exceptions import ValidationError
from django.db import connection
from rest_framework import viewsets, status
from rest_framework.views import APIView

from main.models import Persona, Usuario, Rol, RolOpciones, RolUsuario, RolRolOpciones, Session
from main.serializer import PersonaSerializer, UsuarioSerializer, RolSerializer, RolOpcionesSerializer, \
    RolUsuarioSerializer, RolRolOpcionesSerializer, SessionSerializer, LoginSerializer, RecuperarContrasenaSerializer
from main.utils.validaciones import validar_nombre_usuario, validar_contrasena, validar_identificacion, generar_correo
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone

from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer

    def perform_destroy(self, instance):
        # Llamar al método delete del modelo (marcar como inactivo)
        instance.delete()

        # Devolver una respuesta con el mensaje de eliminación lógica
        return Response({"message": "Persona eliminada lógicamente."}, status=status.HTTP_204_NO_CONTENT)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @action(detail=False, methods=['post'], url_path='crear_usuario')
    def crear_usuario(self, request):
        data = request.data
        try:
            validar_nombre_usuario(data['UserName'])
            validar_contrasena(data['Password'])
            validar_identificacion(data['Persona']['Identificacion'])
            correo = generar_correo(data['Persona']['Nombres'], data['Persona']['Apellidos'])

            persona = Persona.objects.create(
                Nombres=data['Persona']['Nombres'],
                Apellidos=data['Persona']['Apellidos'],
                Identificacion=data['Persona']['Identificacion'],
                FechaNacimiento=data['Persona']['FechaNacimiento']
            )

            usuario = Usuario.objects.create(
                UserName=data['UserName'],
                Password=data['Password'],
                Mail=correo,
                Persona=persona,
                SessionActive=data.get('SessionActive', 'N'),
                Status=data.get('Status', 'Activo')
            )

            return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'], url_path='actualizar_password')
    def actualizar_password(self, request, pk=None):
        usuario = self.get_object()
        nueva_password = request.data.get('Password')

        try:
            validar_contrasena(nueva_password)
            usuario.Password = nueva_password
            usuario.save()
            return Response({'status': 'Contraseña actualizada correctamente.'}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='buscar_usuario')
    def buscar_usuario(self, request):
        username = request.query_params.get('username', None)

        if not username:
            return Response({'error': 'Se requiere el parámetro `username`'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(UserName=username)
            return Response(UsuarioSerializer(usuario).data, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

    def perform_destroy(self, instance):
        # Llamar al método delete del modelo (marcar como inactivo)
        instance.delete()

        # Devolver una respuesta con el mensaje de eliminación lógica
        return Response({"message": "Rol eliminado lógicamente."}, status=status.HTTP_204_NO_CONTENT)


class RolOpcionesViewSet(viewsets.ModelViewSet):
    queryset = RolOpciones.objects.all()
    serializer_class = RolOpcionesSerializer

    def perform_destroy(self, instance):
        # Llamar al método delete del modelo (marcar como inactivo)
        instance.delete()

        # Devolver una respuesta con el mensaje de eliminación lógica
        return Response({"message": "RolOpciones eliminada lógicamente."}, status=status.HTTP_204_NO_CONTENT)


class RolUsuarioViewSet(viewsets.ModelViewSet):
    queryset = RolUsuario.objects.all()
    serializer_class = RolUsuarioSerializer

    def perform_destroy(self, instance):
        # Llamar al método delete del modelo (marcar como inactivo)
        instance.delete()

        # Devolver una respuesta con el mensaje de eliminación lógica
        return Response({"message": "RolUsuario eliminada lógicamente."}, status=status.HTTP_204_NO_CONTENT)


class RolRolOpcionesViewSet(viewsets.ModelViewSet):
    queryset = RolRolOpciones.objects.all()
    serializer_class = RolRolOpcionesSerializer

    def perform_destroy(self, instance):
        # Llamar al método delete del modelo (marcar como inactivo)
        instance.delete()

        # Devolver una respuesta con el mensaje de eliminación lógica
        return Response({"message": "RolRolOpciones eliminada lógicamente."}, status=status.HTTP_204_NO_CONTENT)


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def perform_destroy(self, instance):
        # Llamar al método delete del modelo (marcar como inactivo)
        instance.delete()

        # Devolver una respuesta con el mensaje de eliminación lógica
        return Response({"message": "Session eliminada lógicamente."}, status=status.HTTP_204_NO_CONTENT)


class InfoDatosBienvenidaView(APIView):
    def get(self, request, pk):
        try:
            # usamos parámetros para evitar inyección SQL
            with connection.cursor() as cursor:
                query = 'SELECT * FROM DatosUltimaSession(%s)'
                cursor.execute(query, [pk])  # Pasamos el parámetro de manera segura

                # obtenemos los resultados de la consulta
                resultado = cursor.fetchall()

                # Oobtenemos los nombres de las columnas
                columnas = [col[0] for col in cursor.description]

                # convertimos las filas en un diccionario
                resultado_sql = [dict(zip(columnas, fila)) for fila in resultado]

                return Response(resultado_sql, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error al consultar la base de datos: {str(e)}'},
                            status=status.HTTP_400_BAD_REQUEST)


class InfoDashboardView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                query = 'SELECT * FROM DatosDashboard()'
                cursor.execute(query)

                # Verifica si hay resultados
                resultado = cursor.fetchall()

                # Si no hay resultados, retornar una respuesta vacía o un mensaje adecuado
                if not resultado:
                    return Response({"message": "No data available"}, status=status.HTTP_200_OK)

                # Obtenemos los nombres de las columnas
                columnas = [col[0] for col in cursor.description]

                # Convertimos las filas en un diccionario
                resultado_sql = [dict(zip(columnas, fila)) for fila in resultado]

                return Response(resultado_sql[0], status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error al consultar la base de datos: {str(e)}'},
                            status=status.HTTP_400_BAD_REQUEST)


class MenuUsuarioView(APIView):
    def get(self, request, pk):
        try:
            # usamos parámetros para evitar inyección SQL
            with connection.cursor() as cursor:
                query = 'SELECT * FROM MenuUsuario(%s)'
                cursor.execute(query, [pk])  # Pasamos el parámetro de manera segura

                # obtenemos los resultados de la consulta
                resultado = cursor.fetchall()

                # Oobtenemos los nombres de las columnas
                columnas = [col[0] for col in cursor.description]

                # convertimos las filas en un diccionario
                resultado_sql = [dict(zip(columnas, fila)) for fila in resultado]

                return Response(resultado_sql, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error al consultar la base de datos: {str(e)}'},
                            status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        try:
            # Intentar obtener los datos de inicio de sesión
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                username = serializer.validated_data['username']
                password = serializer.validated_data['password']

                try:
                    # Buscar al usuario por su nombre de usuario
                    usuario = Usuario.objects.get(UserName=username)
                except Usuario.DoesNotExist:
                    # Si no existe el usuario, retornar un error
                    print('Usuario no encontrado')
                    return Response({"message": "Usuario no encontrado."}, status=status.HTTP_400_BAD_REQUEST)

                    # Verificar si el usuario tiene un estado activo
                if usuario.Status != 'Activo':
                    print('El usuario no tiene un estado activo.')
                    return Response({"message": "El usuario no tiene un estado activo."},
                                    status=status.HTTP_400_BAD_REQUEST)
                # Verificamos si el usuario tiene sesión activa
                if usuario.SessionActive == 'A':
                    print("El usuario ya tiene una sesión activa.")
                    return Response({"message": "El usuario ya tiene una sesión activa."},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Verificamos si la contraseña es correcta
                if password == usuario.Password:
                    # Registrar la nueva sesión
                    session = Session.objects.create(FechaIngreso=timezone.now(), Usuario=usuario)
                    usuario.SessionActive = 'A'
                    usuario.save()

                    # Responder con éxito y los datos de la sesión
                    return Response({
                        "message": "Inicio de sesión exitoso.",
                        "session": SessionSerializer(session).data
                    }, status=status.HTTP_200_OK)
                else:
                    print('Contraseña incorrecta.')
                    return Response({"message": "Contraseña incorrecta."}, status=status.HTTP_400_BAD_REQUEST)

            # Si el serializer no es válido, devolver los errores de validación con el formato deseado
            print("Datos de inicio de sesión inválidos.")
            return Response({"message": "Datos de inicio de sesión inválidos."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Capturar cualquier otro error y devolver una respuesta genérica de error del servidor
            print(f"Error inesperado: {str(e)}")
            return Response({"message": "Hubo un error inesperado. Por favor, inténtelo de nuevo más tarde."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    def get(self, request, pk):
        usuario = Usuario.objects.get(idUsuario=pk)  # Suponiendo que el usuario está autenticado
        if usuario.SessionActive == 'I':
            return Response({"detail": "No hay ninguna sesión activa."}, status=status.HTTP_400_BAD_REQUEST)

        # Cerrar sesión y marcar el status
        session = Session.objects.filter(Usuario=usuario, is_active=True).last()
        session.FechaCierre = timezone.now()
        session.is_active = False
        session.save()

        usuario.SessionActive = 'I'
        usuario.save()

        return Response({"detail": "Sesión cerrada exitosamente."}, status=status.HTTP_200_OK)


class RecuperarContresenaView(APIView):
    def post(self, request):
        # Usar el serializador para validar la entrada
        serializer = RecuperarContrasenaSerializer(data=request.data)
        if serializer.is_valid():
            # Obtener los datos validados
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']

            try:
                usuario = Usuario.objects.get(UserName=username, Mail=email)

                # Generar una nueva contraseña aleatoria
                nueva_contraseña = get_random_string(length=8)  # Contraseña de 8 caracteres aleatorios

                # Actualizar la contraseña en la base de datos
                usuario.Password = nueva_contraseña
                usuario.save()

                # Enviar la nueva contraseña por correo electrónico
                send_mail(
                    'Recuperación de Contraseña',
                    f'Tu nueva contraseña es: {nueva_contraseña}',
                    settings.DEFAULT_FROM_EMAIL,  # Esto es el email configurado en Django
                    [email],
                    fail_silently=False,
                )

                return Response({"message": "La nueva contraseña ha sido enviada a tu correo."},
                                status=status.HTTP_200_OK)

            except Usuario.DoesNotExist:
                return Response({"message": "Usuario no encontrado o los datos no coinciden."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CrearUsuariosView(APIView):
    def post(self, request):
        data = request.data  # Lista de usuarios a crear

        created_users = []  # Lista para almacenar los usuarios creados
        errors = []  # Lista para almacenar los errores

        # Iteramos sobre cada usuario recibido en la lista de datos
        for user_data in data:
            user_errors = []  # Lista de errores específicos para este usuario

            try:
                # Extraemos los datos de cada usuario
                user_name = user_data['Usuario']
                password = user_data['Contraseña']
                nombres = user_data['Nombres']
                apellidos = user_data['Apellidos']
                identificacion = user_data['Identificacion']
                fecha_nacimiento = user_data['FechaNacimiento']

                # Validamos los datos (usamos funciones de validación previas)
                validar_nombre_usuario(user_name)
                validar_contrasena(password)
                validar_identificacion(identificacion)

                # Generamos el correo
                correo = generar_correo(nombres, apellidos)

                # Creamos la persona
                persona = Persona.objects.create(
                    Nombres=nombres,
                    Apellidos=apellidos,
                    Identificacion=identificacion,
                    FechaNacimiento=fecha_nacimiento
                )

                # Creamos el usuario
                usuario = Usuario.objects.create(
                    UserName=user_name,
                    Password=password,
                    Mail=correo,
                    Persona=persona,
                    SessionActive=user_data.get('SessionActive', 'N'),
                    Status=user_data.get('Status', 'Activo')
                )

                # Añadimos el usuario creado a la lista de usuarios creados
                created_users.append(UsuarioSerializer(usuario).data)

            except ValidationError as e:
                # Si hay un error de validación, lo agregamos a la lista de errores de este usuario
                user_errors.append({
                    'error': str(e)
                })
            except Exception as e:
                # Cualquier otro error se captura aquí
                user_errors.append({
                    'error': f'Error inesperado: {str(e)}'
                })

            # Si hubo errores para este usuario, los agregamos a la lista global de errores
            if user_errors:
                errors.append({
                    'Usuario': user_data['Usuario'],
                    'errors': user_errors
                })

        # Si hay errores acumulados, devolvemos un estado HTTP 400 con los errores
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'created_users': created_users}, status=status.HTTP_201_CREATED)

# para probar la api de crear el usuario
# {
#   "UserName": "jdoe",
#   "Password": "SecurePassword123",
#   "Persona": {
#     "Nombres": "John",
#     "Apellidos": "Doe",
#     "Identificacion": "1234567890",
#     "FechaNacimiento": "1990-01-01"
#   },
#   "SessionActive": "Y",
#   "Status": "Activo"
# }

# Para probar el login
# {
#   "username": "DylanCard2009",
#   "password": "SecurePassword123*"
# }
# email


# {
#   "UserName": "jdoe",
#   "Password": "SecurePassword123",
#   "Persona": {
#     "Nombres": "John",
#     "Apellidos": "Doe",
#     "Identificacion": "1234567890",
#     "FechaNacimiento": "1990-01-01"
#   },
#   "SessionActive": "Y",
#   "Status": "Activo"
# }
