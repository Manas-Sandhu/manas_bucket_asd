const storage = require('../database/db')

async function getAllProducts() {
    return await storage.getProducts()
}

async function getProductById(productId) {
    const list = await storage.getProducts()
    const match = list.find((p) => p.id === productId)
    return match || null
}

async function addProduct(newName, newPrice) {
    const list = await storage.getProducts()

    let nextId = 1
    if (list.length > 0) {
        nextId = Math.max(...list.map((p) => p.id)) + 1
    }

    const created = { id: nextId, name: newName, price: newPrice }
    list.push(created)
    await storage.saveProducts(list)
    return created
}

async function updateProduct(productId, newName, newPrice) {
    const list = await storage.getProducts()
    const pos = list.findIndex((p) => p.id === productId)
    if (pos === -1) {
        return null
    }

    list[pos] = { id: productId, name: newName, price: newPrice }
    await storage.saveProducts(list)
    return list[pos]
}

async function patchProduct(productId, newName, newPrice) {
    const list = await storage.getProducts()
    const pos = list.findIndex((p) => p.id === productId)
    if (pos === -1) {
        return null
    }

    if (newName !== undefined) {
        list[pos].name = newName
    }
    if (newPrice !== undefined) {
        list[pos].price = newPrice
    }

    await storage.saveProducts(list)
    return list[pos]
}

async function deleteProduct(productId) {
    const list = await storage.getProducts()
    const pos = list.findIndex((p) => p.id === productId)
    if (pos === -1) {
        return false
    }

    list.splice(pos, 1)
    await storage.saveProducts(list)
    return true
}

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    patchProduct,
    deleteProduct
}