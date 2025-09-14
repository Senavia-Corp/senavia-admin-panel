interface PopupProps {
  type: 'success' | 'error';
  title?: string;
  message: string;
  isOpen: boolean;
}

export function CardMokcup({ type, title, message, isOpen }: PopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className={`bg-white rounded-lg p-8 z-10 text-center ${
        type === 'success' ? 'border-2 border-[#99CC33]' : 'border-2 border-red-500'
      }`}>
        <h3 className={`text-2xl font-bold mb-4 ${
          type === 'success' ? 'text-[#04081E]' : 'text-red-500'
        }`}>
          {title || (type === 'success' ? '¡Success!' : '¡Error!')}
        </h3>
        <p className="text-lg text-[#393939]">{message}</p>
      </div>
    </div>
  );
}
