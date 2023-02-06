const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities")

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routines] } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal) 
    VALUES($1, $2, $3, $4) 
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
  `, [creatorId, isPublic, name, goal]);
  
  return routines;
  } catch (error) {
  throw error;
  }
  };


async function getRoutineById(id) {
  try {
    const {rows: [routine]} = await client.query(`
      SELECT * 
      FROM routines 
      WHERE id=$1
    `, [id])
    return routine
  } catch (error) {
    throw error
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const {rows} = await client.query(`
      SELECT * 
      FROM routines 
      `)
    return rows
  } catch (error) {
    throw error
  }
}

async function getAllRoutines() {
  try {
    const {rows} = await client.query(`
    SELECT routines.*, count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName", routine_activities.id as "routineActivityId"  
    FROM routines
     JOIN routine_activities ON routines.id = routine_activities."routineId"
     JOIN activities ON activities.id = routine_activities."activityId"
     JOIN users ON "creatorId" = users.id
      `)
    let allRoutines = await attachActivitiesToRoutines(rows)
    allRoutines = Object.values(allRoutines)
    console.log(allRoutines)
    return allRoutines
  } catch (error) {
    throw error
  }
}

async function getAllPublicRoutines() {
  try {
  const {rows} = await client.query(`
    SELECT * 
    FROM routines
    WHERE "isPublic"=true 
    `)
  return rows
} catch (error) {
  throw error
}}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  try {
    const {rows: [activity]} = await client.query(`
    UPDATE routines
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *
    `, Object.values(fields))
    return activity
  } catch (error) {
    throw error
  }
}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
