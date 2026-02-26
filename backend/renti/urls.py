"""
URL configuration for renti project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from communications import views as communications_views

urlpatterns = [
    path('admin/', admin.site.urls),
    # Accept both /ussd and /ussd/ because some USSD gateways POST without a trailing slash
    path('ussd', communications_views.ussd),
    path('ussd/', include('communications.urls')),
]
