from django.db import models


class Lead(models.Model):
    class Role(models.TextChoices):
        FAMILIA = "familia", "Familia"
        TRABAJO = "trabajo", "Busca trabajo"

    role = models.CharField("puerta", max_length=16, choices=Role.choices)
    name = models.CharField("nombre", max_length=80)
    phone = models.CharField("celular", max_length=8)
    created_at = models.DateTimeField("recibido", auto_now_add=True)

    class Meta:
        verbose_name = "solicitud"
        verbose_name_plural = "solicitudes"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.get_role_display()} · {self.name}"
