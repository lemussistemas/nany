from django.contrib import admin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("created_at", "role", "name", "phone")
    list_filter = ("role",)
    search_fields = ("name", "phone")
    readonly_fields = ("created_at",)
