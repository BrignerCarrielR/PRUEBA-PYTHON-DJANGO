from django.db import models
from main.utils.contantes import Constantes

constantes = Constantes()
estado_session = constantes.ConstSessionActive()
status = constantes.ConstStatus()


class Persona(models.Model):
    idPersona = models.AutoField(primary_key=True)
    Nombres = models.CharField(max_length=60)
    Apellidos = models.CharField(max_length=60)
    Identificacion = models.CharField(max_length=10)
    FechaNacimiento = models.DateField()
    is_active = models.BooleanField(default=True)  # Eliminación lógica

    def delete(self, *args, **kwargs):
        self.usuario_set.update(Persona=None)
        self.is_active = False
        self.save()

    def __str__(self):
        return f"{self.Nombres} {self.Apellidos}"

class Usuario(models.Model):
    idUsuario = models.AutoField(primary_key=True)
    UserName = models.CharField(max_length=50)
    Password = models.CharField(max_length=50)
    Mail = models.CharField(max_length=120)
    SessionActive = models.CharField(max_length=1, choices=estado_session, default=estado_session[0][0], blank=False, null=False)
    Persona = models.ForeignKey(Persona, on_delete=models.SET_NULL, null=True)  # Cambio a SET_NULL
    Status = models.CharField(max_length=20, choices=status, default=status[0][0], blank=False, null=False)
    is_active = models.BooleanField(default=True)  # Eliminación lógica

    def __str__(self):
        return self.UserName

    def delete(self, *args, **kwargs):
        self.is_active = False  # Marcar como inactivo
        self.save()

class Rol(models.Model):
    idRol = models.AutoField(primary_key=True)
    RolName = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)  # Eliminación lógica

    def __str__(self):
        return self.RolName

    def delete(self, *args, **kwargs):
        self.is_active = False  # Marcar como inactivo
        self.save()

class RolOpciones(models.Model):
    idOpcion = models.AutoField(primary_key=True)
    NombreOpcion = models.CharField(max_length=50)
    Url = models.CharField(max_length=100, default='/')
    is_active = models.BooleanField(default=True)  # Eliminación lógica

    def __str__(self):
        return self.NombreOpcion

    def delete(self, *args, **kwargs):
        self.is_active = False  # Marcar como inactivo
        self.save()

class RolUsuario(models.Model):
    Rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True)  # Cambio a SET_NULL
    Usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)  # Cambio a SET_NULL
    is_active = models.BooleanField(default=True)  # Eliminación lógica

    class Meta:
        unique_together = ('Rol', 'Usuario')

    def delete(self, *args, **kwargs):
        self.is_active = False  # Marcar como inactivo
        self.save()

class RolRolOpciones(models.Model):
    Rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True)  # Cambio a SET_NULL
    RolOpciones = models.ForeignKey(RolOpciones, on_delete=models.SET_NULL, null=True)  # Cambio a SET_NULL
    is_active = models.BooleanField(default=True)  # Eliminación lógica

    class Meta:
        unique_together = ('Rol', 'RolOpciones')

    def delete(self, *args, **kwargs):
        self.is_active = False  # Marcar como inactivo
        self.save()

class Session(models.Model):
    FechaIngreso = models.DateTimeField()
    FechaCierre = models.DateTimeField(null=True)
    Usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)  # Cambio a SET_NULL
    is_active = models.BooleanField(default=True)  # Eliminación lógica

    def __str__(self):
        return f"Session {self.FechaIngreso} - {self.Usuario.UserName}"

    def delete(self, *args, **kwargs):
        self.is_active = False  # Marcar como inactivo
        self.save()

