from django.contrib import admin

from . import models


# Register your models here.
admin.site.register(models.Client)

class TherapistDocumentInline(admin.TabularInline):
    model = models.TherapistDocuments
    extra = 1


class TherapistAdmin(admin.ModelAdmin):
    inlines = [TherapistDocumentInline]


admin.site.register(models.Therapist, TherapistAdmin)
