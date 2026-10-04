const service = require('../services/productService')

async function getAllProducts(req, res) {
    try {
        const list = await service.getAllProducts()
        res.json(list)
    } catch (error) {
        res.status(500).json({ error: 'Error in reading file' })
    }
}

async function getProductById(req, res) {
    try {
        const productId = Number(req.params.id)
        if (Number.isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        const item = await service.getProductById(productId)
        if (!item) {
            return res.status(404).json({ error: 'Element not found' })
        }
        res.json(item)
    } catch (error) {
        res.status(500).json({ error: 'Error in reading file' })
    }
}

async function addProduct(req, res) {
    try {
        const { name, price } = req.body
        if (!name || price === undefined) {
            return res.status(400).json({ error: 'name and price are required' })
        }

        const created = await service.addProduct(name, price)
        res.status(201).json(created)
    } catch (error) {
        res.status(500).json({ error: 'Error in writing file' })
    }
}

async function updateProduct(req, res) {
    try {
        const productId = Number(req.params.id)
        if (Number.isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        const { name, price } = req.body
        if (!name || price === undefined) {
            return res.status(400).json({ error: 'name and price are required' })
        }

        const item = await service.updateProduct(productId, name, price)
        if (!item) {
            return res.status(404).json({ error: 'Element not found' })
        }
        res.json(item)
    } catch (error) {
        res.status(500).json({ error: 'Error in writing file' })
    }
}

async function patchProduct(req, res) {
    try {
        const productId = Number(req.params.id)
        if (Number.isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        const { name, price } = req.body
        if (name === undefined && price === undefined) {
            return res.status(400).json({ error: 'Provide name or price' })
        }

        const item = await service.patchProduct(productId, name, price)
        if (!item) {
            return res.status(404).json({ error: 'Element not found' })
        }
        res.json(item)
    } catch (error) {
        res.status(500).json({ error: 'Error in writing file' })
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = Number(req.params.id)
        if (Number.isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        const removed = await service.deleteProduct(productId)
        if (!removed) {
            return res.status(404).json({ error: 'Element not found' })
        }
        res.json({ message: 'Deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Error in writing file' })
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    patchProduct,
    deleteProduct
}