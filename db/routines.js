const client = require("./client");

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
    SELECT routines.*, routine_activities.duration, routine_activities.count, activities.id AS "activityId", activities.name  AS "activityName", description, username AS "creatorName"
    FROM routines
    JOIN routine_activities ON routines.id = routine_activities."routineId"
    JOIN activities ON activities.id = routine_activities."activityId"
    JOIN users ON users.id = routines."creatorId"
      `)
    console.log(rows)
    const allRoutines = {}
    rows.forEach( row => {
      allRoutines[row.id] = {
        id: row.id,
        creatorId: row.creatorId,
        isPublic: row.isPublic,
        name: row.name,
        goal: row.goal,
        activities: {

          duration: row.duration,

        }



      }
    })


    return rows
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
    console.log(setString)
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
