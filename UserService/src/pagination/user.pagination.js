const buildPagination = (page = 1, limit = 20) => {

    const safePage = Math.max(1, Number(page))
    const safeLimit = Math.min(50, Number(limit))

    return {
        skip: (safePage - 1) * safeLimit,
        take: safeLimit
    }
}

module.exports = { buildPagination }