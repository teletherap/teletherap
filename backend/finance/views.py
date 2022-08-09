from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from knox.auth import TokenAuthentication
from zeep import Client
from django.conf import settings
from django.db import transaction
from rest_framework.response import Response
from .models import Wallet, Deposit
import action
# Create your views here. 

MERCHANT = settings.PAYMENT_SETTING['MERCHANT']
the_client = None

def get_client():
    global the_client

    if the_client:
        return the_client
    
    wsdl = settings.PAYMENT_SETTING['wsdl']
    the_client = Client(wsdl)
    return the_client


def send_payment_request(callback_url: str, amount: int, desctiption: str, email: str = None, mobile: str = None):
    client = get_client()
    return client.service.PaymentRequest(MERCHANT, amount, desctiption, email, mobile, callback_url)

def verify(authority: str, amount: float):
    client = get_client()
    return client.service.PaymentVerification(MERCHANT, authority, amount)

class ErrorResponse(Response):
    
    def __init__(self, data, status_code: int = 400):
        super().__init__(data)
        self.status_code = status_code

class PaymentViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @action(methods=['GET'], detail=False)
    def request(self, request):

        callback_url = request.query_params.get("callback", None)
        if callback_url is None:
            return ErrorResponse({
                'message': "`callback` should be passed in query string"
            })

        amount = request.query_params.get("amount", None)
        if amount is None:
            return ErrorResponse({
                "message": "`amount` should be passed in query string"
            })

        callback_url += f'/{amount}/'

        description = settings.PAYMENT_SETTING['description'].format(request.user.email)
        result = send_payment_request(callback_url, amount, description, request.user.email)

        if result.Status != 100:
            return ErrorResponse({
                'message': "An error occured!",
                'code': result.Status
            })

        payment_url = settings.PAYMENT_SETTING['payment_url']

        return Respons({
            "redirect_url": f"{payment_url}{result.Authority}"
        })

    @action(methods=['GET'], detail=False)
    def verify(self, request):

        if request.query_params.get('Status', None) == 'OK':
            authority = request.query_params.get('Authority', None)
            if authority is None:
                return ErrorResponse({
                    'message': 'Authority should be passed in query string'
                }, status_code=403)

            amount = request.query_params.get('amount', None)
            if amount is None:
                return ErrorResponse({
                    'message': 'amount should be passed in query string'
                }, status_code=403)
            

            result = verify(authority, amount)

            if result.Status == 100:
                # payment is successful
                with transaction.atomic():
                    deposit = Deposit.objects.create(request.user, request.date, amount, result.RefID)
                return Response({
                    "message": 'OK',
                    "RefID": result.RefID
                })

            if result.Status == 101:
                return ErrorResponse({'status': 'ALREADY SUBMITTED'})


            return ErrorResponse({
                'message': 'FAILED',
                'status': result.Status
            })

        return ErrorResponse({
            'message': 'FAILED|CANCELLED'
        })
