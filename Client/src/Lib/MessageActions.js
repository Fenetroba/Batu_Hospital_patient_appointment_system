import { deleteMessage, editMessage } from '@/Stores/messageSlice'

export const handleDelete = (dispatch, messageId) => {
    if (confirm('Are you sure you want to delete this message?')) {
        dispatch(deleteMessage(messageId))
    }
}

export const handleEdit = (setEditingMessage, message) => {
    setEditingMessage(message)
}

export const submitEdit = (dispatch, messageId, content, setEditingMessage) => {
    dispatch(editMessage({ id: messageId, content }))
    setEditingMessage(null)
}
