import React from 'react'
import { useLanguage } from '@/Context/LanguageContext'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useState } from 'react'


const Actions = ({ active, onEdit, onToggleStatus, onDelete }) => {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    setOpen(true)
  }

  const handleConfirm = () => {
    onDelete?.()
    setOpen(false)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label={t('actions') || 'Actions'}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-[var(--one)] text-[var(--one)] hover:bg-[var(--one)] hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M12 4.5a.75.75 0 01.75.75v6h6a.75.75 0 010 1.5h-6v6a.75.75 0 01-1.5 0v-6h-6a.75.75 0 010-1.5h6v-6A.75.75 0 0112 4.5z" clipRule="evenodd" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-[var(--six)] border-[var(--two)]">
        <div className="flex flex-col gap-1">
          <button
            onClick={onEdit}
            className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-[var(--two)]"
          >
            {t('edit') || 'Edit'}
          </button>
          <button
            onClick={onToggleStatus}
            className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-[var(--two)]"
          >
            {active ? (t('deactivate') || 'Deactivate') : (t('activate') || 'Activate')}
          </button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setOpen(true)}
                className="w-full text-left px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10"
              >
                {t('delete') || 'Delete'}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('confirmDelete') || 'Delete this patient?'}</DialogTitle>
                <DialogDescription>{t('thisActionCannotBeUndone') || 'This action cannot be undone.'}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md border border-gray-500 text-black"
                >
                  {t('cancel') || 'Cancel'}
                </button>
                <button
                  onClick={() => { setOpen(false); onDelete?.() }}
                  className="px-4 py-2 rounded-md bg-red-600 text-white"
                >
                  {t('confirm') || 'Confirm'}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Actions