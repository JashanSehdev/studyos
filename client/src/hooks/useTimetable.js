import API from "../api/axios.js"
import {useState, useEffect} from  "react"

export default function useTimetable() {
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTimeTable()
    },[])

    const fetchTimeTable = async () => {
        try{
            const res = await API.get("/timetable")
            setEntries(res.data)
        } catch(err) {
            console.error(err);
            setEntries([])
        } finally {
            setLoading(false);
        }
    }

    const addEntry = async (data) => {
        try{
            const res = await API.post("/timetable", data)
            setEntries(prev => [...prev, res.data]);
        } catch (err) {
            console.error(err);
        }
    }

    const deleteEntry = async (id) => {
        try {
            await API.delete(`/timetable/${id}`)
            setEntries(prev => prev.filter(e => String(e._id) !== String(id)))
        } catch (err) {
            console.error(err);
        }
    }

    return {entries, fetchTimeTable, addEntry, deleteEntry, loading}
}