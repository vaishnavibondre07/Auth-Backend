export function validateUsername(username){
    const usernamePattern=/^[A-Za-z]{3,}$/;
    return usernamePattern.test(username);
}

export function validateEmail(email){
   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailPattern.test(email)
}

export function validatePassword(password){
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordPattern.test(password)
}

