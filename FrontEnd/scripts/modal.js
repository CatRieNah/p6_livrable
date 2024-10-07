// Récupération des travaux depuis l'API
import { getWorks } from "./index.js";
import { token } from "./logUser.js";
const galleryModal = document.querySelector(".gallery-modal")
export async function displayWorksInModal(){
    const works = await getWorks()
    galleryModal.innerHTML =""
    works.forEach(work => {
        const figure = createFigureInModal(work)
        galleryModal.appendChild(figure)
    })
}
function createFigureInModal(work){
    const figure = document.createElement("figure")
    figure.id = work.id
    const img = document.createElement("img")
    img.src = work.imageUrl
    img.alt = work.title 
    const span = document.createElement("span")
    const i = document.createElement("i")
    i.id = work.id
    i.classList.add("fa-solid", "fa-trash-can")
    span.appendChild(i)
    figure.appendChild(img)
    figure.appendChild(span)
    return figure
}

//Suppression des travaux 
 export async function deleteWork(){
    await displayWorksInModal()
    const iconsTrash = document.querySelectorAll(".gallery-modal i")
    iconsTrash.forEach(trash => {
        trash.addEventListener("click",async (event)=>{
            const idTrash = event.target.id
            if(idTrash){
                //appel fetch 
                const response = await fetch(`http://localhost:5678/api/works/${idTrash}`,{
                    method: "DELETE",
                    headers: {'Authorization': `Bearer ${token}`}
                })
            }else{
                throw new Error("Suppression non autorisée")
            }
            //Suppression de l'image dans la modale
            const figureModal = document.querySelectorAll(".gallery-modal figure")
            figureModal.forEach(figure => {
                if(figure.id === idTrash){
                    figure.remove()
                }
            });
            //Suppression de l'image dans la galerie 
            const figureGallery = document.querySelectorAll(".gallery figure")
            figureGallery.forEach(figure => {
                if(figure.id === idTrash){
                    figure.remove()
                }
            });
        })
    });
}
deleteWork()
