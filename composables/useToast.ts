export type ToastKind = 'success' | 'error' | 'info' | 'warning'
export type ToastItem = { id: number; message: string; kind: ToastKind }

export const useToast = () => {
  const items = useState<ToastItem[]>('app-toasts', () => [])
  const show = (message: string, kind: ToastKind = 'info', duration = 4000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    items.value.push({ id, message, kind })
    if (process.client) window.setTimeout(() => dismiss(id), duration)
  }
  const dismiss = (id: number) => { items.value = items.value.filter(item => item.id !== id) }
  return {
    items, dismiss, show,
    success: (message: string) => show(message, 'success'),
    error: (message: string) => show(message, 'error', 6000),
    warning: (message: string) => show(message, 'warning', 5000),
  }
}
