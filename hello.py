# script.py
import getpass
import hashlib

def encrypt_password(password):
    # Perform encryption (e.g., hash the password)
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    return hashed_password

if __name__ == "__main__":
    # Prompt for password
    password = getpass.getpass(prompt="Enter password: ")

    # Encrypt the password
    encrypted_password = encrypt_password(password)
    print("Encrypted password:", encrypted_password)
