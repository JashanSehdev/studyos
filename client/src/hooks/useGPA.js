import { useState, useEffect } from "react";
import API from "../api/axios";

export default function useGPA() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const res = await API.get("/gpa");
            setSubjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    

    const addSubject = async (data) => {
        try {
            const res = await API.post("/gpa", data);
            if (res.data && res.data._id) {
                setSubjects((prev) => [...prev, res.data]);
            }
            return res.data;
        } catch (err) {
            console.error(err);
        }
    };

    const deleteSubject = async (id) => {
        try {
            await API.delete(`/gpa/${id}`);
            setSubjects((prev) => prev.filter((e) => e._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    //SGPA Calculations
    const calculateSGPA = (semesterSubjects) => {
        const totalCredits = semesterSubjects.reduce(
            (sum, s) => sum + Number(s.credits),
            0,
        );
        const totalPoints = semesterSubjects.reduce(
            (sum, s) => sum + Number(s.grade_point) * Number(s.credits),
            0,
        );
        if (totalCredits === 0) return 0;
        return (totalPoints / totalCredits).toFixed(2);
    };

    const calculateCGPA = () => {
        if (subjects.length === 0) return 0;
        const totalCredits = subjects.reduce(
            (sum, s) => sum + Number(s.credits),
            0,
        );
        const totalPoints = subjects.reduce(
            (sum, s) => sum + Number(s.grade_point) * Number(s.credits),
            0,
        );
        if (totalCredits === 0) return 0;
        return (totalPoints / totalCredits).toFixed(2);
    };

    // group semester
    const groupBySemester = () => {
        const groups = {};
        subjects.forEach((s) => {
            const sem = s.semester || "General";
            if (!groups[sem]) groups[sem] = [];
            groups[sem].push(s);
        });
        return groups;
    };

    return {
        subjects,
        loading,
        addSubject,
        deleteSubject,
        calculateSGPA,
        calculateCGPA,
        groupBySemester,
    };
}
