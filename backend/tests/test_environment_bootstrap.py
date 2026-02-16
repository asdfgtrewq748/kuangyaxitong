from app.main import app


def test_app_package_importable_in_repo_level_pytest():
    assert app is not None

