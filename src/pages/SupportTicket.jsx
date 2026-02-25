import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ticketsAPI } from '../lib/api';

export const SupportTicket = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = useMemo(() => searchParams.get('email') || '', [searchParams]);

  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState('');
  const [proof, setProof] = useState(null);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (!email.trim() || !message.trim()) {
      setStatus({ type: 'error', message: 'Please provide email and explanation.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await ticketsAPI.create({ email: email.trim(), message: message.trim(), proof });
      setStatus({ type: 'success', message: 'Ticket submitted. Admin will review it.' });
      setMessage('');
      setProof(null);
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Failed to submit ticket.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-pattern">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl p-8">
          <h1 className="mb-2">Support Ticket</h1>
          <p className="text-deep-terracotta/60 dark:text-warm-ivory/60 mb-6">
            If your account is blocked, you can request an unblock review.
          </p>

          {status.type !== 'idle' && (
            <div
              className={`p-4 rounded-lg border mb-6 ${
                status.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <p className="text-sm">{status.message}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email Address *</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                placeholder="Enter your blocked account email"
                type="email"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Explanation *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                placeholder="Explain why your account should be unblocked..."
                rows={5}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Upload Proof (optional)</label>
              <div className="relative">
                <input
                  type="file"
                  id="proof-upload"
                  onChange={(e) => setProof(e.target.files?.[0] || null)}
                  className="hidden"
                  accept="image/*,.pdf"
                />
                <label 
                  htmlFor="proof-upload"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-bronze-gold/30 rounded-lg cursor-pointer hover:border-bronze-gold hover:bg-bronze-gold/5 transition-colors"
                >
                  <div className="text-center">
                    <p className="text-sm text-deep-terracotta dark:text-warm-ivory">
                      {proof ? proof.name : 'Click to choose a file'}
                    </p>
                    <p className="text-xs text-deep-terracotta/60 dark:text-warm-ivory/60 mt-1">
                      Accepted: images or PDF (max 10MB)
                    </p>
                  </div>
                </label>
              </div>
              {proof && (
                <button
                  type="button"
                  onClick={() => setProof(null)}
                  className="text-xs text-red-600 mt-2 hover:underline"
                >
                  Remove file
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-bronze-gold hover:bg-goldenrod text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
