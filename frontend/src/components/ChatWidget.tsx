import { useState, useRef, useEffect } from 'react'
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { ChatBubbleLeftRightIcon as ChatSolidIcon } from '@heroicons/react/24/solid'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot' | 'agent'
  timestamp: Date
  type: 'customer-service' | 'ai-bot'
}

type ChatType = 'customer-service' | 'ai-bot'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeChat, setActiveChat] = useState<ChatType>('ai-bot')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'ai-bot'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, activeChat])

  // Filter messages by active chat type
  const filteredMessages = messages.filter(msg => msg.type === activeChat)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: activeChat
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot/agent response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: activeChat === 'ai-bot' 
          ? 'I understand your question. Let me help you with that. This is a demo response. In production, this would connect to an AI service.'
          : 'Thank you for your message. Our customer service team will respond shortly. This is a demo response.',
        sender: activeChat === 'ai-bot' ? 'bot' : 'agent',
        timestamp: new Date(),
        type: activeChat
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleChatSwitch = (chatType: ChatType) => {
    setActiveChat(chatType)
    // Add welcome message if switching to a chat with no messages
    const hasMessages = messages.some(msg => msg.type === chatType)
    if (!hasMessages) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: chatType === 'ai-bot'
          ? 'Hello! I\'m your AI assistant. How can I help you today?'
          : 'Hello! Welcome to MyGround customer service. How can we assist you?',
        sender: chatType === 'ai-bot' ? 'bot' : 'agent',
        timestamp: new Date(),
        type: chatType
      }
      setMessages(prev => [...prev, welcomeMessage])
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 flex items-center justify-center group"
          aria-label="Open chat"
        >
          <ChatSolidIcon className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <h3 className="font-semibold">Chat Support</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-primary-700 rounded transition-colors"
              aria-label="Close chat"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Type Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleChatSwitch('ai-bot')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeChat === 'ai-bot'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BoltIcon className="w-4 h-4" />
                <span>AI Assistant</span>
              </div>
            </button>
            <button
              onClick={() => handleChatSwitch('customer-service')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeChat === 'customer-service'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>Customer Service</span>
              </div>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : message.sender === 'bot'
                      ? 'bg-blue-100 text-gray-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Type your message...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {activeChat === 'ai-bot' 
                ? 'AI Assistant • Responds instantly'
                : 'Customer Service • Usually responds within minutes'}
            </p>
          </form>
        </div>
      )}
    </>
  )
}

