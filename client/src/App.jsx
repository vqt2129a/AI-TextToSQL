import { useCallback } from 'react';
import { useChat } from './hooks/useChat';
import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import SidePanel from './components/SidePanel';

export default function App() {
  const {
    messages, isProcessing, isConnected, history,
    send, clearMessages, clearHistory, messagesEndRef,
  } = useChat();

  const handleSuggestion = useCallback((text) => {
    send(text);
  }, [send]);

  return (
    <div className="h-screen flex flex-col bg-gray-950 relative overflow-hidden">
      {/* Animated BG orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="bg-orb w-96 h-96 bg-cyan-500 -top-48 -left-48" />
        <div className="bg-orb w-80 h-80 bg-teal-500 top-1/2 -right-40" style={{ animationDelay: '2s' }} />
        <div className="bg-orb w-64 h-64 bg-gray-500 -bottom-32 left-1/3" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <Header isConnected={isConnected} />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.length === 0 ? (
                <WelcomeBanner onSuggestionClick={handleSuggestion} />
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} />
                  ))}
                  {isProcessing && <MessageBubble isTyping />}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <InputArea onSend={send} isProcessing={isProcessing} />
        </main>

        {/* Side panel */}
        <SidePanel history={history} clearHistory={clearHistory} />
      </div>
    </div>
  );
}
