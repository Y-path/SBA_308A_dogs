import * as Carousel from "./Carousel.js";
import axios from "axios";
import { TheCatAPI } from "@thatapicompany/thecatapi";

const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");


  const theDogAPI = new TheCatAPI(`${process.env.API_KEY} `, {
    host: "https://api.thedogapi.com/v1",
  });
let breedsData = [];
  async function initialLoad() {
   
      const URL = "https://api.thedogapi.com/v1/breeds?limit=172&page=0";
        const response = await fetch(URL, { headers: { "x-api-key": theDogAPI } });
        breedsData = await response.json();
        document.getElementById(breedSelect);
        console.log(breedsData);
        breedsData.forEach(dog => {
            const option = document.createElement('option');
            option.value = dog.id; 
            option.textContent = dog.name; 
            option.style.color = "#2C1320";
            breedSelect.appendChild(option);
        });
   
}


function displayDogInfo(breedId) {
    const dog = breedsData.find(d => d.id == breedId); 
    if (dog) {
        
        infoDump.innerHTML = '';

        const name = document.createElement("h3");
        name.textContent = `Name: ${dog.name}`;
        name.style.color = "#FFEE88";
        const bredFor = document.createElement("h5");
        bredFor.style.color = "#5BC0BE";
        bredFor.textContent = `Bred for: ${dog.bred_for || "n/a"}`;
        const origin = document.createElement("h5");
        origin.textContent = `Origin: ${dog.origin || "n/a"}`;
        origin.style.color = "#5BC0BE";
        const breedGroup = document.createElement("h5");
        breedGroup.textContent = `Breed Group: ${dog.breed_group || "n/a"}`;
        breedGroup.style.color = "#5BC0BE";
        const temperament = document.createElement("h5");
        temperament.textContent = `Temperament: ${dog.temperament || "n/a"}`;
        temperament.style.color = "#5BC0BE";
        const lifeSpan = document.createElement("h5");
        lifeSpan.textContent = `Life Span: ${dog.life_span || "n/a"}`;
        lifeSpan.style.color = "#5BC0BE";
        const height = document.createElement("h5");
        height.textContent = `Height: ${dog.height.imperial || "n/a"} inches`;
        height.style.color = "#5BC0BE";
        const weight = document.createElement("h5");
        weight.textContent = `Weight: ${dog.weight.imperial || "n/a"} pounds`;
        weight.style.color = "#5BC0BE";
         

        infoDump.appendChild(name);
        infoDump.appendChild(origin);
        infoDump.appendChild(bredFor);
        infoDump.appendChild(breedGroup);
        infoDump.appendChild(temperament);
        infoDump.appendChild(lifeSpan);
        infoDump.appendChild(height);
        infoDump.appendChild(weight);

    } else {
        infoDump.innerHTML = "Dog not found.";
    }
}


breedSelect.addEventListener("change", async() => {
  try {
        const breedId = breedSelect.value;
        // console.log(breedId);
        const response = await fetch(
          `https://api.thedogapi.com/v1/images/search?limit=10&breed_ids=${breedId}&api_key=${theDogAPI}`
        );
        const breedData = await response.json();
        console.log(breedData);
        // console.log(breedId);
        // console.log(breedData[0])
        infoDump.innerHTML = "";
       
        Carousel.clear();
        for (let i = 0; i < breedData.length; i++) {
          const url = breedData[i].url;
          const dogId = breedData[i].id;
          const alt = "dog image" + dogId;
    
          const createCarousel = Carousel.createCarouselItem(url, alt, dogId);
          Carousel.appendCarousel(createCarousel);
               
    
          Carousel.start();
         
         
        }
    const selectedBreedId = breedSelect.value;
    if (selectedBreedId) {
        displayDogInfo(selectedBreedId); 
    } else {
        infoDump.innerHTML = 'Please select a breed.';
    }
  } catch (error) {
    console.log(error);
  }
});

initialLoad();


const favorites = new Set();
export async function favourite(imgId) {

  try {
    if (favorites.has(imgId)) {
        
        // couldn't get delete method to work
        // const response = await fetch(`https://api.thedogapi.com/v1/favourites`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-api-key': `${process.env.API_KEY} ` 
        //     },
        //     redirect: 'follow'
        // });

        // if (response.ok) {
            favorites.delete(imgId); 
            console.log(`Image ${imgId} removed from favorites.`);
            
        // } else {
        //     console.error('Failed to remove favorite:', response.statusText);
        // }
    } else {
        
        const response = await fetch('https://api.thedogapi.com/v1/favourites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${process.env.API_KEY} `
            },
            body: JSON.stringify({ image_id: imgId })
        });

        if (response.ok) {
            favorites.add(imgId); 
            console.log(`Image ${imgId} added to favorites.`);
            
        } else {
            console.error('Failed to add favorite:', response.statusText);
        }
    }
} catch (error) {
    console.error('Error toggling favorite:', error);
}
}


const carousel = document.getElementById('carouselInner');

async function getFavourites() 

{
    carousel.innerHTML = "";
    infoDump.innerHTML = "";
    Carousel.clear();
    fetch('https://api.thedogapi.com/v1/favourites', {
        method: 'GET',
        headers: {
            'x-api-key': `${process.env.API_KEY} `
        }
    })
    .then(response => response.json())
    
    .then(data => {
       
        data.forEach(favorite => {  
           
        const url = favorite.image.url;
        const dogId = favorite.id;
        const alt = "dog image " + dogId;
    
        const createCarousel = Carousel.createCarouselItem(url, alt, dogId);
        Carousel.appendCarousel(createCarousel);
        Carousel.start();
        })      
        
      
    
})
.catch(error => console.error('Error:', error));
}
getFavouritesBtn.addEventListener('click', getFavourites);




// everything below does not work

//   try {
//       const response = await fetch('https://api.thedogapi.com/v1/favourites', {
//           method: 'GET',
//           headers: {
//               'x-api-key': `${process.env.API_KEY} `
//           },
//           redirect: 'follow'
//       });

//       if (!response.ok) {
//           throw new Error('Network response was not ok');
//       }

//       const favorites = await response.json();
//     //   displayFavorites(favorites);
//     carousel.innerHTML = "";
//     infoDump.innerHTML = "";
//     Carousel.clear();
//     if (favorites.length === 0) {
//         carousel.innerHTML = '<p>No favorites found.</p>';
//         return;
//     }
//     for (let i = 0; i < favorites.length; i++) {
//         const url = favorites[i].url;
//         const dogId = favorites[i].id;
//         const alt = "dog image " + dogId;
    
//         const createCarousel = Carousel.createCarouselItem(url, alt, dogId);
//         Carousel.appendCarousel(createCarousel);
             
    
//         Carousel.start();
    
//     }
//   } catch (error) {
//       console.error('Error fetching favorites:', error);
//   }
// }


// function displayFavorites(favorites) {
  
//   carousel.innerHTML = "";
//   infoDump.innerHTML = "";
  
//   if (favorites.length === 0) {
//       carousel.innerHTML = '<p>No favorites found.</p>';
//       return;
//   }

  
//   favorites.forEach(favourite => {
//       const image = document.createElement('img');
//       image.src = favourite.image; 
//       image.alt = 'Favorite Dog';
//       image.classList.add('carousel-item'); 

//       carousel.appendChild(image);
//   });
//   for (let i = 0; i < breedData.length; i++) {
//     const url = breedData[i].url;
//     const dogId = breedData[i].id;
//     const alt = "dog image" + dogId;

//     const createCarousel = Carousel.createCarouselItem(url, alt, dogId);
//     Carousel.appendCarousel(createCarousel);
         

//     Carousel.start();

// }







// const favBtn = document.querySelector('favBtn');


// favBtn.addEventListener('click', function() {
    
//     if (favBtn.style.backgroundColor === 'red') {
//         favBtn.style.backgroundColor = ''; 
         
//     } else {
//         favBtn.style.backgroundColor = 'red'; 
         
//     }
// });

// function updateFavBtn(isFavorited) {
// const favBtn = document.querySelectorAll('.favourite-button');
// if (isFavorited) {
//     favBtn.style.c
// } else {
//   favBtn.classList.remove = "favorited"
// }
// }

// This function will be called when the button is clicked
// function toggleFavorite(imgId) {
//   document.getElementById('favBtn').addEventListener('click', function() {
// favourite(imgId);
//   });
// }


//   const apiKey = `${process.env.API_KEY} `;
//     const url = 'https://api.thecatapi.com/v1/favourites';
    
    
    

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'x-api-key': apiKey,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ image_id: imgId })
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Success!', data);
//             return data;
             
//         } else {
//             const errorData = await response.json();
//             console.error('Error:', response.status, errorData);
//             throw new Error(`Error favoriting image: ${errorData.message}`);
//         }
//     } catch (error) {
//         console.error('Request failed:', error);
//         throw error; 
//     }
// }






// document.getElementById(selectedBreedId);
// const selectedBreedId = breedSelect.value;
//   const url = 'https://api.thedogapi.com/v1/favourites';


// export async function favourite(imgId) {
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//         'x-api-key': {{theDogAP}},
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ image_id: imgId }),
//     redirect: 'follow'
// });

// if (response.ok) {
//     const data = await response.json();
//     console.log('Cat image favorited successfully!', data);
// } else {
//     console.error('Error:', response.status, await response.json());
// }
// }


// favourite();
  



  



  



// async function initialLoad() {
//   const URL = "https://api.thedogapi.com/v1/breeds?limit=172&page=0";
//   const list = await fetch(URL, { headers: { "x-api-key": theCatAPI } });
//   const data = await list.json();
//   // console.log(data);
//   document.getElementById(breedSelect);
//   data.forEach((data) => {
//     const name = data.name;
//     const id = data.id;
//     const option = document.createElement("option");
//     option.value = `${id}`;
//     option.textContent = `${name}`;
//     // console.log(option);
//     breedSelect.appendChild(option);
    
//   });
// }
// console.log(breedSelect);

// initialLoad();


// breedSelect.addEventListener("change", async () => {
//   try {
//     const breedId = breedSelect.value;
//     // console.log(breedId);
//     const response = await fetch(
//       `https://api.thedogapi.com/v1/images/search?limit=5&breed_ids=${breedId}&api_key=${theCatAPI}`
//     );
//     const breedData = await response.json();
//     console.log(breedData);
//     // console.log(breedId);
//     // console.log(breedData[0])
//     infoDump.innerHTML = "";
   
//     Carousel.clear();
//     for (let i = 0; i < breedData.length; i++) {
//       const url = breedData[i].url;
//       const dogId = breedData[i].id;
//       const alt = "dog image" + dogId;

//       const createCarousel = Carousel.createCarouselItem(url, alt, dogId);
//       Carousel.appendCarousel(createCarousel);

      
      

//       Carousel.start();
     
     
//     }
   
  
//     const URL = "https://api.thedogapi.com/v1/breeds";
//     const list = await fetch(URL, { headers: { "x-api-key": theCatAPI } });
//     const data = await list.json();
//     // console.log(data);
//     document.getElementById(infoDump);
   
//     // infoDump.innerHTML = "";
    
//     // for (let i = 0; i < data.length; i++) {
//       // const name = data[i].name;
//       // const dogId = breedData[i].id;
//       // const alt = "dog image" + dogId;
      
//     const name = document.createElement("h4");
//     name.textContent = `Name: ${data.name}`;
//       infoDump.appendChild(name);
//     // }
 
    
    
 

// //     // for (let i = 0; i < breedData.length; i++) {
// //     //   for (let j = 0; j < breedData[i].length; j++) {
// //     //       console.log(`Name of breed at [${i}][${j}]: ${breedData[i][j].name}`);
// //     // const URL = "https://api.thedogapi.com/v1/breeds?limit=172&page=0";
// //     // const list = await fetch(URL, { headers: { "x-api-key": theCatAPI } });
// //     // const data = await list.json();
// //     // for (let i = 0; i < data.length; i++) {
// //       // const name = data[i].name
// //     // const cat = document.createElement("div");
// //     // const name = document.createElement("h4");
// //     // document.getElementById("data");
// //     // name.textContent = `Name: ${data[i].name}`;
// //     // const description = document.createElement("h6");
// //     // description.textContent = `Description: ${breedData[0].breeds[0].description}`;
// //     // const lifeSpan = document.createElement("h6");
// //     // lifeSpan.textContent = `Life Span: ${breedData[0].breeds[0].life_span} yrs`;
// //     // const weight = document.createElement("h6");
// //     // weight.textContent = `Weight: ${breedData[0].breeds[0].weight.imperial} lbs`;
// //     // const origin = document.createElement("h6");
// //     // origin.textContent = `Origin: ${breedData[0].breeds[0].origin}`;
// //     // const temperament = document.createElement("h6");
// //     // temperament.textContent = `Temperament: ${breedData[0].breeds[0].temperament}`;


   
    
//   // }
//   // }
//   } catch (error) {
//     console.log(error);
//   }
// });



