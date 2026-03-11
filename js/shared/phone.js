export function normalizePhone(phone) {

  let p = phone.replace(/\D/g, '');

  if (p.startsWith("0")) {
    p = p.substring(1);
  }

  if (!p.startsWith("90")) {
    p = "90" + p;
  }

  return p;
}

export function displayPhone(phone){

  if(phone.startsWith("90")){
    phone = phone.substring(2);
  }

  return "0" + phone;
}
