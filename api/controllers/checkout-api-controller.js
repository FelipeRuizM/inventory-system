import Checkout from '../models/checkout-schema.js';
import ItemCheckout from '../models/item-checkout-schema.js';
import Item from '../models/item-schema.js';
import Cart from '../models/cart-schema.js';
import { updateItemQuantity } from './items-api-controller.js';
import { Op } from 'sequelize';

// GET Request Handler
const getCheckouts = async (req, res) => {
  try {
    // Just can't find the solution to send request body or params successfully through axios get method
    // So, I use query to make it work at this moment - Hazel
    const { returnDate } = req.query;

    var checkouts;
    if (returnDate === null || returnDate === "") {
      checkouts = await
        Checkout.findAll({
          where: {
            [Op.and]: [
              {
                returnDate: {
                  [Op.or]: {
                    [Op.is]: null,
                    [Op.eq]: ""
                  }
                }
              },
              {
                cartid: {
                  [Op.is]: null
                }
              }
            ]

          },
          order: [["checkoutDate", "DESC"]],
          include: Item
        });
    } else {
      checkouts = await
        Checkout.findAll({
          where: {
            returnDate: {
              [Op.or]: {
                [Op.ne]: null,
                [Op.ne]: ""
              }
            }
          },
          order: [["returnDate", "DESC"]],
          include: Item
        });
    }

    res.status(200).send(checkouts);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

// GET ONLY CART Checkouts
const getCartCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.findAll({
      where: {
        [Op.and]: [{
          returnDate: {
            [Op.or]: {
              [Op.is]: null,
              [Op.eq]: ""
            }
          }
        },
        {
          cartid: {
            [Op.not]: null
          }
        }]
      },
      order: [["checkoutDate", "DESC"]],
      include: Item
    });
    res.status(200).send(checkouts);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
}

// GET Request Handler
const getCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    const checkout = await
      Checkout.findByPk(id, {
        include: Item
      });
    res.status(200).send(checkout);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

// POST Request Handler
const addCheckout = async (req, res) => {
  try {
    const { checkoutDate, returnDate, cNumber, expectedReturnDate, items, signoutStaff, cartid } = req.body;

    const checkout = await Checkout.create(
      {
        checkoutDate: checkoutDate,
        returnDate: returnDate,
        cNumber: cNumber,
        expectedReturnDate: expectedReturnDate,
        cartid: cartid,
        signoutStaff: signoutStaff
      });

    for (const item of items) {
      var { id, quantity } = item;
      await ItemCheckout.create(
        {
          quantity: quantity,
          itemId: id,
          checkoutId: checkout.id
        });
    }

    // Add this part to minus item quantity when checkout items - Hazel
    const item_checkout = await
      ItemCheckout.findAll({
        where: { checkoutId: checkout.id }
      });

    for (const item of item_checkout) {
      const { dataValues } = item;
      const { itemId, quantity } = dataValues;
      await updateItemQuantity(itemId, quantity, '-');
    }

    res.status(201).send(checkout);
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

// PATCH Request Handler
const updateCheckout = async (req, res) => {
  try {
    const { id } = req.params;

    const { checkoutDate, returnDate, cNumber, expectedReturnDate } = req.body;

    await Checkout.update(
      {
        checkoutDate: checkoutDate,
        returnDate: returnDate,
        cNumber: cNumber,
        expectedReturnDate: expectedReturnDate,
      }, {
      where: { id: id }
    });

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad Request');
  }
};

// DELETE Request Handler (probably will be used only for testing purposes)
const deleteCheckout = async (req, res) => {
  try {
    const { id } = req.params;

    await Checkout.destroy({
      where: {
        id: id
      }
    });

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

const signIn = async (req, res) => {
  try {
    const { id } = req.params;
    const { returnDate, signinStaff } = req.body;

    await Checkout.update(
      {
        returnDate: returnDate,
        signinStaff: signinStaff
      }, {
      where: { id: id }
    });

    const item_checkout = await
      ItemCheckout.findAll({
        where: { checkoutId: id }
      });

    for (const item of item_checkout) {
      const { dataValues } = item;
      const { itemId, quantity } = dataValues;
      await updateItemQuantity(itemId, quantity, '+');
    }

    // For cart return, change return cart status back to Prepared - Hazel
    const isCart = await Checkout.findAll({
      attributes: ['cartid'],
      where: { id: id }
    });

    if (isCart) {
      await Cart.update(
        {
          status: "Prepared",
        }, {
        where: { id: isCart[0].cartid }
      });
    }

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

export { getCheckouts, getCheckout, addCheckout, updateCheckout, deleteCheckout, signIn, getCartCheckouts };
