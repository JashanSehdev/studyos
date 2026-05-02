import { useState } from 'react'
import useTimetable from '../hooks/useTimetable.js'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const SUBJECTS = ['Computer Science', 'Mathematics', 'Physics', 'English', 'Other']

const COLORS = [
  'bg-purple-500/20 border-purple-500/30 text-purple-300',
  'bg-blue-500/20   border-blue-500/30   text-blue-300',
  'bg-green-500/20  border-green-500/30  text-green-300',
  'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
  'bg-red-500/20    border-red-500/30    text-red-300',
  'bg-pink-500/20   border-pink-500/30   text-pink-300',
]

const emptyForm = {
  subject: 'Computer Science',
  day: 'Monday',
  start_time: '',
  end_time: '',
  room: '',
  professor: ''
}

export default function Timetable() {
  const { entries, loading, addEntry, deleteEntry } = useTimetable()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.subject || !form.day || !form.start_time || !form.end_time) return
    await addEntry(form)
    setForm(emptyForm)
    setShowForm(false)
  }

  // Group entries by day
  const getEntriesForDay = (day) => {
    return entries
      .filter(e => e.day === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }

  // Assign consistent color per subject
  const subjectColorMap = {}
  entries.forEach(e => {
    if (!subjectColorMap[e.subject]) {
      const index = Object.keys(subjectColorMap).length % COLORS.length
      subjectColorMap[e.subject] = COLORS[index]
    }
  })

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Timetable</h1>
          <p className="text-gray-500 text-sm mt-1">
            {entries.length} classes scheduled
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
          + Add Class
        </button>
      </div>

      {/* Add Class Form */}
      {showForm && (
        <div
          className="rounded-2xl p-6 mb-8 border border-white/10"
          style={{ background: 'rgba(30,30,46,0.85)' }}
        >
          <h3 className="text-white font-semibold mb-4">New Class</h3>
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-gray-400 text-xs mb-1 block">Subject</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: '#1E1E2E' }}
              >
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">Day</label>
              <select
                name="day"
                value={form.day}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: '#1E1E2E' }}
              >
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">Start Time</label>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: 'rgba(255,255,255,0.04)', colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">End Time</label>
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: 'rgba(255,255,255,0.04)', colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">Room <span className="text-gray-600">(optional)</span></label>
              <input
                type="text"
                name="room"
                value={form.room}
                onChange={handleChange}
                placeholder="e.g. CS-101"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">Professor <span className="text-gray-600">(optional)</span></label>
              <input
                type="text"
                name="professor"
                value={form.professor}
                onChange={handleChange}
                placeholder="e.g. Dr. Sharma"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
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

      {/* Weekly Grid */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {DAYS.map(day => (
            <div
              key={day}
              className="rounded-2xl p-4 border border-white/10"
              style={{ background: 'rgba(30,30,46,0.85)' }}
            >
              {/* Day Header */}
              <h3 className="text-white font-semibold text-sm mb-3">
                {day}
              </h3>

              {/* Classes */}
              {getEntriesForDay(day).length === 0 ? (
                <p className="text-gray-600 text-xs">No classes</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {getEntriesForDay(day).map(entry => (
                    <div
                      key={entry._id}
                      className={`p-3 rounded-xl border text-xs relative group ${subjectColorMap[entry.subject]}`}
                    >
                      {/* Delete button */}
                      <button
                        onClick={() => deleteEntry(entry._id)}
                  
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all"
                        >
                        ✕
                      </button>

                      <p className="font-semibold pr-4">{entry.subject}</p>
                      <p className="mt-1 opacity-75">
                        {entry.start_time.slice(0, 5)} – {entry.end_time.slice(0, 5)}
                      </p>
                      {entry.room && (
                        <p className="opacity-60">📍 {entry.room}</p>
                      )}
                      {entry.professor && (
                        <p className="opacity-60">👤 {entry.professor}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}