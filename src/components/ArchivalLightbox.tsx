/**
 * ARCHIVE — Archival Fullscreen Lightbox & Panning Viewer
 * Enables full-screen museum inspection, smooth zooming, and drag-to-pan exploration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  X, 
  Maximize2, 
  Move,
  Info
} from 'lucide-react';
import { 
  clampZoom, 
  zoomIn, 
  zoomOut, 
  calculatePanBounds, 
  Point, 
  MIN_ZOOM, 
  MAX_ZOOM 
} from '../utils/lightboxMath';

export interface LightboxPhoto {
  src: string;
  alt: string;
  title: string;
  accession?: string;
  credit?: string;
  location?: string;
  date?: string;
}

interface ArchivalLightboxProps {
  photo: LightboxPhoto | null;
  onClose: () => void;
}

export const ArchivalLightbox: React.FC<ArchivalLightboxProps> = ({ photo, onClose }) => {
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset view state whenever a new photo opens
  useEffect(() => {
    if (photo) {
      setZoom(1.0);
      setPan({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [photo]);

  // Keyboard navigation (+, -, 0, Escape, Arrow keys)
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom(prev => zoomIn(prev));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoom(prev => {
          const next = zoomOut(prev);
          if (next <= 1.0) setPan({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        e.preventDefault();
        setZoom(1.0);
        setPan({ x: 0, y: 0 });
      } else if (e.key === 'ArrowLeft') {
        setPan(prev => ({ ...prev, x: prev.x + 40 }));
      } else if (e.key === 'ArrowRight') {
        setPan(prev => ({ ...prev, x: prev.x - 40 }));
      } else if (e.key === 'ArrowUp') {
        setPan(prev => ({ ...prev, y: prev.y + 40 }));
      } else if (e.key === 'ArrowDown') {
        setPan(prev => ({ ...prev, y: prev.y - 40 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom(prev => zoomIn(prev));
    } else {
      setZoom(prev => {
        const next = zoomOut(prev);
        if (next <= 1.0) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  }, []);

  // Mouse drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };

    if (containerRef.current) {
      const bounds = calculatePanBounds(
        newPan, 
        zoom, 
        containerRef.current.clientWidth, 
        containerRef.current.clientHeight
      );
      setPan(bounds);
    } else {
      setPan(newPan);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newPan = {
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    };

    if (containerRef.current) {
      const bounds = calculatePanBounds(
        newPan, 
        zoom, 
        containerRef.current.clientWidth, 
        containerRef.current.clientHeight
      );
      setPan(bounds);
    } else {
      setPan(newPan);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  if (!photo) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] bg-[#171513]/95 backdrop-blur-md flex flex-col justify-between overflow-hidden select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`Archival photo viewer: ${photo.title}`}
    >
      {/* Lightbox Top Control Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#292723]/80 border-b border-[#F7F4EC]/10 text-[#F7F4EC] z-10">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[#873E32] font-semibold bg-[#873E32]/20 px-2 py-0.5 rounded">
            {photo.accession || 'PLATE INSPECTION'}
          </span>
          <span className="hidden sm:inline text-[#E8E1D2]/70 font-sans font-medium text-sm truncate max-w-[400px]">
            {photo.title}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#171513]/60 border border-[#F7F4EC]/15 rounded p-1">
            <button 
              onClick={() => setZoom(prev => zoomOut(prev))}
              disabled={zoom <= MIN_ZOOM}
              className="p-1.5 text-[#F7F4EC] hover:bg-[#F7F4EC]/10 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Zoom out (-)"
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="font-mono text-xs px-2 min-w-[48px] text-center text-[#E8E1D2]">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={() => setZoom(prev => zoomIn(prev))}
              disabled={zoom >= MAX_ZOOM}
              className="p-1.5 text-[#F7F4EC] hover:bg-[#F7F4EC]/10 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Zoom in (+)"
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <button 
              onClick={handleReset}
              className="p-1.5 text-[#F7F4EC] hover:bg-[#F7F4EC]/10 rounded transition-colors cursor-pointer ml-1"
              title="Reset view (0)"
              aria-label="Reset zoom and position"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Toggle info bar */}
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded border border-[#F7F4EC]/15 transition-colors cursor-pointer ${showInfo ? 'bg-[#873E32] text-white' : 'hover:bg-[#F7F4EC]/10 text-[#F7F4EC]'}`}
            title="Toggle provenance details"
            aria-label="Toggle image information"
          >
            <Info size={16} />
          </button>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#873E32] hover:bg-[#6e3025] text-white font-mono text-xs transition-colors cursor-pointer ml-2"
            title="Close viewer (ESC)"
            aria-label="Close photo viewer"
          >
            <X size={16} />
            <span className="hidden sm:inline">Close [ESC]</span>
          </button>
        </div>
      </div>

      {/* Main Pan/Zoom Canvas */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative flex-1 flex items-center justify-center p-4 overflow-hidden ${
          zoom > 1.0 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
      >
        <div 
          className="relative transition-transform duration-75 ease-out will-change-transform max-w-full max-h-full flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <img 
            src={photo.src} 
            alt={photo.alt}
            draggable={false}
            className="max-h-[76vh] max-w-[88vw] object-contain shadow-2xl border border-[#F7F4EC]/20 rounded-sm pointer-events-none"
          />
        </div>

        {/* Panning indicator cue when zoomed */}
        {zoom > 1.0 && (
          <div className="absolute top-4 left-6 pointer-events-none bg-[#292723]/75 border border-[#F7F4EC]/15 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-mono text-[#E8E1D2]/80 backdrop-blur-sm">
            <Move size={13} className="text-[#873E32]" />
            <span>Click &amp; drag to pan across high-res print</span>
          </div>
        )}
      </div>

      {/* Lightbox Bottom Provenance Info Bar */}
      {showInfo && (
        <div className="bg-[#292723]/90 border-t border-[#F7F4EC]/10 px-6 py-3.5 text-[#E8E1D2] flex flex-wrap justify-between items-center gap-4 z-10 backdrop-blur-sm">
          <div className="max-w-2xl">
            <h4 className="font-serif text-base font-bold text-white mb-0.5">
              {photo.title}
            </h4>
            <p className="text-xs text-[#E8E1D2]/80 leading-normal line-clamp-2">
              {photo.alt}
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-[#E8E1D2]/70">
            {photo.location && (
              <div>
                <span className="text-[#873E32]">LOC:</span> {photo.location}
              </div>
            )}
            {photo.date && (
              <div>
                <span className="text-[#873E32]">DATE:</span> {photo.date}
              </div>
            )}
            {photo.credit && (
              <div className="hidden md:block">
                <span className="text-[#873E32]">SOURCE:</span> {photo.credit}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
