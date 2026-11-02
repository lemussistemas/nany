from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .serializers import LeadSerializer


class LeadThrottle(AnonRateThrottle):
    scope = "leads"


class LeadCreateView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LeadThrottle]

    def post(self, request):
        serializer = LeadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"ok": True, "message": "Listo. Te vamos a llamar."},
            status=status.HTTP_201_CREATED,
        )
