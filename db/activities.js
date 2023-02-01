const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
}

async function getAllActivities() {
  // select and return an array of all activities
}

async function getActivityById(id) {
  try {
    const {rows: [activity]} = await client.query(`
      SELECT * FROM activities 
      WHERE id=$1
    `, [id])
    return activity
  } catch (error) {
    throw error
  }
}

async function getActivityByName(name) {
  try {
    const {rows: [activity]} = await client.query(`
      SELECT * FROM activities 
      WHERE name=$1
    `, [name])
    return activity
  } catch (error) {
    throw error
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
