import { Link } from 'react-router-dom';
import { Shield, Lock, Map } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-xl font-bold text-slate-100">SafeChain</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A blockchain-anchored, privacy-first platform making urban safety reporting trustworthy, anonymous, and verifiable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-100 font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/report" className="hover:text-purple-400 transition-colors">File a Report</Link></li>
              <li><Link to="/map" className="hover:text-purple-400 transition-colors">Live Safety Map</Link></li>
              <li><Link to="/track" className="hover:text-purple-400 transition-colors">Track Status</Link></li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div>
            <h3 className="text-slate-100 font-semibold mb-4">Guarantees</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Zero PII / 100% Anonymous</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Immutable Polygon Blockchain</span>
              </li>
              <li className="flex items-center gap-2">
                <Map className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Community Data</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 SafeChain. Built for WT'26 Hackathon (PS-8).
          </p>
          <div className="text-slate-500 text-sm">
            GDG On Campus • VIT Vellore
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;