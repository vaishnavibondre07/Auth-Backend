export function validateUsername(username){
    const usernamePattern=/^[A-Za-z]{3,20}$/;
    return usernamePattern.test(username);
}


export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailPattern.test(email);
}

export function validatePassword(password) {
  const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*\-_]).{8,20}$/;
  return passwordPattern.test(password);
}

