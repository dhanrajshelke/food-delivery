import { useState, useRef, useEffect } from 'react'
import './AiChat.css'

const GEMINI_API_KEY = 'AIzaSyBv5ZH5JgEGHy7Z3TQsdfkZVnd6XgC2ieI'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

const SYSTEM_PROMPT = `You are Jarvis AI, a helpful assistant for a food delivery app. 
Help users with: finding restaurants, food recommendations, order tracking questions, cuisine suggestions, and general food queries.
Keep responses short, friendly, and food-focused. Use emojis occasionally.`

export default function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m Jarvis AI 🍕 Ask me anything about food, restaurants, or your orders!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }))

      // Prepend system prompt as first user/model exchange
      const systemTurn = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Got it! I\'m Jarvis AI, ready to help.' }] }
      ]

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [...systemTurn, ...history, { role: 'user', parts: [{ text }] }]
        })
      })

      const data = await res.json()
      if (!res.ok) {
        console.error('Gemini API error:', data)
        setMessages(prev => [...prev, { role: 'assistant', text: `API Error: ${data?.error?.message || res.status}` }])
        return
      }
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.'
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (err) {
      console.error('Fetch error:', err)
      setMessages(prev => [...prev, { role: 'assistant', text: 'Network error. Check your connection and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="ai-chat-widget">
      {open && (
        <div className="ai-chat-box">
          <div className="ai-chat-header">
            <span>🤖 Jarvis AI</span>
            <button onClick={() => setOpen(false)} className="ai-close-btn">✕</button>
          </div>
          <div className="ai-chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                <span>{m.text}</span>
              </div>
            ))}
            {loading && (
              <div className="ai-msg assistant">
                <span className="ai-typing">Thinking<span>.</span><span>.</span><span>.</span></span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="ai-chat-input">
            <input
              type="text"
              placeholder="Ask about food, restaurants..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} className="ai-send-btn">
              ➤
            </button>
          </div>
        </div>
      )}
      <button className="ai-chat-fab" onClick={() => setOpen(!open)} title="Ask Jarvis AI">
        {open ? '✕' : '🤖'}
      </button>
    </div>
  )
}
