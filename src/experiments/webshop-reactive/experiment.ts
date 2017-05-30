import * as Rx from 'rxjs/Rx';
import { 
    swallowErrors, 
    renderElement, 
    toggleVisibility, 
    attachEvent, 
    removeContentFrom 
} from '../../helpers';
import { Product, Cart } from './models';
import { Products, NewProducts } from './products';

if(document.getElementById("reactive") != undefined){

class Webshop {

    // Properties
    public products: Product[];
    public cart: Cart;
    public notificationCollection: string[] = [
            "🔔 Hello and welcome!",
            "👍 Take your time and look around :)",
            "💰 Buy for 900kr + and save 20% !",
            "📞 Questions? Call 2X 3X 4X 5X",
        ];

    // Constructor
    constructor() { 
        this.products = Products;
        this.cart = new Cart();
        this.products.forEach((product) => {
            this.showProduct(product);
        });
        attachEvent("#search-field", "keyup", this.searchProducts);
        attachEvent("#show-cart", "click", this.showCartArea);
        
        // RxJS
        this.notifications();
        this.addNewProducts();
    }

    // Webshop Methods
    private addToCart = (productId: number): void => {
        let product: Product = this.products.find(x => x.id == productId);
        this.cart.addProduct(product);
        this.notifyProductAddedToCart(productId);
    }

    private searchProducts = (): void => {
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

    private notifyProductAddedToCart = (productId: number): void => {
        let content = `
            <span id="added-to-cart-notification" style="color:green;margin-top:1rem;">Added to cart</span>
        `;

        renderElement(`#${productId.toString()}`, 0, content);

        setTimeout(() => {
            document.getElementById("added-to-cart-notification").remove();
        }, 500);
    }

    private updateCart = (): void => {
        let uniqueProduct = [...new Set(this.cart.products)];
        
        uniqueProduct.forEach(product => {
            try {
                // Get the currents products updated value
                let element: any = document.querySelector(`[name="p${product.id}"]`);
                let newAmount = element.value;

                // Empty the cart for all the old products of this type.
                this.cart.removeAllProductsById(product.id);
                
                // Add X products.
                this.cart.addProductXtimes(product, newAmount);

            } catch(e) {
                // No product of this type in cart.
                console.log(e);
            }           
            // If getting value was successful, remove old cart value
        });

        this.showCartArea();
    }

    // Show methods
    private showProduct = (product: Product): void => {

        let content:string = `
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

        renderElement(".products", 0, content);

        // Attach event
        let button = document.getElementById(`${ product.id }`);
        button.onclick = () => {
            this.addToCart(product.id);
        }
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

        let cart = `
            <p id="back-to-products" style="color:blue; cursor:pointer;">
                Back to products
            </p>
            <h2>Your cart</h2>
        `;

        if(this.cart.products.length == 0) 
            cart += `<p>Nothing in your cart.</p>`;
        else 
            cart += `${ this.getCartTable() }`;

        removeContentFrom(".cart");
        renderElement(".cart", 0, cart);
        attachEvent("#back-to-products", "click", this.showProductArea);
        attachEvent(".update-cart", "click", this.updateCart);
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
                    <td class="vert-align" ><input name="p${ product.id }" type="number" value="${ amount }" /></td>
                    <td class="vert-align" >${ product.price }</td>
                    <td class="vert-align" >${ total }</td>
                </tr>
            `;
        });

        // Close cart table
        cart += `
                </tbody>
            </table>
            <button class="btn btn-primary update-cart" style="float:right;">
                Update cart
            </button>
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

    // RxJS methods
    private notifications = (): void => {
        let notificationStream = Rx.Observable
        .interval(5000)
        .take(this.notificationCollection.length)
        .map((x: any) => {
            return this.notificationCollection[x];
        })
        .subscribe((x: any) => {
            let notification = `<span class="message-notification-content">${x}</span>`;
            removeContentFrom(".message-notification");
            renderElement(".message-notification", 0, notification);
        },
        () => {},
        () => {this.notifications()});
    }

    private addNewProducts = (): void => {
        let newProductsStream = Rx.Observable
        .interval(10000)
        .take(NewProducts.length)
        .map((x: any) => {
            return NewProducts[x];
        })
        .subscribe((x: any) => {
            let notification = `<span class="new-product-notification-content" style="color:green;">New product just added: ${x.title}</span>`;
            this.products.push(x)
            this.showProduct(x);
            removeContentFrom(".new-product-notification");
            renderElement(".new-product-notification", 0, notification);
            setTimeout(() => removeContentFrom(".new-product-notification"), 3000)
        });
    }
}

new Webshop();

}

