import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMessagesBetweenUsers, sendMessage, addLocalMessage, markMessagesRead, updateLocalMessage } from '@/Stores/messageSlice'
import { io } from 'socket.io-client'
import { Check, CheckCheck, X } from 'lucide-react'
import MessageOptions from '../Common/MessageOptions'
import { handleDelete, handleEdit, submitEdit } from '@/Lib/MessageActions'

// Singleton socket connection
let socket
const getSocket = (token) => {
    if (!socket) {
        socket = io('http://localhost:5000', {
            auth: { token },
            withCredentials: true
        })
    }
    return socket
}

const ChatField = ({ user }) => {
    const dispatch = useDispatch()
    const { currentUser } = useSelector(s => s.auth)
    const { messages, loading } = useSelector(s => s.messages)
    const [text, setText] = useState('')
    const [editingMessage, setEditingMessage] = useState(null)
    const endRef = useRef(null)

    // Setup socket and listeners
    useEffect(() => {
        if (!currentUser) return
        const token = localStorage.getItem('token')
        const sock = getSocket(token)

        sock.on('new_message', (msg) => {
            // Only add if relevant to this chat
            const senderId = msg.sender?._id || msg.sender
            const receiverId = msg.receiver?._id || msg.receiver

            if (
                (senderId === user._id && receiverId === currentUser.id) ||
                (senderId === currentUser.id && receiverId === user._id)
            ) {
                dispatch(addLocalMessage(msg))
                // If we receive a message from the active user, mark it as read immediately
                if (senderId === user._id) {
                    dispatch(markMessagesRead({ from: user._id }))
                }
            }
        })

        sock.on('message_updated', (msg) => {
            dispatch(updateLocalMessage(msg))
        })

        sock.on('messages_read', (data) => {
            if (data.fromUser === currentUser.id || data.conversationId) {
                dispatch(markMessagesRead({ from: currentUser.id, isReadReceipt: true }))
            }
        })

        return () => {
            sock.off('new_message')
            sock.off('message_updated')
            sock.off('messages_read')
        }
    }, [user, currentUser, dispatch])

    // Fetch messages when user changes
    useEffect(() => {
        if (user && user._id && currentUser?.id) {
            dispatch(fetchMessagesBetweenUsers({ userA: currentUser.id, userB: user._id }))
            // Mark messages as read when opening chat
            dispatch(markMessagesRead({ from: user._id }))
            setEditingMessage(null)
            setText('')
        }
    }, [user, currentUser, dispatch])

    useEffect(() => {
        if (editingMessage) {
            setText(editingMessage.content)
        } else {
            setText('')
        }
    }, [editingMessage])

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const onSend = () => {
        const msg = text.trim()
        if (!msg) return

        if (editingMessage) {
            submitEdit(dispatch, editingMessage._id, msg, setEditingMessage)
        } else {
            if (!user?._id) return
            dispatch(sendMessage({ receiver: user._id, content: msg }))
        }
        setText('')
    }

    return (
        <div className="flex flex-col h-[70vh]">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loading && <div className="text-gray-300">Loading...</div>}
                {messages.map(m => (
                    <div key={m._id || m.id} className={`max-w-[75%] px-3 py-2 rounded-md group relative ${m.sender?._id === currentUser.id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-700 text-white'}`}>
                        <div className="text-sm break-words">{m.content || m.text}</div>
                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${m.sender?._id === currentUser.id ? 'text-blue-200' : 'text-gray-400'}`}>
                            <span>{new Date(m.createdAt || m.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {m.sender?._id === currentUser.id && (
                                m.status === 'read' ? <CheckCheck size={12} className="text-white" /> : <Check size={12} className="text-white" />
                            )}
                        </div>
                        {m.sender?._id === currentUser.id && (
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MessageOptions
                                    onEdit={() => handleEdit(setEditingMessage, m)}
                                    onDelete={() => handleDelete(dispatch, m._id)}
                                />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={endRef} />
            </div>
            <div className="p-3 border-t border-[var(--four)] flex gap-2 items-center">
                {editingMessage && (
                    <button onClick={() => setEditingMessage(null)} className="text-red-500 hover:bg-red-100 p-2 rounded-full">
                        <X size={20} />
                    </button>
                )}
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend() } }}
                    placeholder={editingMessage ? 'Edit message...' : (user ? 'Type a message...' : 'Select a user to start chatting')}
                    className="flex-1 bg-transparent border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
                />
                <button onClick={onSend} disabled={(!user && !editingMessage) || !text.trim()} className="px-4 py-2 rounded-md bg-[var(--one)] text-black disabled:opacity-50">
                    {editingMessage ? 'Update' : 'Send'}
                </button>
            </div>
        </div>
    )
}

export default ChatField