/**
 * SplitPay — Main Page (Light Theme SaaS Dashboard & Landing)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { FaHome, FaFileInvoiceDollar, FaChartLine, FaCog, FaQuestionCircle, FaBell, FaBolt, FaWallet, FaLock, FaCalculator, FaGlobe, FaChartPie, FaArrowRight, FaCheck } from 'react-icons/fa';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

const WalletConnection = dynamic(() => import('@/components/WalletConnection'), { ssr: false });
const BalanceDisplay = dynamic(() => import('@/components/BalanceDisplay'), { ssr: false });
const SplitBillCalculator = dynamic(() => import('@/components/SplitBillCalculator'), { ssr: false });
const TransactionHistory = dynamic(() => import('@/components/TransactionHistory'), { ssr: false });
const CheckerGrid = dynamic(() => import('@/components/CheckerGrid'), { ssr: false });
import Logo from '@/components/Logo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [feeAmount, setFeeAmount] = useState(9.99);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  // Refs for GSAP ScrollTrigger
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (showDashboard || !containerRef.current) return;

    // We want the ScrollTrigger to animate on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=250%", // Increased to keep pinned until fully revealed
        pin: true,
        pinSpacing: true, 
        scrub: 0.5, // Reduced from 1 for faster, more responsive scrubbing in both directions
      }
    });

    // Translate the SPLITPAY background typography up
    tl.to(textRef.current, {
      y: -250,
      ease: "none",
    }, 0);

    // Right Card Fan (Receipt)
    tl.to(card1Ref.current, {
      x: 100,
      y: -30,
      rotation: 18,
      ease: "sine.inOut"
    }, 0);

    // Left Card Fan (Network Sync)
    tl.to(card2Ref.current, {
      x: -100,
      y: -20,
      rotation: -18,
      ease: "sine.inOut"
    }, 0);

  }, { dependencies: [showDashboard], scope: containerRef });

  // Restore wallet connection from localStorage on mount (stays on landing page)
  useEffect(() => {
    const savedKey = localStorage.getItem('stellar_publicKey');
    if (savedKey) {
      setPublicKey(savedKey);
      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isConnected) {
      interval = setInterval(() => {
        setFeeAmount(prev => {
          if (prev <= 0.05) {
            return 0;
          }
          return prev - (prev * 0.15 + 0.01); // exponential decay to zero
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Reset fee amount whenever it hits 0 after a delay
  useEffect(() => {
    if (feeAmount === 0) {
      const timeout = setTimeout(() => {
        setFeeAmount(9.99);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [feeAmount]);

  const handleConnect = (key: string) => {
    setPublicKey(key);
    setIsConnected(true);
    localStorage.setItem('stellar_publicKey', key);
  };

  const handleDisconnect = () => {
    setPublicKey('');
    setIsConnected(false);
    setShowDashboard(false);
    localStorage.removeItem('stellar_publicKey');
  };

  const handleLaunchDashboard = () => {
    // Kill GSAP ScrollTrigger before React re-renders to prevent DOM conflict
    // (pin reparents elements into .pin-spacer, breaking React's removeChild)
    ScrollTrigger.getAll().forEach(st => st.kill());
    setShowDashboard(true);
  };

  const handlePaymentSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ==========================================
  // DISCONNECTED: LANDING PAGE (Light/Minimal Style)
  // ==========================================
  if (!showDashboard) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pb-20 bg-grid-pattern relative">
        
        {/* Header */}
        <header className="py-6 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900">
            <Logo className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tighter">SplitPay</span>
          </div>
          <WalletConnection onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </header>

        {/* Pinned Hero Container */}
        <div ref={containerRef} className="relative w-full min-h-[100vh] flex flex-col items-center justify-center px-6 z-10 -mt-[88px]">
          
          {/* Massive Background Typography */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
            <div ref={textRef} className="font-black text-[18vw] leading-none text-slate-900/[0.03] tracking-tighter select-none whitespace-nowrap mix-blend-multiply">
              SPLITPAY
            </div>
          </div>

          {/* Central Card Stack */}
          <div className="relative z-20 w-full max-w-[320px] sm:max-w-[360px] perspective-1000 cursor-pointer mt-16">
            {/* Background Card 1 (Right Fan) - Receipt Preview */}
            <div ref={card1Ref} className="absolute inset-0 bg-white/40 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl border border-white/60 flex flex-col overflow-hidden transform rotate-6 scale-105">
              <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/30">
                <span className="text-xs font-bold text-slate-500">RECEIPT</span>
                <span className="text-xs font-bold text-slate-900">#8821</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Dinner at Noma</span>
                  <span className="font-medium">$450.00</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Wine Pairing</span>
                  <span className="font-medium">$220.00</span>
                </div>
                <div className="w-full h-px bg-slate-100 my-2" />
                <div className="flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Split (1/4)</span>
                  <span className="text-slate-900">$167.50</span>
                </div>
              </div>
            </div>

            {/* Background Card 2 (Left Fan) - Network Sync */}
            <div ref={card2Ref} className="absolute inset-0 bg-slate-50/40 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl border border-white/60 flex flex-col overflow-hidden transform -rotate-3 scale-105">
              <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/30">
                <span className="text-xs font-bold text-slate-500">STELLAR NETWORK</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="p-4 space-y-3 font-mono text-[10px] text-slate-500">
                <p>Initializing atomic path payment...</p>
                <p className="text-slate-800 font-medium">Route: XLM &rarr; USDC</p>
                <p>Splitting into 4 shards...</p>
                <div className="w-full bg-slate-200 rounded-full h-1 mt-2 overflow-hidden">
                  <div className="bg-slate-900 w-2/3 h-full rounded-full" />
                </div>
                <p className="text-right text-slate-900 font-medium">Syncing 66%</p>
              </div>
            </div>
            
            {/* Foreground Main Card */}
            <div className="relative bg-white/60 backdrop-blur-2xl text-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/80 flex flex-col overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div className="p-6 pb-0 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Split Protocol</h2>
                  <p className="text-xs text-slate-500 mt-1">Stellar - Testnet</p>
                </div>
                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.1)] text-white">
                  <FaBolt className="text-lg" />
                </div>
              </div>

              <div className="px-6 py-10 flex justify-center">
                <style>{`
                  @keyframes flowLine {
                    0% { stroke-dashoffset: 150; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { stroke-dashoffset: -150; opacity: 0; }
                  }
                  .path-flow-1 { animation: flowLine 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                  .path-flow-2 { animation: flowLine 2s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s; }
                  .path-flow-3 { animation: flowLine 2s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.2s; }
                `}</style>
                <div className="relative w-full max-w-[240px] h-28 flex items-center justify-between">
                  
                  {/* Background SVG for Paths */}
                  <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 240 112" preserveAspectRatio="none">
                    {/* Base Lines */}
                    <path d="M 56 56 C 120 56, 140 18, 200 18" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 56 56 L 200 56" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 56 56 C 120 56, 140 94, 200 94" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2" strokeLinecap="round" />
                    
                    {/* Animated Flow Lines */}
                    <path d="M 56 56 C 120 56, 140 18, 200 18" fill="none" stroke="#0f172a" strokeWidth="2" strokeDasharray="30 200" className="path-flow-1" strokeLinecap="round" />
                    <path d="M 56 56 L 200 56" fill="none" stroke="#0f172a" strokeWidth="2" strokeDasharray="30 200" className="path-flow-2" strokeLinecap="round" />
                    <path d="M 56 56 C 120 56, 140 94, 200 94" fill="none" stroke="#0f172a" strokeWidth="2" strokeDasharray="30 200" className="path-flow-3" strokeLinecap="round" />
                  </svg>

                  {/* Left: The Main Bill */}
                  <div className="relative z-10 w-14 h-14 bg-white/50 backdrop-blur-md rounded-xl border border-white/80 shadow-sm flex flex-col items-center justify-center text-slate-900 transform group-hover:scale-105 transition-transform duration-300">
                    <FaFileInvoiceDollar className="text-xl mb-0.5 text-slate-700" />
                    <span className="font-black text-[10px]">TOTAL</span>
                  </div>

                  {/* Right: The Split Shards */}
                  <div className="relative z-10 flex flex-col justify-between h-[100px]">
                    <div className="w-10 h-6 bg-white/60 backdrop-blur-md border border-white/80 group-hover:bg-white/80 text-slate-600 group-hover:text-slate-900 transition-colors rounded-md flex items-center justify-center text-[10px] font-bold shadow-sm">1/3</div>
                    <div className="w-10 h-6 bg-white/60 backdrop-blur-md border border-white/80 group-hover:bg-white/80 text-slate-600 group-hover:text-slate-900 transition-colors rounded-md flex items-center justify-center text-[10px] font-bold shadow-sm">1/3</div>
                    <div className="w-10 h-6 bg-white/60 backdrop-blur-md border border-white/80 group-hover:bg-white/80 text-slate-600 group-hover:text-slate-900 transition-colors rounded-md flex items-center justify-center text-[10px] font-bold shadow-sm">1/3</div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-3">
                {isConnected ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchDashboard();
                    }}
                    className="w-full bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 text-sm"
                  >
                    Go to Dashboard <FaArrowRight className="text-xs" />
                  </button>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const btn = document.querySelector('header button');
                      if (btn) (btn as HTMLButtonElement).click();
                    }}
                    className="w-full bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 text-sm shadow-md shadow-slate-900/10"
                  >
                    Connect Wallet <FaArrowRight className="text-xs" />
                  </button>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-white/40 backdrop-blur-md border border-white/60 text-slate-700 hover:bg-white/60 transition-colors font-semibold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  How it works
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Overlap Parallax Container */}
        <div id="features-section" className="relative z-30 bg-white border-t border-slate-100 shadow-[0_-20px_60px_rgba(0,0,0,0.03)]">
          {/* Marquee */}
          <div className="border-b border-slate-100 bg-slate-50 text-slate-400 py-3 overflow-hidden whitespace-nowrap relative z-10">
            <div className="animate-marquee inline-block">
              <span className="text-xs font-bold tracking-widest uppercase mr-10">LUMENS SETTLEMENT</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">ATOMIC PATH PAYMENTS</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">0.00001 XLM FEE</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">DISTRIBUTED LIQUIDITY</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">LUMENS SETTLEMENT</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">ATOMIC PATH PAYMENTS</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">0.00001 XLM FEE</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">DISTRIBUTED LIQUIDITY</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">LUMENS SETTLEMENT</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">ATOMIC PATH PAYMENTS</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">0.00001 XLM FEE</span>
              <span className="text-xs font-bold tracking-widest uppercase mr-10">DISTRIBUTED LIQUIDITY</span>
            </div>
          </div>

          {/* 4-Col Grid (Light Theme) */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-slate-100 relative z-10 bg-white">
            {/* Col 1 */}
            <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col gap-6">
              <span className="text-[11px] text-slate-900 font-bold tracking-wider uppercase">Visual splitting</span>
              <div className="opacity-80">
                <CheckerGrid />
              </div>
              <p className="font-playfair text-2xl max-w-sm leading-tight mt-auto pt-4 text-slate-900">
                Every bill is a container. Every participant is a shard.
              </p>
            </div>

            {/* Col 2 */}
            <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col gap-6">
              <span className="text-[11px] text-slate-900 font-bold tracking-wider uppercase">Atomic Settlement</span>
              <div className="border-b border-slate-100 pb-3 mt-4">
                <span className="text-[11px] text-slate-500 font-medium uppercase">Efficiency</span>
                <div className="font-playfair text-3xl my-1 text-slate-900">99.9%</div>
                <p className="text-[11px] text-slate-500">Guaranteed delivery of shards via Stellar Core path payments.</p>
              </div>
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] text-slate-500 font-medium uppercase">Speed</span>
                <div className="font-playfair text-3xl my-1 text-slate-900">3.2s</div>
                <p className="text-[11px] text-slate-500">Average ledger closing time for split transactions.</p>
              </div>
            </div>

            {/* Col 3 */}
            <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col gap-6">
              <span className="text-[11px] text-slate-900 font-bold tracking-wider uppercase">Network Data</span>
              <div className="font-mono text-[11px] leading-relaxed mt-4 text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="text-slate-900 font-medium">0x45...9a2</span> [SYNC]<br/>
                <span className="text-emerald-600 font-medium">PAYMENT_OP: SUCCESS</span><br/>
                MEMO_TYPE: TEXT<br/>
                MEMO: SPLIT_552<br/>
                ---<br/>
                Participants: 8<br/>
                Method: Equal_Share<br/>
                Asset: XLM / USDC
              </div>
              <div className="flex-grow"></div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase">Active Pools</span>
                <div className="font-playfair text-3xl mt-1 text-slate-900">1,402</div>
              </div>
            </div>

            {/* Col 4 */}
            <div className="p-6 md:p-10 bg-slate-50 flex flex-col gap-6 justify-center text-center">
              <FaCheck className="text-4xl text-slate-900 mx-auto mb-2" />
              <h2 className="font-playfair text-[32px] leading-none mb-2 text-slate-900">Ready to fragment?</h2>
              <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
                Launch the dapp to start splitting costs instantly.
              </p>
              <button 
                onClick={() => {
                  if (isConnected) {
                    handleLaunchDashboard();
                  } else {
                    const btn = document.querySelector('header button');
                    if (btn) (btn as HTMLButtonElement).click();
                  }
                }}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10"
              >
                {isConnected ? 'Go to Dashboard' : 'Launch Protocol'}
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ==========================================
  // CONNECTED: DASHBOARD (Sidebar + Main)
  // ==========================================
  return (
    <div className="min-h-screen bg-white bg-grid-pattern relative flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 hidden md:flex flex-col relative z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <button onClick={() => setShowDashboard(false)} className="flex items-center gap-2 text-slate-900 transition-opacity hover:opacity-80">
            <Logo className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tighter">SplitPay</span>
          </button>
        </div>

        <div className="p-4 flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">General</p>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-semibold bg-slate-100 text-black rounded-lg">
              <FaFileInvoiceDollar className="text-slate-800" /> Split Bills
            </a>
          </nav>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-8 mb-3 px-2">Settings</p>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
              <FaCog className="text-slate-400" /> Settings
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
              <FaQuestionCircle className="text-slate-400" /> Help
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 text-xs font-medium text-slate-400 text-center">
          &copy; 2026 SplitPay
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-10">
          <div className="flex-1">
            {/* Mobile Title */}
            <button onClick={() => setShowDashboard(false)} className="md:hidden flex items-center gap-2 text-slate-900 transition-opacity hover:opacity-80">
              <Logo className="w-6 h-6" />
              <span className="font-bold text-xl tracking-tighter">SplitPay</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600">
              <FaBell />
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <WalletConnection onConnect={handleConnect} onDisconnect={handleDisconnect} />
          </div>
        </header>

        {/* Dashboard Grid */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 lg:p-8 animate-fade-in relative z-0">
          <div className="max-w-6xl mx-auto">
            
            {/* Header row */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Split a new bill</h1>
              <p className="text-slate-500 text-sm">Calculate portions and send payments on the Stellar network.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Column (Form) */}
              <div className="lg:col-span-8">
                <SplitBillCalculator publicKey={publicKey} onPaymentSuccess={handlePaymentSuccess} />
              </div>

              {/* Right Column (Preview/Context) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Balance Block */}
                <div key={`balance-${refreshKey}`}>
                  <BalanceDisplay publicKey={publicKey} />
                </div>

                {/* History Block */}
                <div key={`history-${refreshKey}`}>
                  <TransactionHistory publicKey={publicKey} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
