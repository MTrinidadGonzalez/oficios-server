
export const productsErrorIncompleteValues=(product)=>{
    return(`
    Uno o más datos no han sido proporcionados, se esperaba:
    -title: se recibió ${product.title},
    -description: se recibió: ${product.description},
    -price: se recibió: ${product.price},
    -category: se recibió: ${product.category},
    -img: se esperaba enlase string y se recibió recibió: ${product.img},
    -stock: se recibió: ${product.stock} 

    `)
}

export const productsErrorInvalideValues=(product)=>{
    return(`
    Uno o más datos no han sido caracteres inválidos:
    -title:se espera string, se recibió ${product.title},
    -description:se espera string, se recibió: ${product.description},
    -category: se esperaba categoría dentro de las definidad, se recibió: ${product.category},
    -price:se espera number se recibió: ${product.price},
    -img: se esperaba enlase string y se recibió recibió: ${product.img},
    -stock:se espera number se recibió: ${product.stock} 

    `)
}

export const productsWithoutStock=(product)=>{
    return(`
    No se puede agregar el producto ya que no hay stock:
    -stock del producto: ${product.stock} 

    `)
}

export const productsExistYet=(product)=>{
    return(`
    El producto ya existe:
    -Producto: 
    title: ${product.title},
    description: ${product.description},
    category:${product.category},
    price: ${product.price},
    id:${product._id} 

    `)
}