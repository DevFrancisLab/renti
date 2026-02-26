from django.db import models


# The original USSD handler (``communications/views.py``) assumes the
# existence of three models: ``Tenant``, ``Property`` and
# ``MaintenanceRequest``.  In the absence of a more detailed domain
# design the classes below provide just enough structure for the view
# to import them and for basic lookups to succeed.


class Tenant(models.Model):
	name = models.CharField(max_length=100)
	phone_number = models.CharField(max_length=20, unique=True)

	def __str__(self):
		return self.name

	def get_rent_balance(self, property_obj, room_number):
		"""Return the current rent balance for a given room.

		This is a stub implementation; a real project would calculate the
		balance from transactions or a billing ledger.  For now we return
		a fixed amount so that the USSD flow can complete without error.
		"""

		return "Ksh 15,000"


class Property(models.Model):
	name = models.CharField(max_length=100)
	tenants = models.ManyToManyField(Tenant, related_name="properties")
	rooms = models.TextField(default="", help_text="Comma-separated list of room numbers")

	def __str__(self):
		return self.name

	def get_rooms_for_tenant(self, tenant):
		"""Return the set of room identifiers associated with ``tenant``.

		The USSD view simply checks membership in this collection when the
		user types a room number.  Rooms are stored as a comma-separated list.
		"""
		if not self.rooms:
			return []
		return [room.strip() for room in self.rooms.split(',')]
	
	def set_rooms(self, room_list):
		"""Set rooms from a list of room identifiers."""
		self.rooms = ','.join(str(room).strip() for room in room_list)
		self.save()


class MaintenanceRequest(models.Model):
	tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
	property = models.ForeignKey(Property, on_delete=models.CASCADE)
	room_number = models.CharField(max_length=20)
	description = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.tenant} @ {self.property} room {self.room_number}"

