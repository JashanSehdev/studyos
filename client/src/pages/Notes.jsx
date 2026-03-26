import useNotes from "../hooks/useNotes"
import { useState } from 'react'


const emptyForm = {
  title: '',
  subject: '',
  content: '',
}

export default function Notes() {
  const {fetchNotes, addNote, updateNote, deleteNote, notes, loading} = useNotes();
  const [showform, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');


  function handleChange(e) {
    setForm({...form, [e.target.name] : e.target.value});
  }

  async function handleSubmit() {
    if (!form.title || ! form.subject) return;
    await addNote(form);
    setForm(emptyForm);
    setShowForm(false);
  }
  const filtered = notes.filter(note => {
    if (search.length <= 2) return true;
    const searchLower = search.toLowerCase();
    return note.title.toLowerCase().includes(searchLower) ||
           note.content.toLowerCase().includes(searchLower) ||
           note.subject.toLowerCase().includes(searchLower);
  })



  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold"
          >
            Notes</h1>
            <p className=" text-gray-500 text-sm mt-1">{notes.length} Notes</p>
        </div>
        <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
        style={{
          background: 'linear-gradient(135deg, #6C63FF, #8B85FF)',
          boxShadow: '0 4px 24px #6C63FF44'
        }}
        >
          + Add Note
        </button>
      </div>

      {/* Search tab */}

      <div className="flex gap-2 mb-6">
        <div className="relative">
          <input type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search🔍"
          className="p-3 pr-8 rounded-xl text-white text-sm placeholder-gray-400 border border-white/10"
          style={{background: 'rgba(255,255,255,0.04)'}} />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>


      {/* Add Notes Form */}

      {showform && <div className="rounded-2xl p-6 mb-6 border border-white/10"
        style={{ background: 'rgba(30,30,46,0.85)' }}
        >
          <h3 className="text-white font-semibold mb-4"> New Note</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-gray-400">Title</label>
              <input
              name="title"
              onChange={handleChange}
              value={form.title}
              placeholder="e.g Data Science"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 border border-white/10 focus:outline-none focus:border-primary"
              style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1 block">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g Math, Science"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 border border-white/10 focus:outline-none focus:border-primary"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            </div>

            <div className="col-span-2">
              <label
              className="text-gray-400 text-xs mb-1 block">
              Content
              </label>
              <textarea
              name="content"
              onChange={handleChange}
              value={form.content}
              placeholder="e.g Your note content here..."
              className="w-full h-80 px-4 py-3 rounded-xl text-sm text-white border border-white/10 focus:outline-none focus:border-primary resize-none scrollbar-hide" 
              style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>            
          </div>
          <div className="flex gap-3 mt-4">
            <button 
            onClick={handleSubmit}
            className="text-white text-sm font-semibold px-6 py-2 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #8B85FF)' }}
            >submit</button>
            <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setShowForm(false);
            }}
            className="text-gray-400 text-sm font-medium px-6 py-2 rounded-xl bg-gray-400 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.05)' }}>cancel</button>
          </div>
        </div>}

      {/* Notes List */}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-500 text-sm">No notes here. Add one!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-2xl border border-white/10"
              style={{ background: 'rgba(30,30,46,0.85)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-lg">{note.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{note.subject}</p>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">{note.content}</p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-gray-600 hover:text-red-400 transition-all text-sm ml-4"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}