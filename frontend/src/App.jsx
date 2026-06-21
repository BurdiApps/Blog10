import { useState, useEffect, useCallback } from 'react'

function App() {
  const [user, setUser] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const todayKey = new Date().toISOString().split('T')[0]
  const isToday = selectedDate === todayKey
  const viewingDate = new Date(selectedDate + 'T00:00:00')

  const loadIdeas = useCallback(async (dateKey) => {
    try {
      const res = await fetch('/ideas', { credentials: 'include' })
      const all = await res.json()
      const filtered = all.filter(idea => {
        if (!idea.createdAt) return false
        const ideaDate = new Date(idea.createdAt).toISOString().split('T')[0]
        return ideaDate === dateKey
      })
      setIdeas(filtered)
    } catch (err) {
      console.error('Load error:', err)
    }
  }, [])

  useEffect(() => {
    fetch('/auth/profile', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setUser(data.user)
          loadIdeas(selectedDate)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [loadIdeas, selectedDate])

  // CREATE
  const addIdea = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const res = await fetch('/ideas', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.email || 'self',
          title,
          description: description || 'No description',
          category: 'general',
          tags: ['daily'],
          status: 'draft',
          rating: 5,
          createdAt: new Date()
        })
      })

      if (res.ok) {
        setTitle('')
        setDescription('')
        loadIdeas(selectedDate)
      } else {
        const errData = await res.json()
        alert(errData.message || JSON.stringify(errData))
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  // UPDATE
  const startEdit = (idea) => {
    setEditingId(idea._id)
    setEditTitle(idea.title)
    setEditDescription(idea.description || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return

    try {
      const res = await fetch(`/ideas/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.email || 'self',
          title: editTitle,
          description: editDescription || 'No description',
          category: 'general',
          tags: ['daily'],
          status: 'draft',
          rating: 5
        })
      })

      if (res.ok) {
        cancelEdit()
        loadIdeas(selectedDate)
      } else {
        const errData = await res.json()
        alert(errData.message || JSON.stringify(errData))
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  // DELETE
  const deleteIdea = async (id) => {
    if (!confirm('Delete this idea?')) return

    try {
      const res = await fetch(`/ideas/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (res.ok) {
        loadIdeas(selectedDate)
      } else {
        const errData = await res.json()
        alert(errData.message || JSON.stringify(errData))
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  // Date navigation
  const goPrevDay = () => {
    const prev = new Date(viewingDate)
    prev.setDate(prev.getDate() - 1)
    setSelectedDate(prev.toISOString().split('T')[0])
  }

  const goNextDay = () => {
    const next = new Date(viewingDate)
    next.setDate(next.getDate() + 1)
    const nextKey = next.toISOString().split('T')[0]
    if (nextKey <= todayKey) {
      setSelectedDate(nextKey)
    }
  }

  const goToday = () => {
    setSelectedDate(todayKey)
  }

  const count = ideas.length
  const percent = Math.min((count / 10) * 100, 100)
  const goalHit = count >= 10
  const canGoNext = selectedDate < todayKey

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
          <h1 className="text-7xl font-black italic text-red-600 mb-2 tracking-tight">Blog10</h1>
          <p className="text-gray-600 mb-6">10 blog ideas a day — never run out!</p>
          <a
            href="http://localhost:3000/auth/google"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Sign in with Google
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-7xl font-black italic text-red-600 mb-2 tracking-tight">Blog10</h1>
          <p className="text-sm text-gray-500 mb-4">Hi, {user.firstName}!</p>
        </header>

        {/* Date Navigation */}
        <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              onClick={goPrevDay}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
            >
              ← Prev
            </button>

            <input
              type="date"
              value={selectedDate}
              max={todayKey}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-center font-semibold"
            />

            <button
              onClick={goNextDay}
              disabled={!canGoNext}
              className={`font-semibold py-2 px-4 rounded-lg transition ${
                canGoNext
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-700 font-semibold mb-1">
              {viewingDate.toDateString()}
              {isToday && <span className="ml-2 text-red-600">(Today)</span>}
            </p>
            {!isToday && (
              <button
                onClick={goToday}
                className="text-sm text-red-600 hover:underline"
              >
                Jump to today
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="text-center mb-6">
          <p className={`text-lg font-semibold mb-3 ${goalHit ? 'text-green-500' : 'text-red-600'}`}>
            {goalHit
              ? `🎉 Goal hit! ${count}/10 ${isToday ? 'today' : 'that day'}!`
              : `${count}/10 ideas ${isToday ? 'today' : 'that day'}`}
          </p>

          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${goalHit ? 'bg-green-500' : 'bg-red-600'}`}
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        {/* Add Idea (only today) */}
        {isToday ? (
          <form onSubmit={addIdea} className="bg-white p-5 rounded-2xl shadow-md mb-6 space-y-3">
            <input
              type="text"
              placeholder="Idea title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <textarea
              placeholder="Describe your idea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
            >
              + Add Idea
            </button>
          </form>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl mb-6 text-center">
            <p className="text-yellow-700 text-sm">
              📖 You're viewing a past day. Jump to today to add new ideas.
            </p>
          </div>
        )}

        <h2 className="text-xl font-bold mb-3">
          {isToday ? "Today's Ideas" : "Ideas from that day"}
        </h2>

        <ul className="space-y-2">
          {ideas.length === 0 ? (
            <li className="text-gray-400 italic text-center bg-white p-4 rounded-lg">
              {isToday ? 'No ideas yet today. Start adding!' : 'No ideas on this day.'}
            </li>
          ) : (
            ideas.map((idea, i) => (
              <li key={idea._id} className="bg-white p-4 rounded-lg shadow-sm">
                {editingId === idea._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="2"
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    ></textarea>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(idea._id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <strong className="flex-1">{i + 1}. {idea.title}</strong>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => startEdit(idea)}
                          className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteIdea(idea._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <small className="text-gray-500">{idea.description}</small>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>

        <div className="text-center mt-8">
          <a
            href="http://localhost:3000/auth/logout"
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  )
}

export default App