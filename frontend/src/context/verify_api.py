import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

def make_request(url, data=None, headers=None, method="POST"):
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    req_data = json.dumps(data).encode("utf-8") if data else None
    
    req = urllib.request.Request(
        url,
        data=req_data,
        headers=req_headers,
        method=method
    )
    
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            error_json = json.loads(error_body)
            detail = error_json.get("detail", error_body)
        except Exception:
            detail = error_body
        raise Exception(f"HTTP {e.code}: {detail}")

def test_auth_flow():
    print("Testing signup and registration endpoint...")
    signup_payload = {
        "email": "test_user@dayflow.com",
        "password": "password123",
        "role": "employee",
        "employee_id": "EMP888",
        "first_name": "Test",
        "last_name": "User",
        "department": "Engineering",
        "designation": "QA Engineer",
        "phone": "+1 (555) 123-4567",
        "join_date": "2026-08-22"
    }
    
    # 1. Sign Up
    try:
        status, response = make_request(f"{BASE_URL}/auth/signup", data=signup_payload)
        print(f"Signup successful: {response.get('email')} (ID: {response.get('id')})")
    except Exception as e:
        if "already registered" in str(e) or "already exists" in str(e):
            print("User already registered. Proceeding to login...")
        else:
            raise e
            
    # 2. Sign In / Login
    print("\nTesting login/signin endpoint...")
    login_payload = {
        "email": "test_user@dayflow.com",
        "password": "password123"
    }
    status, response = make_request(f"{BASE_URL}/auth/login", data=login_payload)
    token = response.get("access_token")
    user_info = response.get("user")
    print(f"Login successful! Received token: {token[:15]}... for user {user_info.get('email')}")
    
    # 3. Retrieve Session (/auth/me)
    print("\nTesting get current session (/auth/me) endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    status, response = make_request(f"{BASE_URL}/auth/me", headers=headers, method="GET")
    print(f"Me query successful! Returns role: {response.get('role')} (Employee ID: {response.get('employee', {}).get('employee_id')})")
    
    assert response.get("email") == "test_user@dayflow.com"
    assert response.get("role") == "employee"
    print("\nAuthentication flow integration check passed successfully!")

if __name__ == "__main__":
    try:
        test_auth_flow()
    except Exception as e:
        print(f"\nAPI Verification Failed: {e}")
        sys.exit(1)
