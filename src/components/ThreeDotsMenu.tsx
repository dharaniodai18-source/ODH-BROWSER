import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, Share2, Edit3, ExternalLink } from 'lucide-react';
import { DownloadItem } from '../types';

interface ThreeDotsMenuProps {
  item: DownloadItem;
  onDelete: (id: string) => void;
  onShare: (item: DownloadItem) => void;
  onRename: (item: DownloadItem) => void;
  onOpenWith: (item: DownloadItem) => void;
}

export const ThreeDotsMenu: React.FC<ThreeDotsMenuProps> = ({
  item,
  onDelete,
  onShare,
  onRename,
  onOpenWith,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-[#1a2236] transition cursor-pointer active:scale-95"
        title="Settings (Delete, Share, Rename, Open with)"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[#0f1422] border border-cyan-500/30 shadow-2xl shadow-black/80 z-50 py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          {/* Delete */}
          <button
            onClick={() => {
              setIsOpen(false);
              onDelete(item.id);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition text-left cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              setIsOpen(false);
              onShare(item);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition text-left cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Share</span>
          </button>

          {/* Rename */}
          <button
            onClick={() => {
              setIsOpen(false);
              onRename(item);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition text-left cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Rename</span>
          </button>

          {/* Open with */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenWith(item);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition text-left cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open with</span>
          </button>
        </div>
      )}
    </div>
  );
};
