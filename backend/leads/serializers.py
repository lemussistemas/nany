from rest_framework import serializers

from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    phone = serializers.CharField()

    class Meta:
        model = Lead
        fields = ["role", "name", "phone"]

    def validate_name(self, value: str) -> str:
        cleaned = " ".join(value.split())
        if len(cleaned) < 3:
            raise serializers.ValidationError("Escribe tu nombre.")
        return cleaned

    def validate_phone(self, value: str) -> str:
        digits = "".join(character for character in value if character.isdigit())
        if digits.startswith("503") and len(digits) > 8:
            digits = digits[-8:]
        if len(digits) != 8:
            raise serializers.ValidationError("El celular lleva 8 números.")
        return digits
