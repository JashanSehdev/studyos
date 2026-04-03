import pool from '../db.js'

const createTables = async () => {

    try {
        //USER

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
              id SERIAL PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL,
              password VARCHAR(200) NOT NULL,
              created_at TIMESTAMP DEFAULT NOW()
            )`
        )
        console.log("Users Table Ready");

        // assignments
        await pool.query(`
            CREATE TABLE IF NOT EXISTS assignments(
              id SERIAL PRIMARY KEY,
              user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
              title             VARCHAR(255) NOT NULL,
              subject           VARCHAR(100),
              due_date          DATE,
              priority          VARCHAR(20) DEFAULT 'medium',
              status            VARCHAR(20) DEFAULT 'pending',
              created_at        TIMESTAMP DEFAULT NOW()
                         
                )`
            )
            console.log("ASSIGNMENTS table created");
        
            // timetable
        await pool.query(`
            CREATE TABLE IF NOT EXISTS timetable(
              id            SERIAL PRIMARY KEY,
              user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
              subjects      VARCHAR(100) NOT NULL,
              day           VARCHAR(20) NOT NULL,
              start_time    TIME NOT NULL,
              end_time      TIME NOT NULL,
              room          varchar(50),
              professor     varchar(100)
            
            )`
        )
        
        console.log('timetable table is ready');

        //Notes

        await pool.query(`
            CREATE TABLE IF NOT EXISTS notes (
            id          SERIAL PRIMARY KEY,
            user_id     INTEGER REFERENCES userS(id) ON DELETE CASCADE,
            title       VARCHAR(255) NOT NULL,
            content     TEXT,
            subject     varchar(100),
            summary     TEXT,
            created_at  TIMESTAMP DEFAULT NOW(),
            updated_at  TIMESTAMP DEFAULT NOW()
            )
        `)

        console.log(`Notes table has been created`);

        //GPA

        await pool.query(`
            CREATE TABLE IF NOT EXISTS subjects (
              id            SERIAL PRIMARY KEY,
              user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
              name          VARCHAR(100) NOT NULL,
              credits       INTEGER NOT NULL,
              grade         VARCHAR(5),
              grade_point   DECIMAL(3,2),
              semester      VARCHAR(20),
              created_at  TIMESTAMP DEFAULT NOW()
            
            )
        `)

        console.log("subjects table created successfully");
        console.log("\n all tables are created successfully");

        process.exit(0)
        
    } catch(err) {
        console.error("Migration failed",err);
        process.exit(1)
    }
}

createTables()