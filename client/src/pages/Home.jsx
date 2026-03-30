import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Link as LinkIcon, Lock, Activity, ChevronRight, FileDigit, EyeOff } from 'lucide-react';

const Home = () => {
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col space-y-24 pb-20 pt-10">
      
      {/* HERO SECTION */}
      <motion.section 
        className="text-center space-y-8 max-w-4xl mx-auto mt-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
          Unified Safety Platform for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            Real-Time Urban Safety
          </span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Report it. Secure it on the blockchain. Navigate safely. Plant anonymous safety pins instantly and protect your evidence from tampering.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/report" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.4)]"
          >
            File Anonymous Report
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/map" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors border border-slate-700"
          >
            <MapPin className="w-5 h-5 text-slate-400" />
            View Live Safety Map
          </Link>
        </motion.div>
      </motion.section>

      {/* LIVE STATS SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full"
      >
        {[
          { label: "Reports Filed", value: "1,248", icon: <FileDigit className="w-6 h-6 text-blue-400" /> },
          { label: "Evidence Anchored", value: "3,192", icon: <LinkIcon className="w-6 h-6 text-purple-400" /> },
          { label: "Active Map Flags", value: "847", icon: <Activity className="w-6 h-6 text-emerald-400" /> }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-lg hover:border-slate-700 transition-colors">
            <div className="p-3 bg-slate-800 rounded-xl">{stat.icon}</div>
            <div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.section>

      {/* HOW IT WORKS / BLOCKCHAIN EXPLAINER */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto w-full space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">How blockchain protects your evidence</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Traditional evidence gets deleted or tampered with. SafeChain anchors your proof to an immutable ledger.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "1. IPFS Pinning",
              desc: "Files are pinned to the InterPlanetary File System (IPFS) generating a unique cryptographic fingerprint (CID).",
              icon: <FileDigit className="w-8 h-8 text-blue-400" />
            },
            {
              title: "2. Hash Anchoring",
              desc: "The backend computes a keccak256 hash of the CID and anchors it to our EvidenceLocker smart contract.",
              icon: <LinkIcon className="w-8 h-8 text-purple-400" />
            },
            {
              title: "3. Legal Verification",
              desc: "Anyone can verify the hash on the Polygon Mumbai testnet, proving the file was never altered.",
              icon: <Shield className="w-8 h-8 text-emerald-400" />
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">
                {feature.icon}
              </div>
              <div className="bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* TRUST SIGNALS BANNER */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto w-full bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6">
          <EyeOff className="w-12 h-12 text-purple-400 mx-auto" />
          <h2 className="text-3xl font-bold text-white">100% Anonymous Guarantees</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We use Firebase Anonymous Auth. No email, no phone number, and no personal data is ever collected. Your identity remains entirely protected while you make your city safer.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <span className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg text-sm text-slate-300 border border-white/5">
              <Lock className="w-4 h-4 text-emerald-400" /> Zero PII
            </span>
            <span className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg text-sm text-slate-300 border border-white/5">
              <Lock className="w-4 h-4 text-emerald-400" /> Backend Wallet Tx
            </span>
            <span className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg text-sm text-slate-300 border border-white/5">
              <Lock className="w-4 h-4 text-emerald-400" /> No Tracking Cookies
            </span>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default Home;