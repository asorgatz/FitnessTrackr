const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [routine_activity] } = await client.query(`
    INSERT INTO routine_activities("routineId", "activityId", count, duration) 
    VALUES($1, $2, $3, $4) 
    RETURNING *;
  `, [routineId, activityId, count, duration]);
      
  return routine_activity;
} catch (error) {
  throw error;
}
}

async function getRoutineActivityById(id) {
  try {
    const {rows: [routineActivity]} = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE id=$1
    `, [id])
    return routineActivity
  } catch (error) {
    throw error
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const {rows} = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE "routineId"=$1
    `, [id])
    return rows
  } catch (error) {
    throw error
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  try {
    const {rows: [activity]} = await client.query(`
    UPDATE routine_activities
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *
    `, Object.values(fields))
    return activity
  } catch (error) {
    throw error
  }
}

async function destroyRoutineActivity(id) {
  const {rows: [destroyed]} = await client.query(`
  DELETE FROM routine_activities
  WHERE id=$1
  RETURNING *
  `, [id])
  
  return destroyed
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const {rows: [query]} = await client.query(`
  SELECT * FROM routine_activities 
    JOIN routines ON routine_activities."routineId" = routines.id
  WHERE routine_activities.id=$1
  `, [routineActivityId])

  return query.creatorId === userId
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
