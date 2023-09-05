import { Sequelize } from 'sequelize';
import Lab from '../models/lab-schema.js';
import Course from '../models/course-schema.js';

// GET Request Handler
// Add get all lab sections for build cart feature => can choose assigned which lab section to cart
const getLabs = async (req, res) => {
  try {
    const labs = await
      Lab.findAll({
        include: Course,
      });
    res.status(200).send(labs);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

const getLab = async (req, res) => {
  try {
    const { id } = req.params;
    const lab = await
      Lab.findByPk(id, {
        include: Course
      });
    res.status(200).send(lab);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

// POST Request Handler
const addLab = async (req, res) => {
  try {
    const { section, FK_course } = req.body;
    const lab = await Lab.create(
      {
        section: section,
        FK_course: FK_course
      });
    res.status(201).send(lab);
  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

// DELETE Request Handler
const deleteLab = async (req, res) => {
  try {
    const { id } = req.params;

    var deletedLab = await Lab.destroy({
      where: { id: id }
    });

    res.status(204).send('Deleted lab: ' + deletedLab);
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad Request');
  }
};

// DELETE Labs by specific course FK 
// convenient when deleting course also deleting its lab sections, otherwise need to get lab id first to delete lab section
const deleteLabs = async (req, res) => {
  try {
    const { id } = req.params;

    var deletedLabs = await Lab.destroy({
      where: { FK_course: id }
    });

    res.status(204).send('Deleted labs: ' + deletedLabs);
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad Request');
  }
}

export { addLab, deleteLab, getLab, deleteLabs, getLabs };