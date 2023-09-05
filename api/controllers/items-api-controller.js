import { Sequelize } from 'sequelize';
import Item from '../models/item-schema.js';
import Home from '../models/home-location-schema.js';

// GET Request Handler
const getItems = async (req, res) => {
  try {
    const items = await
      Item.findAll({
        include: Home
      });
    res.status(200).send(items);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

// GET Request Handler
const getItem = async (req, res) => {
  try {
    const { item, id } = req.params;
    const items = await
      Item.findByPk(item || id, {
        include: Home
      });
    res.status(200).send(items);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

// POST Request Handler
const addItem = async (req, res) => {
  try {
    const { name, status, quantity, image } = req.body;
    const item = await Item.create(
      {
        name: name,
        status: status,
        quantity: quantity,
        image: image
      });
    res.status(201).send(item);
    //res.status(201).send('Item created: ' + JSON.stringify(items, null, 2));
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

// PATCH Request Handler
const updateItem = async (req, res) => {
  try {
    const { item } = req.params;
    const { name, status, quantity, image, FK_location } = req.body;

    // if parameter is a number, use the ID to identify, otherwise, use name
    const whereSearch = /^\d+$/.test(item) ? { id: item } : { name: item };

    var updatedItem = await Item.update({ name, status, quantity, image, FK_location }, {
      where: whereSearch
    });

    console.log('Updated item: ' + updatedItem);

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad Request');
  }
};

// PATCH (decrease) Request Handler
const updateItemQuantity = async (id, quantity, operator) => {
  var operation;
  if (operator === '-') {
    const item = await Item.findByPk(id);
    if (item.dataValues.quantity - quantity < 0) {
      // ensure that quantity won't be less than zero
      quantity = item.dataValues.quantity;
    }
    operation = 'quantity - ' + quantity;
  } else {
    operation = 'quantity + ' + quantity;
  }

  await Item.update(
    { quantity: Sequelize.literal(operation) },
    {
      where: { id: id }
    });

  // Add this part to make sure showing right item status - Hazel
  const item = await Item.findByPk(id);
  if (item.dataValues.quantity <= 0) {
    await Item.update(
      { status: "Out of stock" }, { where: { id: id } }
    );
  } else {
    await Item.update(
      { status: "Available" }, { where: { id: id } }
    );
  }
};

// updateItemQuantityEndPoint
const updateItemQuantityEP = async (req, res) => {
  try {
    const { id } = req.params;
    var { operator, quantity } = req.body;

    updateItemQuantity(id, quantity, operator);

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

// DELETE Request Handler
const deleteItem = async (req, res) => {
  try {
    const { item } = req.params;

    // if parameter is a number, use the ID to identify, otherwise, use name
    const whereSearch = /^\d+$/.test(item) ? { id: item } : { name: item };

    var deletedItem = await Item.destroy({
      where: whereSearch
    });

    res.status(204).send('Deleted item ' + deletedItem);
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad Request');
  }
};

export { getItems, getItem, addItem, updateItem, updateItemQuantity, updateItemQuantityEP, deleteItem };