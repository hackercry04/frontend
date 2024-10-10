from functools import wraps
from django.shortcuts import redirect
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from django.http import HttpResponse


def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        # Check if the user is authenticated via JWT
        print(request.user.role)
        if request.user.is_authenticated and request.user.role == "admin":
            return view_func(request, *args, **kwargs)
        else:
            return HttpResponse(
                "You do not have permission to access this resource.", status=401
            )  # Redirect to a specific page for non-admins

    return _wrapped_view


def user_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):

        # Check if the user is authenticated via JWT
        if (
            request.user.is_authenticated
            and request.user.status == "active"
            and request.user.role != "admin"
        ):
            return view_func(request, *args, **kwargs)
        else:
            return HttpResponse(
                "You do not have permission to access this resource.", status=401
            )  # Redirect to a specific page for admins

    return _wrapped_view
