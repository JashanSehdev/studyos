import react, { useEffect } from 'react';

export default function Modal({isOpen, onClose, title, children}) {
    useEffect (() => {
        const handleKey = (e) => {
            if(e.key === 'Escape') onClose();
        }

        if(isOpen) window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    if(!isOpen) return null;

    return(
        //BackDrop
        <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{background : "rgba(0, 0, 0, 0.6)", backdropFilter: 'blur(4px)'}}
        onClick={onClose}>
            {/* ModalBox */}
            <div
            className='w-fit max-h-screen md:min-w-2xl overflow-scroll scrollbar-hide  max-h-lg rounded-2xl border border-white/10 p-6'
            style={{ background: '#1E1E2E' }}
            onClick={e => e.stopPropagation()}>
                {/* header */}
                <div className='flex items-center justify-between mb-6 gap-10'>
                    <h2
                    className='text-white font-bold text-lg'>{title}</h2>
                    <button
                    onClick={onClose}
                    className='text-gray-500 hover:text-white transition-all text-xl'>✕</button>
                </div>

                {/* Content */}
                {children}
            </div>

        </div>
    )
}