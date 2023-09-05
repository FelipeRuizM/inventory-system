import { Sequelize } from 'sequelize';
import Lab from '../models/lab-schema.js';
import Cart from '../models/cart-schema.js';
import Course from '../models/course-schema.js';

// GET Request Handler
const getCourses = async (req, res) => {
  try {
    const courses = await
      Course.findAll({
        include: [{
          model: Lab,
          include: [Cart] // Get cart info to display on Lab Sections page - Hazel
        }],
        order: [
          ['name', 'ASC']
        ]
      });
    res.status(200).send(courses);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

// GET Request Handler
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await
      Course.findByPk(id, {
        include: Lab
      });
    res.status(200).send(course);
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
};

// POST Request Handler
const addCourse = async (req, res) => {
  try {
    // To avoid adding same course to DB
    const { name } = req.body;
    var course = await Course.findAll({
      where: {
        name: name
      }
    });
    if (!course.length) {
      course = await Course.create(
        {
          name: name
        });
      res.status(201).send(course);
    } else {
      course = course[0];
    }

  } catch (err) {
    console.log(err);
    res.status(400).send('Error: ' + err);
  }
};

// PATCH Request Handler
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    var updatedCourse = await Course.update({ name }, {
      where: { id: id }
    });

    console.log('Updated course: ' + updatedCourse);

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad Request');
  }
};

// DELETE Request Handler
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    var deletedCourse = await Course.destroy({
      where: { id: id }
    });

    res.status(204).send('Deleted course: ' + deletedCourse);
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad Request');
  }
};

export { getCourses, getCourse, addCourse, updateCourse, deleteCourse };