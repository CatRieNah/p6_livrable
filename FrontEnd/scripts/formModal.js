//Récupération des catégories 
import { token } from "./logUser.js"
import { displayWorksInModal } from "./modal.js"
import { displayWorksInGallery } from "./index.js"
import { deleteWork } from "./modal.js"
async function getCategories(){
    try {
        //appel fetch pour récupérer les données 
        const response = await fetch("http://localhost:5678/api/categories")
        if(response.status === 200){
            const categories = await response.json()
            return categories
        }else{
            throw new Error("Unexpected Error"+response.status)
        }
    } catch (error) {
        console.error(error.message)
    }
}
getCategories()
//Ajout des options dans select
const inputSelect = document.getElementById("category")
async function displayOptionSelect(){
    const categories = await getCategories()
    categories.forEach(category => {
        createOption(category)
    });
}
displayOptionSelect()
function createOption(category){
    const option = document.createElement("option")
    option.value = category.id
    option.textContent = category.name
    inputSelect.appendChild(option)
}
//Afficher l'image à envoyer 
const addGallery = document.querySelector(".add_gallery");
const inputFile = document.querySelector(".add_gallery input[type='file']");
const iconImage = document.querySelector(".fa-image");
const labelImage = document.querySelector(".add_gallery label");
const pImage = document.querySelector(".add_gallery p");
inputFile.addEventListener("change",()=>{
    insertImage()
})
function insertImage(){
    const files = inputFile.files //Récupérer toutes les listes de fichiers sélectionnés
    for(let i =0; i < files.length; i++){
        const file = files[i]
        //créer une nouvelle instance filereader
        const reader = new FileReader()
        reader.onload = function(event){
            //Créer un élément img
            const img = document.createElement("img")
            img.src = event.target.result
            img.style.width = "100%"
            addGallery.appendChild(img)
        }
        iconImage.style.display = "none"
        labelImage.style.display = "none"
        pImage.style.display = "none"
        reader.readAsDataURL(file)    
    }
}
//Verifier si tous les champs sont remplis
const inputTitle = document.getElementById("title")
const inputCategory = document.getElementById("category")
const inputSubmit = document.querySelector(".upload_gallery input[type='submit']")
function checkFields(){
    const files = inputFile.files
    const title = inputTitle.value
    const category = inputCategory.value
    if(files.length > 0 && title && category){
        inputSubmit.style.backgroundColor = "#1D6154"
        inputSubmit.disabled = false; // Désactive le bouton
        return true 
    }else{
        inputSubmit.style.backgroundColor =""
        inputSubmit.disabled = true; // Désactive le bouton
        return false
    }
}
inputFile.addEventListener("change",checkFields)
inputTitle.addEventListener("input",checkFields)
inputCategory.addEventListener("input",checkFields)
//Ajouter les photos
const formModal = document.querySelector(".upload_gallery form")
formModal.addEventListener("submit",(event)=>{
    event.preventDefault()
    addPicture()
})
async function addPicture() {
    try {
        const formData = new FormData(formModal)
        if(checkFields()){
            //appel fetch 
            const response = await fetch ("http://localhost:5678/api/works",{
                method: "POST",
                headers: {"Authorization": `Bearer ${token}`},
                body: formData
            })
            if (response.ok) {
                const data = await response.json()
                displayWorksInModal()
                displayWorksInGallery()
                resetForm()
                deleteWork()
            }
        }else{
            throw new Error("Veuillez remplir les champs vides")
        }
    } catch (error) {
        console.error(error.message)
    }
}
//Réinitialiser le formulaire apres soumission de l'envoi
function resetForm(){
    inputTitle.value =""
    inputCategory.value =""
    addGallery.innerHTML = `
        <span><i class="fa-regular fa-image"></i></span>
        <label for="image">+ Ajouter photo</label>
        <input type="file" name="image" id="image" accept="image/png,image/jpeg">
        <p>jpg, png : 4mo max</p>`
    inputSubmit.style.backgroundColor =""
    inputSubmit.addEventListener("change",insertImage)
}
