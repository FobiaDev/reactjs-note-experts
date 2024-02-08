import * as Dialog from "@radix-ui/react-dialog"

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from "date-fns/locale"

import { Modal } from "./modal"

interface NoteCardProps {
  id: string
  date: Date
  content: string
  onNoteDeleted: (id: string) => void
}

export const NoteCard = ({ id, date, content, onNoteDeleted }: NoteCardProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-slate-300'>
          {formatDistanceToNow(date, { locale: ptBR, addSuffix: true })}
        </span>
        <p className='text-sm leading-6 text-slate-400'>{content}</p>

        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
      </Dialog.Trigger>

      <Modal>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <span className='text-sm font-medium text-slate-300'>
            {formatDistanceToNow(date, { locale: ptBR, addSuffix: true })}
          </span>

          <p className='text-sm leading-6 text-slate-400'>{content}</p>
        </div>

        <button
          type="button"
          onClick={() => onNoteDeleted(id)}
          className="group w-full bg-slate-800 py-4 text-center text-sm text-slate-300 font-medium outline-none"
        >
          Deseja <span className="text-red-400 group-hover:underline">apagar essa nota</span>?
        </button>
      </Modal>

    </Dialog.Root>
  )
}