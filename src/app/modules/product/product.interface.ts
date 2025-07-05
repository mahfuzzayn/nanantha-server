export type IProduct = {
    title: string;
    author: string;
    price: number;
    category:
        | "Fiction"
        | "Science"
        | "SelfDevelopment"
        | "Poetry"
        | "Religious";
    image: string;
    description: string;
    quantity: number;
    inStock: boolean;
};
