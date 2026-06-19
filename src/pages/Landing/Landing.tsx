import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  FileText,
  CheckCircle,
  Database,
  History,
  MessageSquare,
  ChevronDown,
  Layers,
  Shield,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import dashboardMockup from '../../assets/dashboard_mockup.png';
import appMockup from '../../assets/app_mockup.png';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-900 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left font-bold text-white text-sm py-2 cursor-pointer hover:text-indigo-300 transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-4.5 w-4.5 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-xs text-zinc-400 leading-relaxed pt-2 pb-4 pr-6">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Landing: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('chat');
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);

  const handleDemoLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDemoLoggingIn) return;
    setIsDemoLoggingIn(true);
    try {
      await login(
        import.meta.env.VITE_DEMO_EMAIL || 'demo@demo.com',
        import.meta.env.VITE_DEMO_PASSWORD || 'demo@123'
      );
      toast.success('Welcome! Logged in as Demo User.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to login with demo credentials.');
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 overflow-x-hidden relative selection:bg-indigo-500/30">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[800px] right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-10 h-[600px] w-[600px] rounded-full bg-indigo-500/3 blur-[150px] pointer-events-none z-0" />

      {/* Nav Bar */}
      <nav className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
              <span className="font-extrabold text-white text-sm">R</span>
            </div>
            <span className="font-extrabold tracking-tight text-lg text-white">
              RAG<span className="gradient-text">Space</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-450">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="gradient-btn flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-indigo-500/10 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDemoLogin}
                  disabled={isDemoLoggingIn}
                  className="text-xs font-semibold text-indigo-450 hover:text-indigo-300 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDemoLoggingIn && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>Live Demo</span>
                </button>
                <Link to="/login" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="gradient-btn flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl px-6 pt-16 pb-20 text-center flex flex-col items-center gap-6 z-10">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/20 px-3.5 py-1 text-[10px] font-bold tracking-wider text-indigo-400 uppercase"
        >
          <Sparkles className="h-3 w-3" />
          <span>Interactive AI Document Agent</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]"
        >
          Interact with Your Documents,<br />
          <span className="gradient-text">Seamlessly.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl text-xs sm:text-sm text-zinc-450 leading-relaxed"
        >
          A state-of-the-art SaaS workspace to upload reference files, index embeddings automatically, ask questions with exact citations, and manage thread histories in a spacious interface.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-2"
        >
          {user ? (
            <Link
              to="/dashboard"
              className="gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <span>Go to Workspace Dashboard</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <span>Deploy Free Workspace</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <button
                onClick={handleDemoLogin}
                disabled={isDemoLoggingIn}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-zinc-700 px-6 py-3 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDemoLoggingIn && <Loader2 className="h-4.5 w-4.5 animate-spin text-indigo-400" />}
                <span>Try Live Demo</span>
              </button>
            </>
          )}
        </motion.div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="relative mx-auto max-w-6xl px-6 pb-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Toggle Tabs */}
          <div className="flex bg-zinc-900 border border-zinc-850 p-1 rounded-xl w-max shadow-md shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={clsx(
                'flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer',
                activeTab === 'chat'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-450 hover:text-zinc-200'
              )}
            >
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <span>AI Chat & Citations</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={clsx(
                'flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer',
                activeTab === 'dashboard'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-450 hover:text-zinc-200'
              )}
            >
              <Layers className="h-4 w-4 text-purple-400" />
              <span>Workspace Dashboard</span>
            </button>
          </div>

          {/* Browser Container Frame */}
          <div className="w-full glass-panel border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl p-2.5 bg-zinc-950/40">
            
            {/* Browser chrome headers */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2 px-3 mb-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="w-96 rounded-md bg-zinc-900 px-3 py-1 text-center text-[10px] text-zinc-550 border border-zinc-850 truncate select-none">
                {activeTab === 'chat' ? 'https://www.ragspace.com/app/persist' : 'https://www.ragspace.com/dashboard'}
              </div>
              <div className="w-12" />
            </div>

            {/* Screen slider */}
            <div className="aspect-16/10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 relative">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' ? (
                  <motion.img
                    key="chat"
                    src={appMockup}
                    alt="RAG Space AI Chat Workspace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-contain object-top select-none bg-zinc-950"
                  />
                ) : (
                  <motion.img
                    key="dashboard"
                    src={dashboardMockup}
                    alt="RAG Space Workspace Dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-contain object-top select-none bg-zinc-950"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20 border-t border-zinc-900/60 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineered for Document Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed">
            All the tools you need to vectorize PDFs, trace references, and chat with AI in a fast desktop client.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Database className="h-5.5 w-5.5" />}
            title="Auto-Vectorization"
            description="Drag and drop PDFs to extract metadata. Text chunking, embedding generation, and Qdrant index syncing happen instantly."
            delay={0.1}
          />
          <FeatureCard
            icon={<MessageSquare className="h-5.5 w-5.5" />}
            title="Context-Aware Chat"
            description="Discuss documents with state-of-the-art language models that dynamically retrieve source sections matching your prompt."
            delay={0.2}
          />
          <FeatureCard
            icon={<History className="h-5.5 w-5.5" />}
            title="Session Persistence"
            description="Threads are auto-summarized and saved. Navigate threads in a side panel, rename chats, or delete history securely."
            delay={0.3}
          />
          <FeatureCard
            icon={<FileText className="h-5.5 w-5.5" />}
            title="Verified Citations"
            description="Every response references document sources. View exact page numbers, chunk details, and similarity score matches."
            delay={0.4}
          />
          <FeatureCard
            icon={<Layers className="h-5.5 w-5.5" />}
            title="Spacious Workspaces"
            description="Fully responsive, edge-to-edge frame. Collapse document panels and history bars to focus on conversation feeds."
            delay={0.5}
          />
          <FeatureCard
            icon={<Shield className="h-5.5 w-5.5" />}
            title="Secure Data Handling"
            description="Safe session management. Your references are locked securely to your personal workspace database context."
            delay={0.6}
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20 border-t border-zinc-900/60 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Flexible Plans for Teams of Any Size
          </h2>
          <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed">
            Start free and upgrade as your document library grows. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel rounded-2xl p-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Starter</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-zinc-500">/ month</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">For individuals getting started with reference chat queries.</p>
              <div className="border-t border-zinc-900 pt-4 space-y-2 text-xs text-zinc-350">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>3 PDF Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>20 messages / day</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Standard indexing speed</span>
                </div>
              </div>
            </div>
            <Link
              to="/signup"
              className="mt-6 w-full text-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Sign Up Free
            </Link>
          </motion.div>

          {/* Card 2: Pro (Recommended) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel border-indigo-500/30 bg-indigo-950/5 rounded-2xl p-6 flex flex-col justify-between relative shadow-lg shadow-indigo-500/5"
          >
            {/* Pop highlight */}
            <div className="absolute -top-3 right-6 rounded-full bg-indigo-500 px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-md">
              Recommended
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Pro Professional</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-white">$19</span>
                  <span className="text-xs text-zinc-500">/ month</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">For researchers, developers, and power users needing deep search capabilities.</p>
              <div className="border-t border-indigo-500/20 pt-4 space-y-2 text-xs text-zinc-350">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-zinc-200">Unlimited documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Unlimited message queries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Fast priority parsing sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Full chat history persistence</span>
                </div>
              </div>
            </div>
            <Link
              to="/signup"
              className="mt-6 w-full text-center gradient-btn py-2.5 text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Start 14-Day Free Trial
            </Link>
          </motion.div>

          {/* Card 3: Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel rounded-2xl p-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Enterprise</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-white">Custom</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">For organizations requiring advanced compliance, security, and custom deployments.</p>
              <div className="border-t border-zinc-900 pt-4 space-y-2 text-xs text-zinc-350">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Dedicated compute servers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Custom LLM model fine-tuning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>SOC2 security compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>SLA and dedicated support manager</span>
                </div>
              </div>
            </div>
            <Link
              to="/login"
              className="mt-6 w-full text-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Contact Sales
            </Link>
          </motion.div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-20 border-t border-zinc-900/60 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-450 leading-relaxed">
              Have questions about RAG Space? We have answers. If you need custom help, reach out to our team.
            </p>
          </div>
          <div className="md:col-span-8">
            <FAQItem
              question="What is Retrieval-Augmented Generation (RAG)?"
              answer="RAG is a technique that references external knowledge (like your uploaded documents) to generate accurate, contextual answers. RAG Space extracts matching content chunks, feeds them as context into the LLM, and prints the generated result alongside source citations, preventing AI hallucinations."
            />
            <FAQItem
              question="Are my documents safe and secure?"
              answer="Absolutely. We isolate workspace databases per user. Your documents and database chunks are indexed inside encrypted environments and are never used to train global AI models."
            />
            <FAQItem
              question="Can I rename my chat history threads?"
              answer="Yes. The system automatically creates a summary title from your first message. You can hover over any item in the chat sidebar and click the edit/pencil icon to type in a custom name, or click the trash can icon to permanently delete it."
            />
            <FAQItem
              question="What document types do you support?"
              answer="Currently, RAG Space supports text-based PDF documents. We process layouts, page dimensions, and textual nodes to build semantic chunk indices. Support for DOCX, TXT, and Markdown reference extensions is coming soon."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative mx-auto max-w-5xl px-6 py-20 text-center z-10">
        <div className="glass-panel border-indigo-500/20 bg-indigo-950/10 rounded-3xl p-8 md:p-12 flex flex-col items-center gap-6 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-2xl" />
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Ready to Unlock Your Document Knowledge?
          </h2>
          <p className="max-w-md text-xs text-zinc-450 leading-relaxed">
            Deploy your free workspace workspace. Upload references, sync indices, and chat with AI assistants in minutes.
          </p>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold shadow-lg shadow-indigo-500/20 mt-2 cursor-pointer"
          >
            <span>{user ? 'Open Dashboard' : 'Deploy Free Workspace'}</span>
            <ArrowUpRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/60 py-12 relative z-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-550 font-medium">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-purple-500">
              <span className="font-extrabold text-white text-[10px]">R</span>
            </div>
            <span className="font-extrabold tracking-wider text-[11px] text-white">
              RAG<span className="gradient-text">Space</span>
            </span>
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
            <a href="mailto:support@ragspace.io" className="hover:text-white transition-colors">Contact Support</a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} RAG Space Inc. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
