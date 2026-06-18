/**
 * SplitBillCalculator Component — SplitPay (Light Theme SaaS Form)
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaTrashAlt, FaPlus, FaCheckCircle, FaSpinner, FaLock } from 'react-icons/fa';
import { Card, Input, Button, Alert, Modal, Badge } from './example-components';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// 2. Fluid Number Ticking Component
function AnimatedNumber({ value }: { value: number }) {
  const numRef = useRef<HTMLSpanElement>(null);
  
  useGSAP(() => {
    if (!numRef.current) return;
    const obj = { val: parseFloat(numRef.current.innerText) || 0 };
    gsap.to(obj, {
      val: value,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        if (numRef.current) {
          let formatted = obj.val.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
          if (formatted === '') formatted = '0';
          numRef.current.innerText = formatted;
        }
      }
    });
  }, [value]);

  return <span ref={numRef}>0</span>;
}

interface Person {
  id: string;
  name: string;
  address: string;
  status: 'pending' | 'sending' | 'sent' | 'error';
  txHash?: string;
  error?: string;
  isNew?: boolean;
  isRemoving?: boolean;
}

interface SplitBillCalculatorProps {
  publicKey: string;
  onPaymentSuccess?: () => void;
}

const TIP_OPTIONS = [0, 10, 15, 20];

export default function SplitBillCalculator({ publicKey, onPaymentSuccess }: SplitBillCalculatorProps) {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState<Person[]>([
    { id: crypto.randomUUID(), name: '', address: '', status: 'pending' },
  ]);
  const [globalAlert, setGlobalAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Calculations
  const bill = parseFloat(billAmount) || 0;
  const tipAmount = bill * (tipPercent / 100);
  const total = bill + tipAmount;
  const validPeopleCount = people.filter((p) => p.name.trim() && p.address.trim() && !p.isRemoving).length;
  const perPerson = validPeopleCount > 0 ? total / validPeopleCount : 0;
  
  // For sending, we use the active ones
  const activePeople = people.filter(p => !p.isRemoving);
  const validActivePeople = activePeople.filter(p => p.name.trim() && p.address.trim());

  const addPerson = () => {
    // 3. Tactile Row Management (Add)
    setPeople([...people, { id: crypto.randomUUID(), name: '', address: '', status: 'pending', isNew: true }]);
  };

  const removePerson = (id: string) => {
    // 3. Tactile Row Management (Remove)
    if (activePeople.length > 1) {
      setPeople(people.map(p => p.id === id ? { ...p, isRemoving: true } : p));
      setTimeout(() => {
        setPeople(current => current.filter(p => p.id !== id));
      }, 300);
    }
  };

  const updatePerson = (id: string, field: 'name' | 'address', value: string) => {
    setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value, isNew: false } : p)));
  };

  const handleSend = async () => {
    if (bill <= 0) {
      setGlobalAlert({ type: 'error', message: 'Enter a valid bill amount.' });
      return;
    }
    if (validActivePeople.length === 0) {
      setGlobalAlert({ type: 'error', message: 'Add at least one person with a valid address.' });
      return;
    }

    setGlobalAlert(null);
    setIsSending(true);

    let allSuccess = true;
    const perPersonFormatted = perPerson.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');

    for (const person of validActivePeople) {
      if (person.status === 'sent') continue;

      setPeople((prev) => prev.map((p) => p.id === person.id ? { ...p, status: 'sending', isNew: false } : p));
      
      try {
        const result = await stellar.sendPayment({
          from: publicKey,
          to: person.address.trim(),
          amount: perPersonFormatted,
          memo: `SplitPay: ${person.name}`,
        });
        
        if (result.success) {
          // 5. Success Stamping handled by status 'sent' -> animate-flash-emerald
          setPeople((prev) => prev.map((p) => p.id === person.id ? { ...p, status: 'sent', txHash: result.hash } : p));
          onPaymentSuccess?.();
        } else {
          allSuccess = false;
        }
      } catch (e: any) {
        allSuccess = false;
        setPeople((prev) => prev.map((p) => p.id === person.id ? { ...p, status: 'error', error: e.message } : p));
      }
    }

    setIsSending(false);
    if (allSuccess) {
      setGlobalAlert({ type: 'success', message: 'All payments sent successfully!' });
    }
  };

  const allSent = validActivePeople.length > 0 && validActivePeople.every(p => p.status === 'sent');

  return (
    <Card title="Add New Split Bill" className="animate-fade-in-up delay-200">
      {globalAlert && (
        <div className="mb-6">
          <Alert type={globalAlert.type} message={globalAlert.message} onClose={() => setGlobalAlert(null)} />
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Input
            label="Bill Total*"
            type="number"
            placeholder="0.00"
            value={billAmount}
            onChange={setBillAmount}
            suffix={<span className="text-slate-500 font-semibold">XLM</span>}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tip Percentage</label>
          <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
            {TIP_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTipPercent(t)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all active:scale-90 ${
                  tipPercent === t ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* People List */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Split Between</h3>
        
        <div className="space-y-2">
          {people.map((person, idx) => {
            // 6. Valid Address Feedback
            const isValidAddress = person.address.trim().length === 56 && person.address.trim().startsWith('G');
            
            return (
              <div 
                key={person.id} 
                className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center p-2 -mx-2 rounded-lg transition-colors
                  ${person.isNew ? 'animate-row-add' : ''}
                  ${person.isRemoving ? 'animate-row-remove' : ''}
                  ${person.status === 'sent' ? 'animate-flash-emerald' : ''}
                `}
              >
                <div className="w-full sm:w-1/3">
                  <Input
                    label=""
                    placeholder="Name (e.g. Jason)"
                    value={person.name}
                    onChange={(val) => updatePerson(person.id, 'name', val)}
                    disabled={person.status === 'sent' || person.status === 'sending'}
                  />
                </div>
                <div className="w-full sm:flex-1 flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Input
                      label=""
                      placeholder="Stellar Address (G...)"
                      value={person.address}
                      onChange={(val) => updatePerson(person.id, 'address', val)}
                      disabled={person.status === 'sent' || person.status === 'sending'}
                      className={`w-full transition-all duration-300 ${isValidAddress && person.status !== 'sent' ? 'border-slate-900 ring-1 ring-slate-900 shadow-[0_0_10px_rgba(15,23,42,0.1)]' : ''}`}
                    />
                    {isValidAddress && person.status === 'pending' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 animate-fade-in">
                        <FaLock className="text-xs" />
                      </div>
                    )}
                  </div>
                  
                  {/* Status or Delete */}
                  <div className="w-10 flex justify-center">
                    {person.status === 'sending' ? (
                      <div className="relative">
                        <div className="absolute inset-0 border-2 border-slate-900/20 rounded-full animate-ping"></div>
                        <FaSpinner className="animate-spin text-slate-900 relative z-10" />
                      </div>
                    ) : person.status === 'sent' ? (
                      <FaCheckCircle className="text-emerald-500 text-xl animate-stamp" title="Sent!" />
                    ) : activePeople.length > 1 ? (
                      <button
                        onClick={() => removePerson(person.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:scale-110 active:scale-95"
                      >
                        <FaTrashAlt />
                      </button>
                    ) : null}
                  </div>
                </div>
                {person.error && (
                  <p className="w-full text-xs text-red-500 mt-1 sm:hidden">{person.error}</p>
                )}
              </div>
            );
          })}
        </div>

        {!allSent && (
          <button
            onClick={addPerson}
            className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-all hover:translate-y-[1px] active:scale-95"
          >
            <FaPlus className="text-xs" /> Add Person
          </button>
        )}
      </div>

      {/* Divider */}
      <hr className="border-slate-100 my-6" />

      {/* Summary Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {validActivePeople.length > 0 && bill > 0 ? (
            <p className="text-sm text-slate-500">
              Total {total.toFixed(2)} XLM divided by {validActivePeople.length} = <br/>
              <span className="text-xl font-black text-slate-900">
                <AnimatedNumber value={perPerson} /> XLM
              </span> per person
            </p>
          ) : (
            <p className="text-sm text-slate-400">Enter bill and addresses to calculate</p>
          )}
        </div>
        
        {!allSent ? (
          <Button
            onClick={handleSend}
            disabled={isSending || bill <= 0 || validActivePeople.length === 0}
            size="lg"
            className="w-full sm:w-auto px-10 relative overflow-hidden group"
          >
            {/* Sharding/Fracture Send Animation Effect via CSS pseudo-elements */}
            <div className={`absolute inset-0 bg-white/20 translate-y-full transition-transform duration-500 ${isSending ? 'translate-y-0' : 'group-hover:translate-y-[80%]'}`}></div>
            <span className="relative z-10">{isSending ? 'Processing...' : 'Send Payments'}</span>
          </Button>
        ) : (
          <Button onClick={() => window.location.reload()} variant="secondary" size="lg">
            Split Another Bill
          </Button>
        )}
      </div>
    </Card>
  );
}
