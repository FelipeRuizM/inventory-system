import Cart from '../models/cart-schema.js';
import Course from '../models/course-schema.js';
import ItemCart from '../models/item-cart-schema.js';
import Item from '../models/item-schema.js';
import Lab from '../models/lab-schema.js';

// GET Request Handler
const getCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll({
      include: [Item, {
        model: Lab,
        include: [Course] // Cart page should also show the Lab section belong to which Course
      }]
    });
    res.status(200).send(carts);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

const getCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await
      Cart.findByPk(id, {
        include: [Item] // remove Lab, FK_lab will be enough for cart update
      });
    res.status(200).send(cart);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

// POST Request Handler
const addCart = async (req, res) => {
  try {
    const { status, items } = req.body;

    const cart = await Cart.create(
      {
        status: status
      });

    for (const item of items) {
      var { id, quantity } = item;
      await ItemCart.create(
        {
          quantity: quantity,
          itemId: id,
          cartId: cart.id
        });
    }

    res.status(201).send(cart);
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

// PATCH Request Handler
const updateCart = async (req, res) => {
  try {
    const { id } = req.params;

    const { status, FK_lab, items } = req.body;

    const cart = await Cart.update(
      {
        status: status,
        FK_lab: FK_lab
      }, {
      where: { id: id }
    });

    if (items) {
      await ItemCart.destroy({
        where: {
          cartId: id
        }
      });

      for (const item of items) {
        const itemId = item.id;
        const quantity = item.quantity;
        await ItemCart.create({
          quantity: quantity,
          itemId: itemId,
          cartId: id
        });
      }
    }

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

// DELETE Request Handler
const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    await Cart.destroy({
      where: {
        id: id
      }
    });

    await ItemCart.destroy({
      where: {
        cartId: id
      }
    });

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

export { getCarts, getCart, addCart, updateCart, deleteCart };
