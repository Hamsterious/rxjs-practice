import { swallowErrors } from '../../helpers';

class Product {

    // Properties
    public id: number;
    public title: string;
    public description: string;
    public price: number;
    public image: string;
    
    // Constructor
    constructor(values: Object = {}){Object.assign(this, values);}
}

class Cart {
    public products: Product[] = [];

    public addProduct = (product: Product): void => {
        this.products.push(product);
    }

    public removeProduct = (product: Product): void => {
        this.products.splice(this.products.indexOf(product), 1);
    }

    public logProducts() {
        this.products.forEach(x => {
            console.log(x.title);
        });
    }
}

class Webshop {

    // Properties
    public products: Product[];
    public cart: Cart;

    // Constructor
    constructor() {
        this.products = this.getProducts();
        this.cart = new Cart();
        this.renderProducts(this.products);
        this.attachEventToSearchField(this.searchProducts);
        this.attachEventToButtons(this.addToCart);
    }

    // Methods
    private addToCart = (productId: number): void => {
        let product: Product = this.products.find(x => x.id == productId);
        this.cart.addProduct(product);
        this.notifyProductAddedToCart(productId);
    }

    private searchProducts() {
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

    private getProducts(): Product[] {
        return [
            new Product({
                id: 1,
                title: "Cookie",
                description: "The very definition of deliciousness",
                price: 0.5,
                image: "http://www.pngall.com/wp-content/uploads/2016/07/Cookie-Free-PNG-Image.png"
            }),
            new Product({
                id: 2,
                title: "Fisher boat",
                description: "A classic fisherboat with a stylish retro look. Great for a relaxing day on the sea, or for the hobby fisher",
                price: 20000,
                image: "http://blogs.warwick.ac.uk/images/jmears/2007/05/23/7_popeye_boat.jpg"
            }),
            new Product({
                id: 3,
                title: "Bottle",
                description: "Useful for storing liquids and showing flowers",
                price: 10,
                image: "https://s-media-cache-ak0.pinimg.com/originals/2a/a3/c9/2aa3c92e4c84ebe102481538c65f87a4.jpg"
            }),
            new Product({
                id: 4,
                title: "Frying pan",
                description: "A modern day necessity in every kitchen. Great for beef, sausages, fried rice, and so much more",
                price: 500,
                image: "http://www.ikea.com/us/en/images/products/skanka-frying-pan-gray__0084582_PE211394_S4.JPG"
            }),
            new Product({
                id: 5,
                title: "Four clover",
                description: "A rare type of clover bringing luck to its owner",
                price: 50,
                image: "http://splice-bio.com/wp-content/uploads/2015/05/four-leaf-clover-genes_mutation.jpg"
            }),
            new Product({
                id: 6,
                title: "Flash light",
                description: "Great for outdoor camping, for the basement, and just in case if the power goes.",
                price: 1000,
                image: "https://img.banggood.com/thumb/water/upload/2015/08/SKU232145a.jpg"
            })
        ];
    }

    private notifyProductAddedToCart(productId: number): void{
        let targetElement: any = document.getElementById(productId.toString()).parentElement.parentElement;

        let e = document.createElement('div');
            e.innerHTML =  `<div><p id="bought" style="color:green;margin-top:1rem;">Tiløjet til kurven!</p></div>`;

            targetElement.appendChild(e.firstChild);

        setTimeout(() => {
            document.getElementById("bought").remove();
        }, 500);
    }

    private renderProducts(products: Product[]): void {
        let targetElement = document.querySelector("div.products");
        targetElement.innerHTML = "";

        for(let product of products){
    
            let e = document.createElement('div');
            e.innerHTML = 
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

            targetElement.appendChild(e.firstChild);
        }
    }

    private attachEventToButtons (event: any): void {
        let buttons = document.getElementsByTagName("button");
        let buttonsCount = buttons.length;

        for (let i = 0; i < buttonsCount; i += 1) {
            buttons[i].onclick = () => {
                event(buttons[i].id);
            }
        }​
    }

    private attachEventToSearchField(event: any): void {
        let searchField = document.getElementById("search-field");
        searchField.onkeyup = () => {
            event();
        }
    }

}

let webshop = new Webshop();

// swallowErrors("Errors from webshop-1-static", () => {
// });