'use client';

import React, { useState } from 'react';
import Footer from './Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import LoginModal from './LogInModal';
import SignUpModal from './SignUpModal';

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-hidden relative flex flex-col">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-brand/10 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4 z-[1]"></div>
      <div className="absolute top-40 left-60 w-40 h-40 bg-accent/15 rounded-full blur-xl z-[1]"></div>
      <div className="absolute top-60 right-20 w-60 h-60 bg-brand/10 rounded-full blur-2xl z-[1]"></div>
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl z-[1]"></div>
      <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-accent/10 to-transparent z-[1]"></div>

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col items-center bg-white">
        {/* Hero Section */}
        <div className='flex flex-col items-center justify-center'>
          <div className="flex justify-center mb-12 mt-20">
            <div className="bg-brand text-white px-6 py-2 rounded-full text-sm font-extrabold">Finance Manager</div>
          </div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-6xl font-bold text-brand mb-4">Finstant</h1>
            <p className="text-muted text-xl mb-8 max-w-xl mx-auto">
              Turn your spending into strategy
              <br />
              with intelligent financial analysis
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowSignUpModal(true)}
                className="bg-accent text-white px-6 py-3 rounded-full font-extrabold flex items-center hover:bg-accent-hover transition-colors"
              >
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="border-2 border-brand text-brand px-6 py-3 rounded-full font-medium hover:bg-brand/5 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-24 z-10">
            <p className="text-muted text-lg">
              Visualize your expenses by category, track trends over time, and discover
              <br />
              actionable insights to boost your savings — all in one intuitive dashboard.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-32 z-10">
          {/* Smart Categorization */}
          <div className="bg-brand rounded-xl p-6 text-white">
            <div className="bg-accent w-10 h-10 rounded-full mb-4 flex items-center justify-center">
              <span className="text-white text-xl font-bold">$</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Categorization</h3>
            <p className="text-white/85 text-sm">
              Automatically organize expenses into categories like food, travel, and bills.
            </p>
          </div>

          {/* Insightful Analytics */}
          <div className="bg-brand rounded-xl p-6 text-white">
            <div className="bg-accent w-10 h-10 rounded-full mb-4 flex items-center justify-center">
              <span className="text-white text-xl font-bold">📊</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Insightful Analytics</h3>
            <p className="text-white/85 text-sm">Visualize spending patterns with charts and monthly summaries.</p>
          </div>

          {/* Goal-Oriented Saving */}
          <div className="bg-brand rounded-xl p-6 text-white">
            <div className="bg-accent w-10 h-10 rounded-full mb-4 flex items-center justify-center">
              <span className="text-white text-xl font-bold">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Goal-Oriented Saving</h3>
            <p className="text-white/85 text-sm">Set savings goals and track your progress easily.</p>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          {/* Small blob */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 rounded-full blur-xl -translate-y-1/2 translate-x-1/4 z-[1]"></div>

          <h2 className="text-3xl font-bold text-brand mb-3">Ready to Transform Your Finances?</h2>
          <p className="text-muted mb-8">Let's make money management easy and smart.</p>

          <button
            onClick={() => setShowSignUpModal(true)}
            className="bg-accent text-white px-8 py-3 rounded-full font-medium inline-block hover:bg-accent-hover transition-colors"
          >
            Sign up - It's free!
          </button>
        </div>
      </main>

      {/* Modals */}
      <LoginModal isOpen={showLoginModal} onSwitchToSignUp={() => {
        setShowSignUpModal(true);
        setShowLoginModal(false);
      }} onClose={() => setShowLoginModal(false)} />

      <SignUpModal isOpen={showSignUpModal} onSwitchToLogin={() => {
        setShowSignUpModal(false);
        setShowLoginModal(true);
      }}
        onClose={() => setShowSignUpModal(false)} />

      {/* Footer */}
      <footer className="bg-canvas w-full relative z-10">
        <Footer />
      </footer>
    </div>
  );
};

export default LandingPage;