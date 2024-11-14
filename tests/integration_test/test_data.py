from app.service.db import get_db


class TestDB:
    def test_get_db(self):
        result = get_db()
        print(result)
