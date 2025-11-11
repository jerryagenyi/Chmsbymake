/**
 * PWAInstallPrompt - Full-page popup to install as PWA
 * Inspired by: https://uiverse.io/Yaya12085/heavy-gecko-88
 */

import React from 'react';
import { Download, X, Smartphone, Zap, Wifi, CheckCircle2 } from 'lucide-react';

interface PWAInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
}

export function PWAInstallPrompt({ isOpen, onClose, onInstall }: PWAInstallPromptProps) {
  if (!isOpen) return null;

  const features = [
    { icon: <Smartphone className="w-5 h-5" />, text: 'Install on your device' },
    { icon: <Wifi className="w-5 h-5" />, text: 'Works offline' },
    { icon: <Zap className="w-5 h-5" />, text: 'Lightning fast' },
    { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Always up-to-date' }
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-[#0A0A0F]/80 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="
          relative w-full max-w-md bg-gradient-to-br from-[#1A1A20] to-[#0A0A0F]
          rounded-3xl shadow-2xl border-2 border-[#1CE479]/30
          overflow-hidden animate-scale-in
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div 
            className="absolute -top-20 -right-20 w-60 h-60 bg-[#1CE479] rounded-full blur-3xl"
            style={{ animation: 'pulse 4s ease-in-out infinite' }}
          />
          <div 
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#FFB800] rounded-full blur-3xl"
            style={{ animation: 'pulse 4s ease-in-out 2s infinite' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#1CE479] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(28,228,121,0.4)]">
              <Download className="w-10 h-10 text-[#0A0A0F]" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Install ChurchAfrica ChMS
            </h2>
            <p className="text-muted-foreground">
              Get the full app experience on your device. No app store needed!
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-3 bg-[#1A1A20]/50 rounded-xl border border-[#2A2A35]"
              >
                <div className="text-[#1CE479]">{feature.icon}</div>
                <span className="text-sm text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={onInstall}
              className="
                w-full px-6 py-4 bg-[#1CE479] text-[#0A0A0F] rounded-xl
                font-semibold flex items-center justify-center gap-2
                hover:shadow-[0_0_30px_rgba(28,228,121,0.5)]
                hover:scale-105 active:scale-95
                transition-all duration-300
              "
            >
              <Download className="w-5 h-5" />
              Install Now
            </button>
            
            <button
              onClick={onClose}
              className="
                w-full px-6 py-3 text-muted-foreground
                hover:text-foreground transition-colors
              "
            >
              Maybe Later
            </button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-center text-muted-foreground">
            Free • No registration required • Works on all devices
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
