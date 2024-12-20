from rest_framework import serializers
from main.models import *
from django.contrib.auth.hashers import make_password, check_password

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        # Validar las credenciales del usuario
        try:
            usuario = Usuario.objects.get(UserName=data['username'])
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado.")

        if usuario.Status == 'bloqueado':
            raise serializers.ValidationError("El usuario está bloqueado.")


        return data

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'


class RolOpcionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolOpciones
        fields = '__all__'


class RolUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolUsuario
        fields = '__all__'


class RolRolOpcionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolRolOpciones
        fields = '__all__'


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'


class RecuperarContrasenaSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    identificacion = serializers.CharField(max_length=10)
    email = serializers.EmailField()

    def validate(self, data):
        # veridicamos que el usuario exista con el username, identificacion y email
        try:
            usuario = Usuario.objects.get(
                UserName=data['username'],
                Persona__Identificacion=data['identificacion'],
                Mail=data['email']
            )
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado o los datos no coinciden.")

        return data