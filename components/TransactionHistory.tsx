/**
 * TransactionHistory Component — SplitPay (Light Theme)
 */

'use client';

import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaSync, FaArrowUp, FaArrowDown, FaExternalLinkAlt } from 'react-icons/fa';
import { Card, EmptyState, IconButton, Skeleton } from './example-components';

interface Transaction {
  id: string;
  type: string;
  amount?: string;
  asset?: string;
  from?: string;
  to?: string;
  createdAt: string;
  hash: string;
}

interface TransactionHistoryProps {
  publicKey: string;
}

export default function TransactionHistory({ publicKey }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
      const txs = await stellar.getRecentTransactions(publicKey, 8);
      setTransactions(txs);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchTransactions();
    }
  }, [publicKey]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOutgoing = (tx: Transaction): boolean => {
    return tx.from === publicKey;
  };

  if (loading) {
    return (
      <Card title="Recent Transactions" className="animate-fade-in-up delay-300">
        <div className="space-y-4 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className="h-10 w-10" variant="circle" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in-up delay-300 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
        <IconButton
          onClick={fetchTransactions}
          tooltip="Refresh"
          disabled={refreshing}
        >
          <FaSync className={`text-xs ${refreshing ? 'animate-spin text-slate-800' : ''}`} />
        </IconButton>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No Transactions"
          description="Your payment history will appear here."
        />
      ) : (
        <div className="space-y-0">
          {transactions.map((tx, idx) => {
            const outgoing = isOutgoing(tx);
            
            return (
              <div
                key={tx.id}
                className="group flex flex-wrap items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-colors gap-y-2"
              >
                <div className="flex items-center gap-4 mb-2 sm:mb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    outgoing ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {outgoing ? <FaArrowUp className="text-sm" /> : <FaArrowDown className="text-sm" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-900 font-bold text-xs truncate">
                      {outgoing ? 'Payment Sent' : 'Payment Received'}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-0.5">
                      <span className="whitespace-nowrap">{formatDate(tx.createdAt)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="font-mono truncate">{stellar.formatAddress((outgoing ? tx.to : tx.from) || '', 4, 4)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-1.5 ml-12 sm:ml-0 flex-1 min-w-[120px]">
                  {tx.amount && (
                    <div className={`flex items-baseline gap-1 ${outgoing ? 'text-red-500' : 'text-emerald-500'}`}>
                      <span className="font-bold text-right tabular-nums w-[60px]">
                        {outgoing ? '-' : '+'}{parseFloat(tx.amount).toFixed(2)}
                      </span>
                      <span className="font-bold text-xs text-left w-[32px]">
                        {tx.asset || 'XLM'}
                      </span>
                    </div>
                  )}
                  <div className="w-5 flex justify-end">
                    <a
                      href={stellar.getExplorerLink(tx.hash, 'tx')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-900 transition-all"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
