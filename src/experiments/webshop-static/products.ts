import { Product } from './models'

export let Products = [
    new Product({
        id: 1,
        title: "Cookie",
        description: "The very definition of deliciousness.",
        price: 0.5,
        image: "http://www.pngall.com/wp-content/uploads/2016/07/Cookie-Free-PNG-Image.png"
    }),
    new Product({
        id: 2,
        title: "Fisher boat",
        description: "A classic fisherboat with a stylish retro look. Great for a relaxing day on the sea, or for the hobby fisher.",
        price: 20000,
        image: "http://blogs.warwick.ac.uk/images/jmears/2007/05/23/7_popeye_boat.jpg"
    }),
    new Product({
        id: 3,
        title: "Bottle",
        description: "Useful for storing liquids and displaying flowers.",
        price: 10,
        image: "https://s-media-cache-ak0.pinimg.com/originals/2a/a3/c9/2aa3c92e4c84ebe102481538c65f87a4.jpg"
    }),
    new Product({
        id: 4,
        title: "Frying pan",
        description: "A modern day necessity in every kitchen. Great for beef, sausages, fried rice, and so much more.",
        price: 500,
        image: "http://www.ikea.com/us/en/images/products/skanka-frying-pan-gray__0084582_PE211394_S4.JPG"
    }),
    new Product({
        id: 5,
        title: "Four clover",
        description: "A rare type of clover bringing luck to its owner.",
        price: 50,
        image: "http://splice-bio.com/wp-content/uploads/2015/05/four-leaf-clover-genes_mutation.jpg"
    }),
    new Product({
        id: 6,
        title: "Flash light",
        description: "Great for outdoor camping, for the basement, and just in case power goes.",
        price: 1000,
        image: "https://img.banggood.com/thumb/water/upload/2015/08/SKU232145a.jpg"
    })
];