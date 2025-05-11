import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');
    
    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');

            if(!btn) return;

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
            
        })
    }

    _generateMarkup() {
        const currentPage = this._data.page;
        //! Pagina 1 e ci sono altre pagine
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage) ;
        console.log(numPages);
        




        //! Pagina 1 e  NON ci sono altre pagine
        if(currentPage === 1 && numPages > 1){
            return `
                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href=${icons}#icon-arrow-right"></use>
                </svg>
                </button>
            `;
            
        }

        //! Ultima pagina
        if(currentPage === numPages ){
            return `
                <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>
            `;
        }
        //! Altre pagine

        if(currentPage < numPages){
            return `
                <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>
                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currentPage + 1}</span>
                    <svg class="search__icon">
                        <use href=${icons}#icon-arrow-right"></use>
                    </svg>
                </button>

            `;
            
        }

        //! Pagina 1 e non ci sono altre pagine
        return '';
    }
};

export default new PaginationView();