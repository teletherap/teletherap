from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction, models
from rest_framework import serializers, validators
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Client, Therapist, TherapistDocuments
from .verification import Verifier
from finance.models import Wallet
from therapy.serializers import PublicReservationSerializer, ReviewSerializer
from therapy.models import Review, Reservation


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user: User):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
        return token


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[validators.UniqueValidator(queryset=User.objects.all())])

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] == attrs['password2']:
            return attrs
        raise serializers.ValidationError({"password": "Password fields didn't match."})

    @transaction.atomic
    def create(self, validated_data: dict):
        user: User = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'])

        user.is_active = False
        user.set_password(validated_data['password'])
        user.save()

        verifier = Verifier(user)
        verifier.send_verification_email()

        Wallet.objects.create(user=user)

        return user


class UserInfoSerializer(serializers.ModelSerializer):
    is_therapist = serializers.SerializerMethodField()
    wallet_balance = serializers.SerializerMethodField()

    def get_is_therapist(self, obj: User) -> bool:
        return Therapist.objects.filter(user=obj).exists()

    def get_wallet_balance(self, obj: User) -> float:
        return obj.wallet.balance

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'is_therapist', 'wallet_balance')


class ClientRegisterSerializer(RegisterSerializer):
    def create(self, validated_data: dict):
        user: User = super().create(validated_data)
        Client.objects.create(user=user)
        return user


class TherapistRegisterSerializer(RegisterSerializer):
    def create(self, validated_data: dict):
        user: User = super().create(validated_data)
        Therapist.objects.create(user=user)
        return user


class TherapistDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TherapistDocuments
        fields = ('therapist', 'name', 'document')


class PrivateTherapistSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    documents = TherapistDocumentsSerializer(many=True, read_only=True)
    is_approved = serializers.BooleanField(read_only=True)

    class Meta:
        model = Therapist
        fields = ('user', 'description',
                  'license_id', 'expertise',
                  'years_of_experience',
                  'price_per_session',
                  'daily_start_time',
                  'daily_end_time',
                  'telegram_username',
                  'is_approved', 'documents')


class PrivateClientSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Client
        fields = ('user', 'telegram_username')


class PublicTherapistSerializer(serializers.ModelSerializer):
    upcoming_reservations = PublicReservationSerializer(many=True, read_only=True)
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    attended_sessions_count = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    def get_first_name(self, obj: Therapist):
        return obj.user.first_name

    def get_last_name(self, obj: Therapist):
        return obj.user.last_name

    def get_average_rating(self, obj: Therapist):
        return Review.objects \
            .filter(reservation__therapist=obj) \
            .aggregate(average_rating=models.Avg('rating'))['average_rating']

    def get_attended_sessions_count(self, obj: Therapist):
        return obj.reservations.filter(state=Reservation.State.ATTENDED).count()

    def get_reviews(self, obj: Therapist):
        return ReviewSerializer(Review.objects.filter(reservation__therapist=obj), many=True).data

    class Meta:
        model = Therapist
        fields = ('user', 'description',
                  'license_id', 'expertise',
                  'years_of_experience',
                  'price_per_session',
                  'daily_start_time',
                  'daily_end_time',
                  'upcoming_reservations',
                  'first_name', 'last_name',
                  'average_rating',
                  'attended_sessions_count',
                  'reviews')
