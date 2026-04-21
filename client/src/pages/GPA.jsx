import { useState } from 'react'
import useGPA from '../hooks/useGPA.js'

const GRADES   = ['O', 'A+', 'A', 'B+', 'B', 'C']
const SEMESTERS = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']

const gradeColor = {
  'O':  'text-emerald-400',
  'A+': 'text-green-400',
  'A':  'text-blue-400',
  'B+': 'text-yellow-400',
  'B':  'text-orange-400',
  'C':  'text-red-400',
}

const emptyForm = {
  name: '', credits: '4', grade: 'O', semester: 'Sem 1'
}

export default function GPA() {
  const {
    subjects, loading,
    addSubject, deleteSubject,
    calculateSGPA, calculateCGPA,
    groupBySemester
  } = useGPA()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(emptyForm)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.credits || !form.grade) return
    await addSubject(form)
    setForm(emptyForm)
    setShowForm(false)
  }

  const cgpa       = calculateCGPA()
  const semGroups  = groupBySemester()

  // CGPA color
  const cgpaColor = cgpa >= 9 ? '#10B981' : cgpa >= 7 ? '#6C63FF' : cgpa >= 5 ? '#F59E0B' : '#EF4444'

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">GPA Calculator</h1>
          <p className="text-gray-500 text-sm mt-1">
            {subjects.length} subjects tracked
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, #6C63FF, #8B85FF)',
            boxShadow: '0 4px 24px #6C63FF44'
          }}
        >
          + Add Subject
        </button>
      </div>

      {/* CGPA Card */}
      {subjects.length > 0 && (
        <div
          className="rounded-2xl p-6 mb-8 border border-white/10 flex items-center justify-between"
          style={{ background: 'rgba(30,30,46,0.85)' }}
        >
          <div>
            <p className="text-gray-400 text-sm mb-1">Overall CGPA</p>
            <p className="text-6xl font-bold" style={{ color: cgpaColor }}>
              {cgpa}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Based on {subjects.length} subjects · {subjects.reduce((s, sub) => s + Number(sub.credits), 0)} total credits
            </p>
          </div>

          {/* Grade distribution */}
          <div className="flex flex-col gap-1">
            {GRADES.map(g => {
              const count = subjects.filter(s => s.grade === g).length
              if (count === 0) return null
              return (
                <div key={g} className="flex items-center gap-2">
                  <span className={`text-xs font-bold w-6 ${gradeColor[g]}`}>{g}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: count }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: cgpaColor }}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-xs">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add Subject Form */}
      {showForm && (
        <div
          className="rounded-2xl p-6 mb-6 border border-white/10"
          style={{ background: 'rgba(30,30,46,0.85)' }}
        >
          <h3 className="text-white font-semibold mb-4">Add Subject</h3>
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2">
              <label className="text-gray-400 text-xs mb-1 block">Subject Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Data Structures"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">Credits</label>
              <select
                name="credits"
                value={form.credits}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: '#1E1E2E' }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map(c => (
                  <option key={c} value={c}>{c} Credits</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">Grade</label>
              <select
                name="grade"
                value={form.grade}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: '#1E1E2E' }}
              >
                {GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-gray-400 text-xs mb-1 block">Semester</label>
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: '#1E1E2E' }}
              >
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #8B85FF)' }}
            >
              Save
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm) }}
              className="px-6 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subjects grouped by semester */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : subjects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-gray-500 text-sm">No subjects yet. Add one to calculate your GPA!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(semGroups).map(([sem, semSubjects]) => (
            <div key={sem}>

              {/* Semester header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">{sem}</h3>
                <span className="text-primary text-sm font-bold">
                  SGPA: {calculateSGPA(semSubjects)}
                </span>
              </div>

              {/* Subjects */}
              <div className="flex flex-col gap-2">
                {semSubjects.map(s => (
                  <div
                    key={s._id}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/10"
                    style={{ background: 'rgba(30,30,46,0.85)' }}
                  >
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <p className="text-gray-500 text-xs">{s.credits} Credits</p>
                    </div>

                    <span className={`text-lg font-bold ${gradeColor[s.grade]}`}>
                      {s.grade}
                    </span>

                    <span className="text-gray-500 text-xs">
                      {s.grade_point} pts
                    </span>

                    <button
                      onClick={() => deleteSubject(s._id)}
                      className="text-gray-600 hover:text-red-400 transition-all text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}