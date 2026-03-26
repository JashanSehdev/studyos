import { useState, useEffect } from "react"
import API from "../api/axios.js"

export default function useNotes () {
    const [notes, setNotes]         = useState([]);
    const [loading, setLoading]     = useState(true);

    useEffect(()=> {
        fetchNotes()
    },[]);

    async function fetchNotes() {
        try{
            setLoading(true);
            const result = await API.get("/notes/");
            setNotes(result.data || []);                         
            setLoading(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function addNote(data) {
        try {
            const result = await API.post("/notes/", data);
            if (result && result.data) {
                setNotes(prev => [...prev, result.data]);
 
            }
            return result.data;

        } catch (err) {
            console.error('Error adding note:', err);
        }
    }

    async function updateNote(id, data) {
        try {
            const result = await API.put(`/notes/${id}`, data);
            if (result && result.data){
                setNotes(prev => prev.map(a => Number(a.id) === Number(id) ? result.data : a));
            }
        } catch (err) {
             console.error(err);
        }
    }

    async function deleteNote(id) {
        try {
            await API.delete(`/notes/${id}`);

            setNotes(prev => prev.filter(a => Number(a.id) !== id));

        } catch (err) {
            console.error(err);
        }
    }

    return {
        loading,
        notes,
        deleteNote,
        updateNote,
        addNote,
        fetchNotes
    }
}