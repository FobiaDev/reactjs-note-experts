import { ChangeEvent, FormEvent, useState } from "react"

import * as Dialog from "@radix-ui/react-dialog"

import { Modal } from "./modal"

import { toast } from "sonner"

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export const NewNoteCard = ({ onNoteCreated }: NewNoteCardProps) => {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState<boolean>(true)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')

  const handleStartEditor = () => {
    setShouldShowOnBoarding(false)
  }

  const handleContentChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)

    if (event.target.value === '') setShouldShowOnBoarding(true)
  }

  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault()

    onNoteCreated(content)

    if (content === '') { return }

    setContent('')
    setShouldShowOnBoarding(true)

    toast.success('Nota criada com sucesso!')
  }

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error('Infelizmente seu navegador não suporta a API de gravação.')
      return
    }

    setIsRecording(true)
    setShouldShowOnBoarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      toast.error(event.error)
    }

    speechRecognition.start()
  }

  const handleStopRecording = () => {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-700 p-5 space-y-3 outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>
        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Modal>
        <form className="flex-1 flex flex-col">
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className='text-sm font-medium text-slate-300'>
              Adicionar nota
            </span>

            {shouldShowOnBoarding ? (
              <p className='text-sm leading-6 text-slate-400'>
                Comece <button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota em áudio</button> ou se preferir <button type="button" onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">utilize apenas texto</button>.
              </p>
            ) : (
              <textarea
                autoFocus
                onChange={handleContentChanged}
                value={content}
                className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
              />
            )}
          </div>

          {isRecording ? (
            <button
              type="button"
              onClick={handleStopRecording}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 font-medium outline-none hover:text-slate-100"
            >
              <div className="size-3 rounded-full bg-red-500 animate-pulse" />
              Gravando! (clique p/ interromper)
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveNote}
              className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 font-medium outline-none hover:bg-lime-500"
            >
              Salvar nota
            </button>
          )}
        </form>
      </Modal>
    </Dialog.Root>
  )
}