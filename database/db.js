const fs = require('fs/promises')
const path = require('path')

const filePath = path.join(__dirname, '..', 'db.json')

function delay() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000)
    })
}

async function getProducts() {
    await delay()
    const text = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(text)
}

async function saveProducts(list) {
    await fs.writeFile(filePath, JSON.stringify(list, null, 2))
}

module.exports = { getProducts, saveProducts }