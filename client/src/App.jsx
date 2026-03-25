import { useCallback, useState } from 'react';
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

  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  const handleSuggestion = useCallback((text) => {
    send(text);
  }, [send]);

  return (
    <div className="h-screen flex flex-col bg-gray-950 relative overflow-hidden">
      {/* Animated BG orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="bg-orb w-48 h-48 md:w-96 md:h-96 bg-cyan-500 -top-24 -left-24 md:-top-48 md:-left-48" />
        <div className="bg-orb w-40 h-40 md:w-80 md:h-80 bg-teal-500 top-1/2 -right-20 md:-right-40" style={{ animationDelay: '2s' }} />
        <div className="bg-orb w-32 h-32 md:w-64 md:h-64 bg-gray-500 -bottom-16 left-1/3 md:-bottom-32" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <Header isConnected={isConnected} onToggleSidePanel={() => setSidePanelOpen(!sidePanelOpen)} />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 md:py-6">
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

        {/* Side panel - hidden on mobile, overlay when toggled */}
        <SidePanel
          history={history}
          clearHistory={clearHistory}
          isOpen={sidePanelOpen}
          onClose={() => setSidePanelOpen(false)}
        />
      </div>
    </div>
  );
}
