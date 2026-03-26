import { useState } from 'react'
import useAssignments from '../hooks/useAssignments'

const SUBJECTS = ['Computer Science', 'Mathematics', 'Physics', 'English', 'Other']
const PRIORITIES = ['low', 'medium', 'high']

const priorityColor = {
  low:    'bg-green-500/10  text-green-400  border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high:   'bg-red-500/10   text-red-400    border-red-500/20',
}

const emptyForm = {
  title: '', subject: 'Computer Science',
  due_date: '', priority: 'medium'
}

export default function Assignments() {
  const { assignments, loading, addAssignment, deleteAssignment, toggleStatus } = useAssignments()
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [filter, setFilter]       = useState('all') // all | pending | completed

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title || !form.due_date) return
    await addAssignment(form)
    setForm(emptyForm)
    setShowForm(false)
  }

  const filtered = assignments.filter(a => {
    if (filter === 'all')       return true
    if (filter === 'pending')   return a.status === 'pending'
    if (filter === 'completed') return a.status === 'completed'
  })

  const isOverdue = (due_date) => {
    return new Date(due_date) < new Date() 
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Assignments</h1>
          <p className="text-gray-500 text-sm mt-1">
            {assignments.filter(a => a.status === 'pending').length} pending
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #6C63FF, #8B85FF, #6C63FF, #8B85FF)',
            boxShadow: '0 4px 24px #6C63FF44'
          }}
        >
          + Add Assignment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all
              ${filter === f
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
              }`}
            style={{ background: filter === f ? '#6C63FF' : 'rgba(255,255,255,0.05)' }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Add Assignment Form */}
      {showForm && (
        <div
          className="rounded-2xl p-6 mb-6 border border-white/10"
          style={{ background: 'rgba(30,30,46,0.85)' }}
        >
          <h3 className="text-white font-semibold mb-4">New Assignment</h3>
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2">
              <label className="text-gray-400 text-xs mb-1 block">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. DSA Assignment 3"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            </div>

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
              <label className="text-gray-400 text-xs mb-1 block">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: 'rgba(255,255,255,0.04)', colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: '#1E1E2E' }}
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p} className="capitalize">{p}</option>
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

      {/* Assignment List */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 text-sm">No assignments here. Add one!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(a => (
            <div
              key={a.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border border-white/10 transition-all
                ${a.status === 'completed' ? 'opacity-50' : ''}`}
              style={{ background: 'rgba(30,30,46,0.85)' }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleStatus(a)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all
                  ${a.status === 'completed'
                    ? 'bg-primary border-primary'
                    : 'border-gray-600 hover:border-primary'
                  }`}
              >
                {a.status === 'completed' && (
                  <span className="text-white text-xs flex items-center justify-center">✓</span>
                )}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${a.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                  {a.title}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{a.subject}</p>
              </div>

              {/* Due date */}
              <p className={`text-xs font-medium ${isOverdue(a.due_date) && a.status === 'pending' ? 'text-red-400' : 'text-gray-500'}`}>
                {isOverdue(a.due_date) && a.status === 'pending' ? '⚠️ ' : '📅 '}
                {new Date(a.due_date).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>

              {/* Priority badge */}
              <span className={`text-xs px-3 py-1 rounded-full border capitalize ${priorityColor[a.priority]}`}>
                {a.priority}
              </span>

              {/* Delete */}
              <button
                onClick={() => deleteAssignment(a.id)}
                className="text-gray-600 hover:text-red-400 transition-all text-sm"
              >
                ✕
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}