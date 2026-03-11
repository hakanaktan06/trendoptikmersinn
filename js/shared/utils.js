export function showToast(msg){

  const toast = document.createElement("div");

  toast.innerText = msg;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 18px";
  toast.style.background = "#000";
  toast.style.color = "#fff";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);

  setTimeout(()=>{

    toast.remove()

  },2500)

}

export function sanitize(text){

  const div = document.createElement("div");

  div.innerText = text;

  return div.innerHTML;

}
