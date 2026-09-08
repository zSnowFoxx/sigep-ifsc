export const verifyPassword = (_email: string, pw: string) => pw.length > 0;
export const updatePassword = (_email: string, _pw: string) => true;

export function passwordMeetsRules(pw: string) {
  return pw.length >= 8 && /\d/.test(pw) && /[@#$%^&*!?]/.test(pw);
}