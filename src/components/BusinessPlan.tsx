
import React from 'react';
import { 
  CheckCircle2, 
  Target, 
  Layout, 
  Database, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Monitor, 
  Smartphone,
  Palette
} from 'lucide-react';

const BusinessPlan: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Brand Identity */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Zap size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">1. Brand Identity & Vision</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "LinearAI", desc: "Minimal, tech-focused, professional." },
            { name: "InkDraft", desc: "Tattoo & artist-centric, bold." },
            { name: "StrokeFlow", desc: "Elegant, fluid, artistic." }
          ].map((brand) => (
            <div key={brand.name} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-500 transition-colors">
              <h3 className="text-xl font-bold text-indigo-600 mb-2">{brand.name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{brand.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Homepage Structure */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-500 rounded-lg text-white">
            <Layout size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">2. Homepage Layout (SaaS Structure)</h2>
        </div>
        <div className="space-y-4">
          {[
            "Hero: Dynamic 'Before/After' slider with AI conversion demo.",
            "Trust Engine: Featured in logos & real-time transformation count.",
            "Style Grid: Interactive carousel showing Minimal, Bold, Sketch, and Single-Line styles.",
            "Use-Case Bento: Specific sections for Couples (gifts), Tattoo Lovers, and Etsy Sellers.",
            "Pricing: 3-tier structure (Free, Pro, Business).",
            "SEO Footer: Targeted keywords for line art, coloring pages, and vector conversion."
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl">
              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">{i+1}</span>
              <p className="text-slate-700 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500 rounded-lg text-white">
            <Monitor size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">3. Tech Stack & Infrastructure</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 rounded-2xl text-white">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Frontend</h4>
            <ul className="space-y-2 text-sm">
              <li>Next.js 14 (App Router)</li>
              <li>Tailwind CSS + Framer Motion</li>
              <li>Konva.js / Fabric.js (Canvas Editor)</li>
            </ul>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl text-white">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Backend & AI</h4>
            <ul className="space-y-2 text-sm">
              <li>Groq AI / Replicate (Edge Inference)</li>
              <li>Node.js + Hono (Edge Workers)</li>
              <li>PyTorch (Custom LineArt Models)</li>
            </ul>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl text-white">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Database & Auth</h4>
            <ul className="space-y-2 text-sm">
              <li>PostgreSQL (Supabase/Prisma)</li>
              <li>Redis (Caching & Rate Limiting)</li>
              <li>Google OAuth (Lucia/Auth.js)</li>
            </ul>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl text-white">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">E-Commerce</h4>
            <li>Stripe (Subscriptions)</li>
            <li>Printful API (POD Fulfillment)</li>
            <li>Cloudinary (Asset Management)</li>
          </div>
        </div>
      </section>

      {/* Monetization */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500 rounded-lg text-white">
            <DollarSign size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">4. Monetization Strategy</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Subscription Tiers</h3>
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Pro Member</span>
                <span className="text-indigo-600 font-bold">$19/mo</span>
              </div>
              <ul className="text-sm space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-indigo-500" /> Unlimited HD Vector Exports</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-indigo-500" /> All AI Styles (Minimal to Bold)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-indigo-500" /> Commercial Usage License</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-indigo-500" /> API Access (100 req/mo)</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Service-Based Revenue</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold">Custom Artist Commission</span>
                <span className="text-sm font-bold">$49+</span>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold">One-time HD Download</span>
                <span className="text-sm font-bold">$4.99</span>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold">T-Shirt Print (via Printful)</span>
                <span className="text-sm font-bold">$24.99</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Plan */}
      <section className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-12 shadow-xl">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4 mb-12">
          <div className="p-3 bg-slate-100 rounded-2xl">
            <TrendingUp size={32} className="text-indigo-600" />
          </div>
          <h2 className="text-4xl font-black">Growth & Marketing Plan</h2>
          <p className="text-slate-500">The 0 to 100k Monthly Active Users strategy.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
                <Smartphone size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1 text-slate-900">TikTok & Instagram Viral Loops</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Create 'AI Art Reveal' filters. Allow users to share their line art directly with a small watermark that drives traffic.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <Target size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1 text-slate-900">Pinterest SEO</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Mass-post generated line art (couple sketches, tattoos) with links back to the editor. Pinterest is a goldmine for gift buyers.</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                <Palette size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1 text-slate-900">Etsy Seller Affiliate Program</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Target Etsy shop owners who sell personalized gifts. Offer them a bulk-use dashboard to create designs for their customers.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                <Database size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1 text-slate-900">The 'Coloring Page' Lead Magnet</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Free tool to convert any family photo to a coloring page. Great for capturing parent emails for the CRM.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database Schema Overview */}
      <section className="p-8 bg-slate-900 rounded-[32px] text-white">
        <div className="flex items-center gap-3 mb-8">
          <Database size={24} className="text-indigo-400" />
          <h2 className="text-2xl font-bold">Database Schema (Relational)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-4 border border-slate-800 rounded-xl bg-slate-800/50">
            <h5 className="text-indigo-400 font-bold mb-2">Users</h5>
            <ul className="space-y-1 opacity-70">
              <li>id (uuid)</li>
              <li>email (unique)</li>
              <li>google_id</li>
              <li>subscription_tier</li>
              <li>created_at</li>
            </ul>
          </div>
          <div className="p-4 border border-slate-800 rounded-xl bg-slate-800/50">
            <h5 className="text-indigo-400 font-bold mb-2">Assets</h5>
            <ul className="space-y-1 opacity-70">
              <li>id (uuid)</li>
              <li>user_id (ref)</li>
              <li>original_url</li>
              <li>result_svg_url</li>
              <li>style_settings (json)</li>
            </ul>
          </div>
          <div className="p-4 border border-slate-800 rounded-xl bg-slate-800/50">
            <h5 className="text-indigo-400 font-bold mb-2">Marketplace</h5>
            <ul className="space-y-1 opacity-70">
              <li>artist_id (ref)</li>
              <li>design_name</li>
              <li>price</li>
              <li>commission_rate</li>
              <li>sales_count</li>
            </ul>
          </div>
          <div className="p-4 border border-slate-800 rounded-xl bg-slate-800/50">
            <h5 className="text-indigo-400 font-bold mb-2">Orders</h5>
            <ul className="space-y-1 opacity-70">
              <li>order_id</li>
              <li>item_type (POD/Custom)</li>
              <li>status (tracking)</li>
              <li>stripe_session_id</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessPlan;
