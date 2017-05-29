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

    public addXProducts = (product: Product, timesToAdd: number): void => {
        while(timesToAdd > 0) {
            this.addProduct(product);
            timesToAdd--;
        }
    }

    public removeProduct = (product: Product): void => {
        this.products.splice(this.products.indexOf(product), 1);
    }

    public removeAllProductsById = (productId: number): void => {
        this.products = this.products.filter(x => x.id != productId);
    }
}

export { Product, Cart }