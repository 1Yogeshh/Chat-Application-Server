const validate = (schema, source = "body") => (req, res, next) => {
    try {

        const data = schema.parse(req[source])

        req[source] = data

        next()

    } catch (err) {

        return res.status(400).json({
            success: false,
            errors: err.flatten()
        })
    }
}

module.exports = validate