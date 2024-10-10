from django.urls import path
from . import views

urlpatterns = [
    path("test/", views.test),
    path("signup/", views.signup),
    path("confirm-email/", views.confirm),
    path("resend-otp/", views.resendotp),
    path("google-login/", views.google_login),
    path("emailvalid/", views.emailvalid),
    path("changepassword/", views.change_password_with_otp),
    path("password/emailvalidate/", views.password_reset_emailvalidate),
]
