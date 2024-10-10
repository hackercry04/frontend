from django.shortcuts import render
from google.oauth2 import id_token
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from project1_backend.jwtauthdecorator import user_required
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import User, OTP
import random
from google.auth.transport import requests
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.
def test(request):
    return HttpResponse("user")


def generateOTP():
    otp = random.randint(1000, 9999)
    return otp


def sendOTP(email, code, msg=""):
    subject = "Your OTP Code"
    message = f"Here is your{msg} OTP code: {code}"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]

    send_mail(subject, message, email_from, recipient_list)


@csrf_exempt
def signup(request):
    data = json.loads(request.body)
    fullname = data.get("fullName")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")

    if User.objects.filter(email=email).exists():
        return HttpResponse("Email already registered", status=400)

    user = User.objects.create_user(
        first_name=fullname,
        last_name=fullname,
        email=email,
        password=password,
        role="user",
        phone=phone,
    )

    otp = generateOTP()
    OTP.objects.filter(user_id=user.id).delete()
    OTP.objects.create(code=otp, user_id=user.id)
    sendOTP(email, otp)

    return HttpResponse("Signup successful")


@csrf_exempt
def confirm(request):
    data = json.loads(request.body)
    email = data.get("email")
    otp_code = data.get("otp")

    try:
        user = User.objects.get(email=email)
        otp = OTP.objects.get(code=otp_code, user_id=user.id)
        if otp.expired_at < timezone.now():
            return HttpResponse("Invalid OTP or OTP has expired", status=400)

        otp.delete()

        user.status = "active"
        user.save()

        return HttpResponse("Confirmation successful", status=200)

    except OTP.DoesNotExist:
        return HttpResponse("Invalid OTP", status=400)
    except User.DoesNotExist:
        return HttpResponse("User not found", status=404)
    # except Exception as e:
    #     return HttpResponse(f'Error: {str(e)}', status=500)


@csrf_exempt
def resendotp(request):
    data = json.loads(request.body)
    email = data.get("email")

    try:
        user = User.objects.get(email=email)
        code = generateOTP()

        otp, created = OTP.objects.update_or_create(
            user_id=user.id,
            defaults={
                "code": code,
                "is_otp_expired": False,
                "created_at": timezone.now(),
                "expired_at": timezone.now() + timedelta(minutes=5),
            },
        )

        sendOTP(email, code)

        return HttpResponse("OTP sent successfully", status=200)

    except User.DoesNotExist:
        return HttpResponse("User not found", status=404)
    except Exception as e:
        return HttpResponse(f"Error: {str(e)}", status=500)


@csrf_exempt
def google_login(request):
    """
    Verifies the Google ID token sent from the client and logs in the user.
    """
    data = json.loads(request.body)
    token = data.get("token")

    try:
        # Specify the CLIENT_ID of the app that accesses the backend
        client_id = settings.GOOGLE_CLIENT_ID

        # Verify the token and decode it
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)

        # If the token is valid, idinfo will contain user information
        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Wrong issuer.")

        # Get the user's Google ID
        google_user_id = idinfo["sub"]
        email = idinfo["email"]
        first_name = idinfo.get("given_name")
        last_name = idinfo.get("family_name")

        # Check if user already exists or create a new one
        # Assuming you have a custom user model or a User model that accepts these fields
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "status": "active",
            },
        )
        refresh = RefreshToken.for_user(user)
        refresh["role"] = "user"
        access = str(refresh.access_token)

        # Log in the user or create a session token, return appropriate response
        response_data = {
            "refresh": str(refresh),
            "access": str(access),
            "message": "User authenticated successfully",
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
        }
        return JsonResponse(response_data, status=200)

    except ValueError as e:
        # Invalid token
        return JsonResponse({"error": str(e)}, status=400)

    except Exception as e:
        # Handle other exceptions
        return JsonResponse({"error": "An error occurred: " + str(e)}, status=500)


@csrf_exempt
def emailvalid(request):
    data = json.loads(request.body)
    email = data.get("email")
    user = User.objects.get(email=email)
    if user.status == "active":
        return HttpResponse("user already verified", status=400)

    if not email:
        return HttpResponse("Email is required", status=400)

    # Generate OTP and send it
    code = generateOTP()
    sendOTP(email, code, "forgot password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return HttpResponse("No user found with the email", status=404)

    # Check if OTP already exists for the user
    try:
        otp_record = OTP.objects.get(user_id=user.id)
        otp_record.code = code  # Update the OTP code
        otp_record.save()
    except OTP.DoesNotExist:
        # Create a new OTP record if it doesn't exist
        OTP.objects.create(user=user, code=code)

    return HttpResponse("Success")


@csrf_exempt
def password_reset_emailvalidate(request):
    data = json.loads(request.body)
    email = data.get("email")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return HttpResponse("email does not exist", status=404)
    if user.status == "inactive":
        return HttpResponse("user is not active", status=400)

    if not email:
        return HttpResponse("Email is required", status=400)

    # Generate OTP and send it
    code = generateOTP()
    sendOTP(email, code, "forgot password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return HttpResponse("No user found with the email", status=404)

    # Check if OTP already exists for the user
    try:

        otp_record = OTP.objects.get(user_id=user.id)
        otp_record.code = code  # Update the OTP code
        otp_record.save()
    except OTP.DoesNotExist:
        # Create a new OTP record if it doesn't exist
        OTP.objects.create(user_id=user.id, code=code)

    return HttpResponse("Sucess")


def change_password_with_otp(request):
    data = json.loads(request.body)
    email = data.get("email")
    newpass = data.get("password")
    otp = data.get("otp")
    user = User.objects.get(email=email)
    code = OTP.objects.get(user_id=user.id)

    print(type(code), type(otp))
    if code.code == otp:
        user = User.objects.get(email=email)
        user.set_password(newpass)
        user.save()
        code.delete()
        return HttpResponse("password updated successfully", status=200)

    return HttpResponse("wrong otp", status=404)


##code related to user side authentication
