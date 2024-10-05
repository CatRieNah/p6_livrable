// Récupération des travaux depuis l'API
import { getWorks } from "./index.js";
const galleryModal = document.querySelector(".gallery-modal")
async function displayWorksInModal(){
    const works = await getWorks()
    works.forEach(work => {
        const figure = createFigureInModal(work)
        galleryModal.appendChild(figure)
    })
}
function createFigureInModal(work){
    const figure = document.createElement("figure")
    const img = document.createElement("img")
    img.src = work.imageUrl
    img.alt = work.title 
    const span = document.createElement("span")
    const i = document.createElement("i")
    i.classList.add("fa-solid", "fa-trash-can")
    span.appendChild(i)
    figure.appendChild(img)
    figure.appendChild(span)
    return figure
}
