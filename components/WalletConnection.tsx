/**
 * WalletConnection Component — SplitPay (Light Theme)
 */

'use client';

import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaWallet, FaCopy, FaCheck, FaSignOutAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { Card, Badge, LoadingSpinner, Button } from './example-components';

interface WalletConnectionProps {
  onConnect: (publicKey: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnection({ onConnect, onDisconnect }: WalletConnectionProps) {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('stellar_publicKey');
    if (savedKey) {
      setPublicKey(savedKey);
      setIsConnected(true);
    }
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const key = await stellar.connectWallet();
      setPublicKey(key);
      setIsConnected(true);
      localStorage.setItem('stellar_publicKey', key);
      onConnect(key);
    } catch (error: any) {
      console.error('Connection error:', error);
      alert(`Failed to connect wallet:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    stellar.disconnect();
    setPublicKey('');
    setIsConnected(false);
    localStorage.removeItem('stellar_publicKey');
    onDisconnect();
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ---- Disconnected State: Just a button (used in navbar) ----
  if (!isConnected) {
    return (
      <button onClick={handleConnect} disabled={loading} className="brutalist-btn group">
        {loading ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner size="sm" /> Connecting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Connect Wallet <span className="mono transition-transform group-hover:translate-x-1">→</span>
          </span>
        )}
      </button>
    );
  }

  // ---- Connected State: Pill style ----
  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-full py-1.5 pl-2 pr-3 shadow-sm animate-fade-in gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-900">
          <FaWallet className="text-sm" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900 leading-none mb-1 hidden sm:block">Connected</span>
          <span className="text-[10px] font-mono text-slate-500 leading-none">
            {stellar.formatAddress(publicKey, 4, 4)}
          </span>
        </div>
      </div>
      
      <div className="w-px h-5 bg-slate-200" />
      
      <div className="flex items-center gap-1">
        <button
          onClick={handleCopyAddress}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          title="Copy address"
        >
          {copied ? <FaCheck className="text-emerald-500 text-xs" /> : <FaCopy className="text-xs" />}
        </button>
        <a
          href={stellar.getExplorerLink(publicKey, 'account')}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          title="View on Explorer"
        >
          <FaExternalLinkAlt className="text-xs" />
        </a>
        <button
          onClick={handleDisconnect}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors ml-1"
          title="Disconnect"
        >
          <FaSignOutAlt className="text-xs" />
        </button>
      </div>
    </div>
  );
}
