import { swallowErrors, renderElement, toggleVisibility, attachEvent } from '../../helpers';
import { Product, Cart } from './models';
import { Products } from './products';

class Webshop {

    // Properties
    public products: Product[];
    public cart: Cart;

    // Constructor
    constructor() { 
        this.products = Products;
        this.cart = new Cart();
        this.showProducts(this.products);
        attachEvent("#search-field", "keyup", this.searchProducts);
        attachEvent("#show-cart", "click", this.showCartArea);
    }

    // Webshop Methods
    private addToCart = (productId: number): void => {
        let product: Product = this.products.find(x => x.id == productId);
        this.cart.addProduct(product);
        this.notifyProductAddedToCart(productId);
    }

    private searchProducts() {
        console.log("he");
        let searchFieldValue: any = document.getElementById('search-field');
        let searchTerm = searchFieldValue.value.toUpperCase();
        let domProducts = document.querySelectorAll("h4");

        for (let i = 0; i < domProducts.length; i++) {
            if (domProducts[i].innerHTML.toUpperCase().indexOf(searchTerm) > -1) {
                domProducts[i].parentElement.parentElement.style.display = "";
            } else {
                domProducts[i].parentElement.parentElement.style.display = "none";
            }
        }
    }

    private notifyProductAddedToCart(productId: number): void{
        let content = `
        <div>
            <span id="added-to-cart-notification" style="color:green;margin-top:1rem;">Added to cart</span>
        </div>`;

        renderElement(`#${productId.toString()}`, 0, content);

        setTimeout(() => {
            document.getElementById("added-to-cart-notification").remove();
        }, 500);
    }

    // Show methods
    private showProducts(products: Product[]): void {

        let content:string = "";
        for(let product of products){
            content +=  
            `<div class="card product" style="width: 15rem;">
                <img class="card-img-top" src="${ product.image }" alt="Card image cap">
                <div class="card-block">
                    <h4 class="card-title">${ product.title }</h4>
                    <p class="card-text">${ product.description }</p>
                    <p><strong>Price: </strong>${ product.price }kr<p/>
                    <button id="${ product.id }" 
                    class="btn btn-primary">Buy</a>
                </div>
            </div>`;
        }
        renderElement("div.products", 0, content);

        // Attach events
        let buttons = document.getElementsByTagName("button");
        let buttonsCount = buttons.length;

        for (let i = 0; i < buttonsCount; i += 1) {
            buttons[i].onclick = () => {
                this.addToCart(parseInt(buttons[i].id));
            }
        }​
    }

    private showProductArea = (): void => {
        toggleVisibility(".cart", "none");
        toggleVisibility(".products", "");
        toggleVisibility("#action-area", "");
    }

    private showCartArea = (): void => {
        toggleVisibility(".cart", "");
        toggleVisibility(".products", "none");
        toggleVisibility("#action-area", "none");

        let content;
        if(this.cart.products.length == 0){
            content = `
                <div>
                    <p id="back-to-products" style="color:blue;cursor:pointer;">Back to products</p>
                    <h2>Your cart</h2>
                    <p>Nothing in your cart.</p>
                </div>`;
        
        } else {
            let listOfProducts = "<ul>";
            this.cart.products.forEach(x => {
                listOfProducts += `<li>${ x.title } - <span>Delete</span></li>`;
            });
            listOfProducts += "</ul>";

            content = `
                <p id="back-to-products" style="color:blue;cursor:pointer;">
                    Back to products
                </p>
                <h2>Your cart</h2>
                ${ listOfProducts }`
        }

        document.querySelector(".cart").innerHTML = "";
        renderElement("div.cart", 0, content);
        attachEvent("#back-to-products", "click", this.showProductArea);
    }
}

let webshop = new Webshop();

// swallowErrors("Errors from webshop-1-static", () => {
// });