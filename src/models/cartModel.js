import { Schema, model } from "mongoose";

const cartSchema = new Schema ({
    products : {
        type : [
            {
                id_prod: {
                    type : Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },

                quantity : {
                    type: Number,
                    required: true
                }
            }
        ],

        default: function () {
            return []
        }
    }
})

cartSchema.pre('find', async function () {
    try {
        await this.populate('products.id_prod')
    } catch (error) {
        logger.error('Error while populate: ', error)
        next(error)
    }
})

const cartModel = model('carts', cartSchema)

export default cartModel