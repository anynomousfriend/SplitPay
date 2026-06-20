/**
 * BalanceDisplay Component — SplitPay (Light Theme)
 */

'use client';

import { useState, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';
import { Card, Skeleton, IconButton } from './example-components';

interface BalanceDisplayProps {
  publicKey: string;
  getBalance: (publicKey: string) => Promise<{ xlm: string; assets: Array<{ code: string; issuer: string; balance: string }> }>;
  formatAddress: (address: string, start?: number, end?: number) => string;
}

export default function BalanceDisplay({ publicKey, getBalance, formatAddress }: BalanceDisplayProps) {
  const [balance, setBalance] = useState<string>('0');
  const [assets, setAssets] = useState<Array<{ code: string; issuer: string; balance: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalance = async () => {
    try {
      setRefreshing(true);
      const balanceData = await getBalance(publicKey);
      setBalance(balanceData.xlm);
      setAssets(balanceData.assets);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey]);

  const formatBalance = (balance: string): string => {
    const num = parseFloat(balance);
    if (num >= 1000000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-4 w-24" />
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in-up delay-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Available Balance
        </h2>
        <IconButton
          onClick={fetchBalance}
          tooltip="Refresh balance"
          disabled={refreshing}
        >
          <FaSync className={`text-xs ${refreshing ? 'animate-spin text-slate-800' : ''}`} />
        </IconButton>
      </div>

      <div className="flex flex-wrap items-baseline gap-2 mb-1 w-full overflow-hidden">
        <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight break-all">
          {formatBalance(balance)}
        </p>
        <p className="text-xl font-bold text-slate-400 shrink-0">XLM</p>
      </div>
      <p className="text-slate-400 text-sm font-medium">≈ ${(parseFloat(balance) * 0.12).toFixed(2)} USD</p>

      {/* Other Assets */}
      {assets.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
          {assets.map((asset, index) => (
            <div
              key={index}
              className="flex justify-between items-center"
            >
              <div>
                <p className="text-slate-800 font-bold text-sm">{asset.code}</p>
                <p className="text-slate-400 text-xs font-mono">{formatAddress(asset.issuer, 4, 4)}</p>
              </div>
              <p className="text-slate-900 font-bold text-sm">{formatBalance(asset.balance)}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
