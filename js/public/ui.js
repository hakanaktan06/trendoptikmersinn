const navbar=document.querySelector(".navbar")
const themeToggle=document.getElementById("themeToggle")

window.addEventListener("scroll",()=>{
navbar?.classList.toggle("scrolled",window.scrollY>50)
})

if(themeToggle){

if(localStorage.getItem("theme")==="light"){
document.body.classList.add("light-mode")
}

themeToggle.addEventListener("click",()=>{

document.body.classList.toggle("light-mode")

localStorage.setItem(
"theme",
document.body.classList.contains("light-mode")?"light":"dark"
)

})

}

const heroImages=document.querySelectorAll(".hero-img")
let current=0

function updateSlider(){

heroImages.forEach(img=>img.classList.remove("active","left","right"))

if(heroImages.length===0) return

heroImages[current].classList.add("active")

heroImages[(current-1+heroImages.length)%heroImages.length].classList.add("left")
heroImages[(current+1)%heroImages.length].classList.add("right")

}

updateSlider()

setInterval(()=>{
current=(current+1)%heroImages.length
updateSlider()
},4000)