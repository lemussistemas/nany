from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Nanny Ideal"
admin.site.site_title = "Nanny Ideal"
admin.site.index_title = "Solicitudes"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("leads.urls")),
]
