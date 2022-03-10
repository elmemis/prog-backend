module.exports = {
    newProductSchema: {
        name: {
            notEmpty: true,
            errorMessage: "name field cannot be empty"
        },
        description: {
            notEmpty: true,
            errorMessage: "description field cannot be empty"
        },
        code: {
            notEmpty: true,
            errorMessage: "code field cannot be empty"
        },
        price: {
            isDecimal: {
                errorMessage: 'The product price must be a decimal number.'
            },
            notEmpty: true,
            errorMessage: "price field cannot be empty"
        },
        stock: {
            isNumeric: {
                errorMessage: 'The product stock must be a integer.'
            },
            notEmpty: true,
            errorMessage: "stock field cannot be empty"
        },
        thumbnail: {
            isURL: {
                options: {
                    protocols: ['http', 'https'],
                    require_tld: false,
                    require_protocol: true,
                    require_valid_protocol: true,
                },
                errorMessage: "not is a valid URL",
            },
            notEmpty: true,
            errorMessage: "thumbnail field cannot be empty"
        }
    },
    updProductSchema: {
        name: {
            optional: { options: { nullable: true } },
            isLength: {
                errorMessage: "name field length > 0",
                options: { min: 1 }
            }
        },
        description: {
            optional: { options: { nullable: true } },
            isLength: {
                errorMessage: "description field length > 0",
                options: { min: 1 }
            }
        },
        code: {
            optional: { options: { nullable: true } },
            isLength: {
                errorMessage: "code field length > 0",
                options: { min: 1 }
            }
        },
        price: {
            optional: { options: { nullable: true } },
            isDecimal: {
                errorMessage: 'The product price must be a decimal number.'
            }
        },
        stock: {
            optional: { options: { nullable: true } },
            isNumeric: {
                errorMessage: 'The product stock must be a integer.'
            }
        },
        thumbnail: {
            optional: { options: { nullable: true } },
            isURL: {
                options: {
                    protocols: ['http', 'https'],
                    require_tld: false,
                    require_protocol: true,
                    require_valid_protocol: true,
                },
                errorMessage: "not is a valid URL",
            },
        }
    },
}

