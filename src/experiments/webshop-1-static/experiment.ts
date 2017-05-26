import * as Rx from 'rxjs/Rx'; // Import RxJs
import { tryCatchLogErrors } from '../../helpers';

class Product {
    constructor(
        public title: string,
        public price: number
    ){}
}



tryCatchLogErrors("Errors from webshop-1-static", () => {
    
    let products: Product[] = getProducts();
    renderProducts(products);

});

function getProducts(): Product[] {
        return [
            new Product("Cookie", 0.5),
            new Product("Ship", 30000)
        ];
    }


function renderProducts(products: Product[]): void {
    let suggestionNode = document.querySelector("div.products");
    suggestionNode.innerHTML = "";

     for(let product of products){
   
        let e = document.createElement('div');
        e.innerHTML = 
        `<div>
            <p>${product.title}<p/>
        </div>`;

        suggestionNode.appendChild(e.firstChild);
    }
}