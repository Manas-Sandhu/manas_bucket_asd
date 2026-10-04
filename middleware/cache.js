const CACHE_TIME = 60 * 1000

let store = {}
let changes = 0

function checkCache(req, res, next) {
    const url = req.originalUrl
    const hit = store[url]

    if (hit && Date.now() - hit.savedAt < CACHE_TIME) {
        res.set('X-Cache', 'HIT')
        return res.status(200).json(hit.body)
    }

    if (hit) {
        delete store[url]
    }

    res.set('X-Cache', 'MISS')

    const before = changes
    const originalSend = res.json.bind(res)

    res.json = (body) => {
        if (res.statusCode === 200 && before === changes) {
            store[url] = { body: body, savedAt: Date.now() }
        }
        return originalSend(body)
    }

    next()
}

function clearCache(req, res, next) {
    res.on('finish', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            changes++
            store = {}
        }
    })
    next()
}

module.exports = { checkCache, clearCache }