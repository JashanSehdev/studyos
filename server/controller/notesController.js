import pool from "../db.js";


export async function getNotes(req, res) {
    try{
        const query = `SELECT * FROM notes WHERE user_id = $1`;
        const result = await pool.query(query, [req.userId]);
        res.status(200).json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'Internal Server Error'});
    }
}

export async function createNote(req, res) {
    const{title, content, subject} = req.body;
    try{
        const query = `INSERT INTO notes (user_id, title, content, subject) VALUES ($1, $2, $3, $4) RETURNING *`
        const result = await pool.query(query, [req.userId, title, content, subject]);
        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'Internal Server Error'});        
    }
}

export async function updateNote(req, res) {
    const {title, content, subject, summary} = req.body;
    const {id} = req.params;

    try {

        const query = `UPDATE notes SET title = $2, subject = $3, summary = $4, content = $5 WHERE id = $1 RETURNING *`
        const result = await pool.query(query, [id, title, subject, summary, content]);
        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'Internal Server Error'});        
    }
}

export async function deleteNote (req, res) {
    const {id} = req.params;
    try {
        const query = `DELETE FROM notes WHERE id = $1`;
        await pool.query(query, [id]);
        res.status(200).json({message : 'Note Deleted Successfully'})

    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'Internal Server Error'});       
    }
}