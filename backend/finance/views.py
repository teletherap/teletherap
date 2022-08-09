from rest_framework import permissions, views, status, response, viewsets
from suds.client import Client
from django.conf import settings
from django.db import transaction
from rest_framework.response import Response
from .models import Wallet, Deposit
from django.db import transaction
from django.http import HttpRequest

from .models import Withdrawal
# Create your views here. 


def send_payment_request(callback_url: str, amount: int, description: str, email: str = None, mobile: str = None):
    client = Client(settings.PAYMENT_SETTINGS['wsdl'])
    return client.service.PaymentRequest(settings.PAYMENT_SETTINGS['MERCHANT'],
                                         amount,
                                         description,
                                         email,
                                         mobile,
                                         callback_url)

def verify(authority: str, amount: float):
    client = Client(settings.PAYMENT_SETTINGS['wsdl'])
    return client.service.PaymentVerification(settings.PAYMENT_SETTINGS['MERCHANT'], authority, amount)


class RequestDeposit(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: HttpRequest, *args, **kwargs):

        callback_url = request.data.get("callback")
        if callback_url is None:
            return Response({
                'message': "`callback` should be passed in query string"
            }, status=status.HTTP_400_BAD_REQUEST)

        amount = float(request.data.get("amount"))
        if amount is None:
            return Response({
                "message": "`amount` should be passed in query string"
            }, status=status.HTTP_400_BAD_REQUEST)

        callback_url = callback_url.replace(':amount', str(amount))\
            .replace(':username', request.user.username)

        description = settings.PAYMENT_SETTINGS['description'].format(request.user.username)
        result = send_payment_request(callback_url, amount, description, request.user.email)

        if result.Status != 100:
            return Response({
                'message': "An error occured!",
                'code': result.Status
            }, status=status.HTTP_400_BAD_REQUEST)

        payment_url = settings.PAYMENT_SETTINGS['payment_url'].format(result.Authority)

        return Response({
            "redirect_url": payment_url
        })

class VerifyDeposit(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: HttpRequest, username: str, amount: str, *args, **kwargs):

        if request.query_params.get('Status', None) == 'OK':
            authority = request.query_params.get('Authority', None)
            if authority is None:
                return Response({
                    'message': 'Authority should be passed in query string'
                }, status=status.HTTP_400_BAD_REQUEST)

            if username != request.user.username:
                return Response({
                    'message': 'Not for this user'
                }, status=status.HTTP_403_FORBIDDEN)

            amount = float(amount)
            result = verify(authority, amount)

            if result.Status == 100:
                # payment is successful
                with transaction.atomic():
                    Deposit.objects.create(user=request.user, amount=amount, ref_id=result.RefID)
                    request.user.wallet.balance += amount
                    request.user.wallet.save()

                return Response({
                    "message": 'OK',
                    "RefID": result.RefID
                })

            if result.Status == 101:
                return Response({'status': 'ALREADY SUBMITTED'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                'message': 'FAILED',
                'status': result.Status
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'message': 'FAILED|CANCELLED'
        }, status=status.HTTP_400_BAD_REQUEST)


class Withdraw(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @transaction.atomic
    def post(self, request: HttpRequest, *args, **kwargs):
        amount = float(request.data.get('amount'))
        iban = request.data.get('iban')
        
        if amount is None:
            return response.Response({'error': 'amount is required'}, status=status.HTTP_400_BAD_REQUEST)
        if iban is None:
            return response.Response({'error': 'iban is required'}, status=status.HTTP_400_BAD_REQUEST)
        if amount > request.user.wallet.balance:
            return response.Response({'error': 'insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.wallet.balance -= amount
        request.user.wallet.save()
        Withdrawal.objects.create(user=request.user, amount=amount, destination_iban=iban)
        return response.Response({'success': 'withdrawal successful'}, status=status.HTTP_200_OK)
