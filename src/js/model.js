import {API_URL, RES_PER_PAGE, KEY} from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import {AJAX} from './helpers.js'

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage : RES_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function(data) {
    const {recipe} = data.data;
        return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && {key: recipe.key}), // se la ricetta ha una chiave

        };
};

export const loadRecipe = async function(id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    
        //Riscriviamo gli attributi creando un nuovo oggetto recipe
        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    
        console.log(state.recipe);

    }catch(err){
        console.error(`${err} 🔥`);
        throw err;
    }
    
};

//Ricerca
export const loadSearchResults = async function(query){
    try{
        state.search.query = query;
        const data = await AJAX(`${API_URL}/?search=${query}&key=${KEY}`);
        console.log(data);
        
        state.search.results = data.data.recipes.map( rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key})
            };
        });
        state.search.page = 1; // riporta la valiabile pagina a 1
        // console.log(state.search.results);        
    }catch(err){
        console.error(`${err} 🔥`);
        throw err;
    }
};

export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage // 0;
    const end = page * state.search.resultsPerPage // 9;
    console.log(start, end);
    

    return state.search.results.slice(start, end)
};

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
        // neqQt = oldQt * newServings / oldServings ( (2 * 8) / 4 = 4 )
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        
    });

    state.recipe.servings = newServings;
};

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
    // Aggiunge un segnalibro all'array dei segnalibri
    state.bookmarks.push(recipe);

    // Segna la ricetta corrente come bookmar
    if(recipe.id === state.recipe.id){
        state.recipe.bookmarked = true;
    }

    persistBookmarks();
};

export const deleteBookmark = function(id){
    console.log('Deleting bookmark with id:', id);
    const index = state.bookmarks.findIndex(el => el.id === id);
    console.log('Found index:', index);
    state.bookmarks.splice(index, 1);
    console.log('Bookmarks after deletion:', state.bookmarks);

    if(id === state.recipe.id){
        state.recipe.bookmarked = false;
    }

    persistBookmarks();
};

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
};

init();


const clearBookmarks = function() {
    localStorage.clear('bookmarks');
};


export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        const [quantity, unit, description] = ingArr;
        if(ingArr.length !== 3) throw new Error('Formato inserito errato, usa il formato corretto per l\'inserimento degli ingredienti');


        return {quantity: quantity ? +quantity : null, unit, description};
        });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,

        };
        
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
        
    }catch(err){
        throw err;
    };

    
    
};

