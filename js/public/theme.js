const toggle = document.getElementById("themeToggle");

if(toggle){

toggle.onclick = ()=>{

document.body.classList.toggle("light-mode");

localStorage.setItem(
"theme",
document.body.classList.contains("light-mode")
? "light"
: "dark"
);

}

}

const saved = localStorage.getItem("theme");

if(saved === "light"){
document.body.classList.add("light-mode");
}
