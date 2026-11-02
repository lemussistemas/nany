from django.test import TestCase
from rest_framework.test import APIClient

from .models import Lead


class LeadApiTests(TestCase):
    def test_creates_lead_and_normalizes_phone(self) -> None:
        response = APIClient().post(
            "/api/leads/",
            {"role": "familia", "name": "  Ana  López ", "phone": "+503 7012-3456"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        lead = Lead.objects.get()
        self.assertEqual(lead.name, "Ana López")
        self.assertEqual(lead.phone, "70123456")
        self.assertEqual(lead.role, Lead.Role.FAMILIA)

    def test_rejects_a_short_phone(self) -> None:
        response = APIClient().post(
            "/api/leads/",
            {"role": "trabajo", "name": "María", "phone": "123"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Lead.objects.count(), 0)
