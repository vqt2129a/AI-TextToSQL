import { useState, useCallback, useRef, useEffect } from 'react';
import { sendQuery, getStatus } from '../utils/api';

const MAX_CONTEXT = 10;
const STORAGE_KEY = 'ai_tracuu_history';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const messagesEndRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-30)));
  }, [history]);

  // Health check
  useEffect(() => {
    const check = async () => {
      try {
        const data = await getStatus();
        setIsConnected(data.status === 'online');
      } catch {
        setIsConnected(false);
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const send = useCallback(async (question) => {
    if (!question.trim() || isProcessing) return;

    // Add user message
    const userMsg = { id: Date.now(), role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const data = await sendQuery(question, chatHistory.slice(-MAX_CONTEXT));

      if (!data.success) {
        throw new Error(data.error || 'Truy vấn thất bại');
      }

      // Save to chat context
      setChatHistory(prev => [...prev, { role: 'user', content: question }]);

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        type: data.response_type,
        message: data.message || '',
        sql: data.sql_query,
        result: data.result,
        time: data.execution_time,
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Save context
      let contextContent = data.message || '';
      if (data.sql_query) contextContent += `\nSQL: ${data.sql_query}`;
      if (Array.isArray(data.result)) contextContent += `\nKết quả: ${data.result.length} dòng`;
      setChatHistory(prev => [...prev, { role: 'assistant', content: contextContent.trim() }]);

      // Save to history
      setHistory(prev => [{
        question,
        sql: data.sql_query,
        resultCount: Array.isArray(data.result) ? data.result.length : null,
        time: data.execution_time,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      }, ...prev].slice(0, 30));

    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'error',
        content: err.response?.data?.error || err.message,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, chatHistory]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setChatHistory([]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages, isProcessing, isConnected, history,
    send, clearMessages, clearHistory, messagesEndRef,
  };
}
