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
    return allRoutines
  } catch (error) {
    throw error
  }
}

async function getAllPublicRoutines() {
  try {
  const {rows} = await client.query(`
  SELECT routines.*, count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName", routine_activities.id as "routineActivityId"  
  FROM routines
   JOIN routine_activities ON routines.id = routine_activities."routineId"
   JOIN activities ON activities.id = routine_activities."activityId"
   JOIN users ON "creatorId" = users.id
  WHERE "isPublic"=true
    `)
  let publicRoutines = await attachActivitiesToRoutines(rows)
  publicRoutines = Object.values(publicRoutines)
  return publicRoutines
} catch (error) {
  throw error
}}

async function getAllRoutinesByUser({ username }) {
  try {
    const {rows} = await client.query(`
      SELECT routines.*, count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName", routine_activities.id as "routineActivityId"  
      FROM routines
        JOIN routine_activities ON routines.id = routine_activities."routineId"
        JOIN activities ON activities.id = routine_activities."activityId"
        JOIN users ON "creatorId" = users.id
      WHERE username=$1
    `, [username])
  let routinesByUser = await attachActivitiesToRoutines(rows)
  routinesByUser = Object.values(routinesByUser)
  
  return routinesByUser
  } catch (error) {
    throw error
  }



}

async function getPublicRoutinesByUser({ username }) {
  try {
    const {rows} = await client.query(`
      SELECT routines.*, count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName", routine_activities.id as "routineActivityId"  
      FROM routines
        JOIN routine_activities ON routines.id = routine_activities."routineId"
        JOIN activities ON activities.id = routine_activities."activityId"
        JOIN users ON "creatorId" = users.id
      WHERE "isPublic"=true
      AND username=$1
    `, [username])
  let publicRoutinesByUser = await attachActivitiesToRoutines(rows)
  publicRoutinesByUser = Object.values(publicRoutinesByUser)
  return publicRoutinesByUser
    
  } catch (error) {
    throw error
  }

}


}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const {rows} = await client.query(`
      SELECT routines.*, count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName", routine_activities.id as "routineActivityId"  
      FROM routines
        JOIN routine_activities ON routines.id = routine_activities."routineId"
        JOIN activities ON activities.id = routine_activities."activityId"
        JOIN users ON "creatorId" = users.id
      WHERE "isPublic"=true
      AND activities.id=$1
      `, [id])
    let publicRoutines = await attachActivitiesToRoutines(rows)
    publicRoutines = Object.values(publicRoutines)
    return publicRoutines
  } catch (error) {
    throw error
  }
}

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

async function destroyRoutine(id) {
  try {
    const {rows: ra} = await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId"=$1;
  `, [id])
  const {rows: routines} = await client.query(`
    DELETE FROM routines
    WHERE id=$1;
  `, [id])
  } catch (error) {
    throw error
  }

}

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
