from django.db import migrations


def create_default_groups(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.bulk_create([
        Group(name='LEARNER'),
        Group(name='CREATOR')
    ])


def create_superuser(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    Group = apps.get_model('auth', 'Group')
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@email.com',
            password='admin',

        )
        groups = Group.objects.filter(name__in=['LEARNER', 'CREATOR'])
        admin.groups.add(*groups)


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(create_default_groups),
        migrations.RunPython(create_superuser),
    ]
