// The Iterator interface
interface IIterator {
    next();
    hasNext();
}

// The class implementing the iterator interface.
class YummyFoodBox implements IIterator {

    cursor: number = 0;

    public yummyFoods: string[] = [
        'Strawberry',
        'Chocalate',
        'Pineapple',
        'Grilled Cheese Sandwich'
    ];

    public next(): string {
        while (this.cursor < this.yummyFoods.length) {
            return this.yummyFoods[this.cursor++];
        }
    }

    public hasNext(): boolean {
        return this.cursor < this.yummyFoods.length;
    }
}

// Since the yummu food box implements the iterator interface, it becomes extremely simple to iterate over its content and act on it however we want.
let yummyFoobBox: IIterator = new YummyFoodBox();

// UNCOMMENT BELOW TO SEE RESULT IN LOG
// while(yummyFoobBox.hasNext()) {
//     console.log(yummyFoobBox.next().toUpperCase());
// }