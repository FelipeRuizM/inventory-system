import Home from '../models/home-location-schema.js';

// GET Request Handler
const getLocations = async (req, res) => {
  try {
    const locations = await Home.findAll();
    res.status(200).send(locations);
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad Request');
  }
};

// POST Request Handler
const addLocation = async (req, res) => {
  try {
    const { aisle, row, column, description } = req.body;

    var location = await Home.findAll( { where: {
      aisle: aisle, 
      row: row, 
      column: column
    }});

    if (!location.length) {
      location = await Home.create(
        { aisle: aisle, 
          row: row, 
          column: column, 
          description: description 
        });
      } else {
        location = location[0];
      }

    console.log(location);
    
    res.status(201).send(''+ location.id);
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

export { getLocations, addLocation };
