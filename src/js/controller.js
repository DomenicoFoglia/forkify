import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import AddRecipeViewView from './views/addRecipeView.js';
import addRecipeView from './views/addRecipeView.js';

// if(module.hot){
//   module.hot.accept();
// }


const controlRecipes = async function() {
  try{
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();

    //! 0 Mantieni selezionato la ricetta scelta nella lista
    resultsView.update(model.getSearchResultsPage());

    //! 1 Aggiorna vista bookmarks
    bookmarksView.update(model.state.bookmarks);

    //! 2 Caricamento ricetta
    await model.loadRecipe(id);

    //! 3 Rendering ricetta
    // recipeView.render(model.state.recipe);
    recipeView.render(model.state.recipe);
    
  }catch(err){
    recipeView.renderError();
    console.error(err);
  }
  
};


const controlSearchResults = async function() {
  try{
    resultsView.renderSpinner();
    
    //Get search query
    const query = searchView.getQuery();

    if(!query) return;

    //Carica i risultati di ricerca
    await model.loadSearchResults(query);

    //Renderizza i risultati
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage()); //  Mostra solo i primi 10

    //Renderizza i bottoni di paginazione
    paginationView.render(model.state.search);


  }catch(err){
    console.log(err);
    
  };
};

const controlPagination = function(goToPage){
    //Renderizza i NUOVI risultati
    resultsView.render(model.getSearchResultsPage(goToPage)); 

    //Renderizza i NUOVI bottoni di paginazione
    paginationView.render(model.state.search);
  
}

const controlServings = function (newServings){
  // Aggiorna la ricetta in base al numero di persone
  model.updateServings(newServings);


  // Aggiorna la vista della ricetta
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);


}

// controlSearchResults();

const controlAddBookmark = function(){
  // 1 Aggiungi o rimuovi bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);

  // 2 Aggiorna vista ricetta
  recipeView.update(model.state.recipe);

  // 3 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
  
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe){
  try{
    // Mostra loading spinner
    addRecipeView.renderSpinner();

    //Carica la nuova ricectta
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    

    //Renderizza ricetta
    recipeView.render(model.state.recipe);

    //Messaggio di successo
    addRecipeView.renderMessage();

    //Renderizza vista dei bokmark
    bookmarksView.render(model.state.bookmarks);

    // Cambia ID nell'url
    window.history.pushState(null, '', `#$(model.state.recipe.id)`);
    

    //Chiude il form
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  }catch(err){
    console.error('🔥', err);
    addRecipeView.renderError(err.message);
  }
  
}



// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

