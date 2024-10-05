//Récupération des travaux depuis le back-end 
export async function getWorks(){
    try {
        //appel fetch pour récupérer les données 
        const response = await fetch("http://localhost:5678/api/works")
        if(response.status === 200){
            const works = await response.json()
            return works
        }else{
            throw new Error("Unexpected Error"+response.status)
        }
    } catch (error) {
        console.error(error.message)
    }
}
// Affichage des travaux via API 
const gallery = document.querySelector("#portfolio .gallery")
async function displayWorksInGallery() {
    const works = await getWorks()
    //Mis à jour de la gallery à chaque ajout de travaux 
    gallery.innerHTML = ""
    works.forEach(work => {
        const figure = createFigureGallery(work)
        gallery.appendChild(figure)
    });
}
function createFigureGallery(work){
    const figure = document.createElement("figure")
    const img = document.createElement("img")
    img.src = work.imageUrl
    img.alt = work.title
    const figcaption = document.createElement("figcaption")
    figcaption.textContent = work.title
    figure.appendChild(img)
    figure.appendChild(figcaption)
    return figure
}
displayWorksInGallery()

//Réalisation du filtre pour chaque catégories 
//Récupération les catégories via les données réçues
async function getCategories() {
    const works = await getWorks()
    //Utilisation de set pour éviter les doublons pendant la récupération des catégories 
    const setCat = new Set()
    const categories = []
    works.forEach(work => {
        const idCategory = work.category.id
        const nameCategory = work.category.name
        setCat.add(idCategory)
        setCat.add(nameCategory)
    })
    const arraySet = [... setCat]
    //Parcourir deux par deux pour créer les clés et valeur de l'objet category
    for(let i = 0; i < arraySet.length; i+=2){
        const id = arraySet[i]
        const name = arraySet[i+1]
        categories.push({
            id: id,
            name: name
        })
    }
    return categories
}
getCategories()
// affichage des filtres 
const portfolio = document.getElementById("portfolio")
const ul = document.createElement("ul")
//Insérer ul avant la galerie de photo
portfolio.insertBefore(ul,gallery)
function createFilterDefault(){
    const li = document.createElement("li")
    li.id = "All"
    li.textContent = "Tous"
    ul.appendChild(li)
}
createFilterDefault()
//Affichage des filtres 
async function displayCategories() {
    const categories = await getCategories()
    categories.forEach(category => {
        const li = document.createElement("li")
        li.id = category.id
        li.textContent = category.name
        ul.appendChild(li)
    })
}
displayCategories()

//Filtrage des travaux 
async function filterWorks() {
    const works = await getWorks()
    const categories = await getCategories()
    const listFilters = document.querySelectorAll("#portfolio li")
    listFilters.forEach(filter => {
        filter.addEventListener("click",(event)=>{
            gallery.innerHTML = ""
            const idFilter= event.target.id
            if(idFilter === 'All'){
                displayWorksInGallery()
            }else{
                const filteredWorks = works.filter((work => idFilter == work.category.id))
                filteredWorks.forEach(work => {
                    const figure = createFigureGallery(work)
                    gallery.appendChild(figure)
                })
            }
        })
    });
}
filterWorks()
