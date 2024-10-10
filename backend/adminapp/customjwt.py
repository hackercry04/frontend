from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["role"] = "admin" if (user.role == "admin") else "user"

        return token

    def validate(self, attrs):
        # Call the superclass validate method to get the token data
        data = super().validate(attrs)

        # Add custom user verification logic
        user = self.user

        # Check if the user is active (OTP verified)
        if (
            user.status == "inactive"
        ):  # Or use the appropriate field for OTP verification
            raise serializers.ValidationError(
                "Your account is not active. Please verify your OTP."
            )

        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
