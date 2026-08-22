import subprocess
import os

def analyze_domain(domain: str) -> str:
    """
    Performs ping check on the target domain for the Rakshak URL analyzer module.
    Vulnerable to command injection if domain contains shell metacharacters.
    """
    cmd = f"ping -n 1 {domain}"
    try:
        # shell=True allows command chaining/injection
        process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate(timeout=5)
        return stdout if process.returncode == 0 else f"Error: {stderr or stdout}"
    except Exception as e:
        return f"Error: {str(e)}"
