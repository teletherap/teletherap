from django.http import HttpRequest
from rest_framework import permissions

from . import models


class IsTherapist(permissions.BasePermission):
    message = 'You must be a therapist to perform this action.'

    def has_permission(self, request: HttpRequest, view):
        return models.Therapist.objects.filter(user=request.user).exists()

class IsNotApprovedTherapist(permissions.BasePermission):
    message = 'You are already approved as a therapist. You cannot perform this action.'

    def has_permission(self, request: HttpRequest, view):
        return request.user.therapist.is_approved is False


class IsClient(permissions.BasePermission):
    message = 'You must be a client to perform this action.'

    def has_permission(self, request: HttpRequest, view):
        return models.Client.objects.filter(user=request.user).exists()


class IsDocumentOwner(permissions.BasePermission):
    message = 'You must be the owner of the document you are trying to perform this action on.'

    def has_object_permission(self, request: HttpRequest, view, document: models.TherapistDocuments):
        return document.therapist == request.user.therapist
