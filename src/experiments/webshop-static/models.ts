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
}

export { Product, Cart }