import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
]

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function Dashboard() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [assignments, setAssignments] = useState([])
  const [timetable,   setTimetable]   = useState([])
  const [notes,       setNotes]       = useState([])
  const [loading,     setLoading]     = useState(true)

  // Pick a random quote once per day using date as seed
  const quote = QUOTES[new Date().getDate() % QUOTES.length]

  // Today's day name
  const todayName = DAYS[new Date().getDay()]

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [a, t, n] = await Promise.all([
          API.get('/assignments'),
          API.get('/timetable'),
          API.get('/notes'),
        ])
        setAssignments(a.data)
        setTimetable(t.data)
        setNotes(n.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Derived data
  const pendingAssignments = assignments.filter(a => a.status === 'pending')
  const overdueAssignments = pendingAssignments.filter(a => new Date(a.due_date) < new Date())
  const todayClasses       = timetable
    .filter(t => t.day === todayName)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
  const recentNotes        = notes.slice(0, 3)

  // Greeting based on time
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
      </div>

      {/* Motivational Quote */}
      <div
        className="rounded-2xl p-6 mb-6 border border-primary/20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05))',
        }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: '#6C63FF', transform: 'translate(30%, -30%)' }}
        />
        <p className="text-2xl mb-1">💡</p>
        <p className="text-white text-sm font-medium italic mb-1">"{quote.text}"</p>
        <p className="text-primary text-xs">— {quote.author}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        {/* Pending Assignments */}
        <div
          className="rounded-2xl p-5 border border-white/10 cursor-pointer hover:border-primary/40 transition-all"
          style={{ background: 'rgba(30,30,46,0.85)' }}
          onClick={() => navigate('/assignments')}
        >
          <p className="text-3xl mb-2">📋</p>
          <p className="text-white text-2xl font-bold">{pendingAssignments.length}</p>
          <p className="text-gray-400 text-xs mt-1">Pending Assignments</p>
          {overdueAssignments.length > 0 && (
            <p className="text-red-400 text-xs mt-2">
              ⚠️ {overdueAssignments.length} overdue
            </p>
          )}
        </div>

        {/* Today's Classes */}
        <div
          className="rounded-2xl p-5 border border-white/10 cursor-pointer hover:border-primary/40 transition-all"
          style={{ background: 'rgba(30,30,46,0.85)' }}
          onClick={() => navigate('/timetable')}
        >
          <p className="text-3xl mb-2">🗓️</p>
          <p className="text-white text-2xl font-bold">{todayClasses.length}</p>
          <p className="text-gray-400 text-xs mt-1">Classes Today</p>
          {todayClasses.length > 0 && (
            <p className="text-green-400 text-xs mt-2">
              Next: {todayClasses[0].subject} at {todayClasses[0].start_time.slice(0, 5)}
            </p>
          )}
        </div>

        {/* Recent Notes */}
        <div
          className="rounded-2xl p-5 border border-white/10 cursor-pointer hover:border-primary/40 transition-all"
          style={{ background: 'rgba(30,30,46,0.85)' }}
          onClick={() => navigate('/notes')}
        >
          <p className="text-3xl mb-2">📝</p>
          <p className="text-white text-2xl font-bold">{notes.length}</p>
          <p className="text-gray-400 text-xs mt-1">Total Notes</p>
          {notes.length > 0 && (
            <p className="text-blue-400 text-xs mt-2">
              Latest: {notes[0]?.title?.slice(0, 20) || 'Untitled'}
            </p>
          )}
        </div>

      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Today's Timetable */}
        <div
          className="rounded-2xl p-5 border border-white/10"
          style={{ background: 'rgba(30,30,46,0.85)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Today's Classes</h3>
            <span className="text-gray-500 text-xs">{todayName}</span>
          </div>

          {todayClasses.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-gray-500 text-xs">No classes today!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {todayClasses.map(cls => (
                <div
                  key={cls.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(108,99,255,0.08)' }}
                >
                  <div
                    className="w-1 h-10 rounded-full"
                    style={{ background: '#6C63FF' }}
                  />
                  <div>
                    <p className="text-white text-xs font-medium">{cls.subject}</p>
                    <p className="text-gray-500 text-xs">
                      {cls.start_time.slice(0, 5)} – {cls.end_time.slice(0, 5)}
                      {cls.room ? ` · ${cls.room}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Assignments List */}
        <div
          className="rounded-2xl p-5 border border-white/10"
          style={{ background: 'rgba(30,30,46,0.85)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Upcoming Assignments</h3>
            <span
              className="text-primary text-xs cursor-pointer hover:underline"
              onClick={() => navigate('/assignments')}
            >
              View all
            </span>
          </div>

          {pendingAssignments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-gray-500 text-xs">All caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {pendingAssignments.slice(0, 4).map(a => {
                const isOverdue = new Date(a.due_date) < new Date()
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{a.title}</p>
                      <p className="text-gray-500 text-xs">{a.subject}</p>
                    </div>
                    <p className={`text-xs ml-3 flex-shrink-0 ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                      {isOverdue ? '⚠️ ' : ''}
                      {a.due_date
                        ? new Date(a.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        : 'No date'
                      }
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Notes */}
        <div
          className="rounded-2xl p-5 border border-white/10 col-span-2"
          style={{ background: 'rgba(30,30,46,0.85)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Recent Notes</h3>
            <span
              className="text-primary text-xs cursor-pointer hover:underline"
              onClick={() => navigate('/notes')}
            >
              View all
            </span>
          </div>

          {recentNotes.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-2">📝</p>
              <p className="text-gray-500 text-xs">No notes yet. Start writing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {recentNotes.map(note => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl border border-white/5 cursor-pointer hover:border-primary/30 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                  onClick={() => navigate('/notes')}
                >
                  <p className="text-white text-xs font-medium mb-1 truncate">
                    {note.title || 'Untitled'}
                  </p>
                  <p className="text-gray-500 text-xs mb-2">{note.subject}</p>
                  <p className="text-gray-600 text-xs line-clamp-2">
                    {note.content?.slice(0, 80) || 'No content'}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}