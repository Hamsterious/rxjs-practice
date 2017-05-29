import { 
    swallowErrors, 
    renderElement, 
    toggleVisibility, 
    attachEvent, 
    removeContentFrom 
} from '../../helpers';
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
            </div>
        `;

        renderElement(`#${productId.toString()}`, 0, content);

        setTimeout(() => {
            document.getElementById("added-to-cart-notification").remove();
        }, 500);
    }

    // Show methods
    private showProducts(products: Product[]): void {

        let content:string = "";
        products.forEach(product => {
            content += `
                <div class="card product" style="width: 15rem;">
                    <img class="card-img-top" src="${ product.image }" alt="Card image cap">
                    <div class="card-block">
                        <h4 class="card-title">${ product.title }</h4>
                        <p class="card-text">${ product.description }</p>
                        <p><strong>Price: </strong>${ product.price }kr<p/>
                        <button id="${ product.id }" 
                        class="btn btn-primary">Buy</a>
                    </div>
                </div>
            `;
        });

        renderElement(".products", 0, content);

        // Attach events
        let buttons = Array.from(document.getElementsByTagName("button"));
        buttons.forEach(button => {
            button.onclick = () => {
                this.addToCart(parseInt(button.id));
            }
        });
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

        let content = `
            <p id="back-to-products" style="color:blue; cursor:pointer;">
                Back to products
            </p>
            <h2>Your cart</h2>
        `;

        if(this.cart.products.length == 0) 
            content += `<p>Nothing in your cart.</p>`;
        else 
            content += `${ this.getCartTable() }`;

        removeContentFrom(".cart");
        renderElement(".cart", 0, content);
        attachEvent("#back-to-products", "click", this.showProductArea);
    }

    private getCartTable = (): string => {

        let cart: string;

        // Begin cart table
        cart = `
            <table class="table table-bordered">
                <thead>
                    <tr class="table-info">
                        <th></th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Price pr. unit</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Build table row for each unique product
        let uniqueProduct = [...new Set(this.cart.products)];
        let totalPrice: number = 0;

        uniqueProduct.forEach(product => {
            // Prepare data
            let occurences = this.cart.products.filter(x => x.id == product.id);
            let amount = occurences.length;
            let total = occurences.reduce((total, product) => {
                return total + product.price;
            },0);

            // Add to overall total
            totalPrice += total;

            // Build row
            cart += `
                <tr>
                    <td><img src="${ product.image }"></img></td>
                    <td class="vert-align" >${ product.title }</td>
                    <td class="vert-align" >${ amount }</td>
                    <td class="vert-align" >${ product.price }</td>
                    <td class="vert-align" >${ total }</td>
                </tr>
            `;
        });

        // Close cart table
        cart += `
                </tbody>
            </table>
        `;

        cart += this.totalMessage(totalPrice);

        return cart;
    }

    private totalMessage = (totalPrice: number): string => {
        if(this.spendToGetOffer(totalPrice) >= 0) {
           return `
                <span style="font-size:32px;">Total price: ${ totalPrice }kr. Buy for ${ this.spendToGetOffer(totalPrice) }kr extra to save 20% !</span>
            `;
        } else {
            let reducedTotalPrice = Math.floor(totalPrice * 0.8);
            let savings = Math.floor(totalPrice - reducedTotalPrice);

            return `
                <p style="font-size:32px;">
                    Total price: <s>${ totalPrice }kr</s> ${ reducedTotalPrice  }kr.
                </p> 
                <p>We cut off 20% as a thanks for your large order. You just saved <em>${ savings }kr!</em></p>
            `;
        }
    }

    private spendToGetOffer = (totalPrice: number): number => {
        return 900 - totalPrice;
    }
}

let webshop = new Webshop();

// swallowErrors("Errors from webshop-1-static", () => {
// });