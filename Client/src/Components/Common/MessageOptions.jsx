import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit2, Trash2 } from 'lucide-react'

const MessageOptions = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full hover:bg-black/10 text-white/70 hover:text-white transition-colors"
            >
                <MoreVertical size={14} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
                    <button
                        onClick={() => {
                            onEdit()
                            setIsOpen(false)
                        }}
                        className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                    >
                        <Edit2 size={12} className="mr-2" />
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            onDelete()
                            setIsOpen(false)
                        }}
                        className="flex items-center w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={12} className="mr-2" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

export default MessageOptions
