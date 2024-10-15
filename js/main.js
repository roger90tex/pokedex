const createPokemonCard = (pokemon) => {  // Pasamos el objeto pokemon como argumento
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("pokemon-info");

    const name = document.createElement("h2");
    name.classList.add("pokemon-name");
    name.textContent = pokemon.name;  // Accedemos al nombre del pokemon

    const typeDiv = document.createElement("div");
    typeDiv.classList.add("pokemon-types");

    pokemon.types.forEach((type) => {
        const typeSpan = document.createElement("span");
        typeSpan.classList.add("pokemon-type", type.type.name);
        typeSpan.textContent = type.type.name;
        typeDiv.appendChild(typeSpan);
    });

    infoDiv.appendChild(name);
    infoDiv.appendChild(typeDiv);

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("pokemon-image-container");

    const image = document.createElement("img");
    image.classList.add("pokemon-image");
    image.src = pokemon.sprites.front_default;  // Accedemos a la imagen del pokemon
    image.alt = pokemon.name;

    imageContainer.appendChild(image);

    card.appendChild(infoDiv);
    card.appendChild(imageContainer);

    return card;
};

const loadPokemons = async () => {
    const pokemonGrid = document.getElementById("pokemon-grid");
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon", {params:{limit:500}});
        const pokemons = response.data.results;

        pokemonGrid.innerHTML = '';  // Limpiar el grid antes de añadir nuevos pokemons

        for(const pokemon of pokemons){
            const detailResponse = await axios.get(pokemon.url);
            const pokemonCard = createPokemonCard(detailResponse.data); 
            pokemonGrid.appendChild(pokemonCard);  // Añadir la tarjeta del pokemon al grid
        }
    } catch (error) {
        console.log("Error fetch", error);
    }
}

document.addEventListener("DOMContentLoaded", loadPokemons);

const searchPokemon = async () => {
    const pokemonName = document.getElementById('pokemon-search').value.trim().toLowerCase(); // Corregir uso de .value y limpiar espacios
    if (pokemonName) {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const pokemonGrid = document.getElementById('pokemon-grid');
            pokemonGrid.innerHTML = '';  // Limpiar el grid antes de añadir el resultado de la búsqueda
            const pokemonCard = createPokemonCard(response.data);
            pokemonGrid.appendChild(pokemonCard);
        } catch (error) {
            console.log("Error fetch", error);
        }
    }
}

// Añadir eventos al botón de búsqueda y al presionar Enter
document.getElementById('search-button').addEventListener('click', searchPokemon);

document.getElementById('pokemon-search').addEventListener('keypress', function(e) { 
    if (e.key === 'Enter') {
        searchPokemon();
    }
});
