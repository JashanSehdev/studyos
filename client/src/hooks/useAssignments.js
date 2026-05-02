import { useState, useEffect } from 'react'
import API from '../api/axios.js'
import { AxiosHeaders } from 'axios'

export default function useAssignments() {
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAssignments()
    },[])

    const fetchAssignments = async() => {
        try{
            const res = await API.get('/assignments')
            setAssignments(res.data)

        } catch(err){
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    const addAssignment = async (data) => {
        try{
            const res = await API.post(`/assignments`, data);
            setAssignments(prev=> [...prev, res.data])
        } catch (err) {
            console.error(err);
        }
    }

    const updateAssignment = async (id, data) => {
        try{
            const res = await API.put(`/assignments/${id}`, data);
            setAssignments(prev =>  prev.map(a => a._id === id? res.data : a))

        } catch(err) {

        }
    }

    const deleteAssignment = async (id) => {
        try{
            await API.delete(`/assignments/${id}`);

            setAssignments(prev => prev.filter(a => a._id !== id))
        } catch(err) {
            console.error(err);                        
        }
    }

    const toggleStatus = (assignment) => {
        const newStatus = assignment.status === 'pending' ? 'completed' : 'pending'
        updateAssignment(assignment._id, {...assignment, status: newStatus})
    }

    return {
        assignments,
        loading,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleStatus
    }
}