export const generateUserErrorInfo = (user) => {
    return `
    One or more properties were incomplete or not valid.
    List of required properties:
    * first_name: needs to be a String, received ${user.first_name}
    * last_name: needs to be a String, received ${user.last_name}
    * email: needs to be a String, received ${user.email}
    `
}

export const generateProductErrorInfo = (product) => {
    return `
    One or more properties were incomplete or not valid.
    List of required properties:
    * name: needs to be a String, received ${product.title}
    * description: needs to be a String, received ${product.description}
    * price: needs to be a Number, received ${product.price}
    * stock: needs to be a Number, received ${product.stock}
    * code: needs to be a String, received ${product.code}
    * category: needs to be a String, received ${product.category}
    `
}