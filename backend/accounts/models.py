from django.db import models
from django.contrib.auth.models import AbstractUser, Group


class User(AbstractUser):
    ALLOWED_ROLES = ('CREATOR', 'LEARNER')  # Allowed roles from regular users
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    @property
    def roles(self):
        if self.is_superuser:
            all_roles = list(self.ALLOWED_ROLES)
            all_roles.append('ADMIN')
            return all_roles
        return [grp.name for grp in self.groups.all()]

    @roles.setter
    def roles(self, roles):
        roles = [role for role in roles if role in self.ALLOWED_ROLES]
        current_groups = set(self.groups.values_list('name', flat=True))
        new_groups = set(roles)
        groups_to_remove = current_groups - new_groups
        if groups_to_remove:
            remove_groups = Group.objects.filter(name__in=groups_to_remove)
            self.groups.remove(*remove_groups)
        groups_to_add = new_groups - current_groups
        if groups_to_add:
            add_groups = Group.objects.filter(name__in=groups_to_add)
            self.groups.add(*add_groups)
