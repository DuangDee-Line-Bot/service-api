from app.service.otp import generate_otp


class TestOTP:
    def test_generate_otp(self):
        result = generate_otp()
        print(result)
