import { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';

export const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your Dayflow AI Assistant. I can help you draft emails, analyze employee attendance logs, check company policies, or search profiles. What can I do for you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate reply
    setTimeout(() => {
      let replyText = "I've searched your database records. Could you please specify which employee or department you are referencing?";
      if (input.toLowerCase().includes('attendance')) {
        replyText = "Based on today's logs, Engineering has the highest attendance rate at 96%, while Sales has the lowest at 88% with 4 late check-ins.";
      } else if (input.toLowerCase().includes('email') || input.toLowerCase().includes('draft')) {
        replyText = "Here is a draft response:\n\n'Dear Employee,\nYour leave request for next week has been received and approved by the HR department. Enjoy your time off!'";
      }

      setMessages(prev => [...prev, { role: 'assistant', text: replyText }]);
    }, 1000);
  };

  return (
    <div className="premium-card p-6 h-[80vh] flex flex-col justify-between font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Bot className="h-6 w-6 text-teal-600" />
        <div>
          <h3 className="font-bold text-slate-900 text-sm">AI HR Assistant</h3>
          <p className="text-[10px] text-slate-400">Natural language insights and draft templates generator</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 max-w-xl text-xs ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`p-2 rounded-full h-fit flex-shrink-0 ${m.role === 'user' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'}`}>
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`p-3.5 rounded-xl border leading-relaxed whitespace-pre-line ${
              m.role === 'user'
                ? 'bg-slate-900 text-white border-slate-900 rounded-tr-none'
                : 'bg-slate-50 text-slate-700 border-slate-100 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 pt-3 text-xs">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question (e.g., 'Summarize today's attendance' or 'Draft a leave approval email')..."
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
        />
        <button type="submit" className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
