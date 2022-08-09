from rest_framework import permissions, views, status, response
from django.db import transaction
from django.http import HttpRequest

from .models import Withdrawal


# Create your views here.
class Withdraw(views.APIView):
    permission_classes = (permissions.IsAuthenticated)

    @transaction.atomic
    def post(self, request: HttpRequest, *args, **kwargs):
        amount = request.data.get('amount')
        iban = request.data.get('iban')
        
        if amount is None:
            return response.Response({'error': 'amount is required'}, status=status.HTTP_400_BAD_REQUEST)
        if iban is None:
            return response.Response({'error': 'iban is required'}, status=status.HTTP_400_BAD_REQUEST)
        if amount > request.user.wallet.balance:
            return response.Response({'error': 'insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.wallet.balance -= amount
        request.user.wallet.save()
        Withdrawal.objects.create(user=request.user, amount=amount, iban=iban)
        return response.Response({'success': 'withdrawal successful'}, status=status.HTTP_200_OK)
