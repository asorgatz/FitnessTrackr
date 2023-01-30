const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {

    try {
      const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password]);
        
    return user;
  } catch (error) {
    console.error('error creating user')
    throw error;
  }
   }
   
  

async function getUser({ username, password }) {
  try {
    const {rows} = await client.query(`
      SELECT * FROM users WHERE username = $1 AND password = $2
    `, [username, password])
  } catch (error) {
    throw error
  }
}

async function getUserById(userId) {
  try {
    const {rows} = await client.query(`
      SELECT * FROM users WHERE id = $1
      RETURNING id, username
    `, [userId])
    const user = rows[0]
    return user
  } catch (error) {
    console.error
  }
}

async function getUserByUsername(userName) {
  try {
    const {rows} = await client.query(`
      SELECT * FROM users WHERE username = $1
      RETURNING *
    `, [userName])
    const user = rows[0]
    return user
  } catch (error) {
    console.error
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
