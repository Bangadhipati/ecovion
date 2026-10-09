import { Link, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, AlignRight, X, Leaf, Mail, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English (Original)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'zh-CN', name: 'Chinese (中文)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ru', name: 'Russian (Русский)' }
];


const navigation = [{ to: '/', label: 'Home' }, { to: '/about', label: 'About us' }, { to: '/technology', label: 'Our technology' }, { to: '/future-products', label: 'Future products' }, { to: '/blog', label: 'Blog' }] as const;
export function Brand() { return <Link to="/" className="brand" aria-label="Ecovion home"><img src="/Ecovion%20horizontal%20Logo.png" alt="Ecovion" /></Link>; }
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });

  const triggerTranslate = (langCode: string) => {
    if (langCode === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.location.hostname + '; path=/;';
      window.location.reload();
      return;
    }
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    }
  };

  return <header className="site-header"><div className="site-container header-inner"><Brand /><nav className="desktop-nav" aria-label="Main navigation" style={{ marginLeft: 'auto' }}>{navigation.map(n => <Link key={n.to} to={n.to} className={pathname === n.to ? 'nav-link active' : 'nav-link'}>{n.label}{n.to === '/future-products' && <span className="nav-new">NEW</span>}</Link>)}<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Translate" className="ml-2 mt-1 opacity-70 hover:opacity-100 hover:text-primary hover:bg-transparent"><Languages size={18} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto z-[100] custom-scrollbar notranslate"><DropdownMenuLabel className="sticky -top-1 -mx-1 px-3 py-2 bg-popover z-10 border-b border-border mb-1 text-[10px] text-muted-foreground flex justify-between items-center rounded-t-md">Translate <span className="text-[8px] uppercase font-bold tracking-wider opacity-60">Powered by Google</span></DropdownMenuLabel>{languages.map(l => (<DropdownMenuItem key={l.code} onClick={() => triggerTranslate(l.code)} className="text-xs cursor-pointer py-2">{l.name}</DropdownMenuItem>))}</DropdownMenuContent></DropdownMenu></nav><Button asChild className="contact-button desktop-contact-button"><Link to="/contact">Let’s connect <ArrowUpRight /></Link></Button><Button variant="ghost" size="icon" className="mobile-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <AlignRight />}</Button></div>{open && <nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map(n => <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>{n.label}</Link>)}<Button asChild className="contact-button w-max mt-2"><Link to="/contact" onClick={() => setOpen(false)}>Let’s connect <ArrowUpRight size={16} /></Link></Button></nav>}</header>;
}
export function Footer() { return <footer className="site-footer"><div className="site-container footer-main"><div><Brand /><p>Better materials.<br />A better tomorrow.</p><span className="footer-india">Rooted in India. Built for the world.</span></div><div><h3>Explore</h3><Link to="/about">About Ecovion</Link><Link to="/technology">Our technology</Link><Link to="/future-products">Future products</Link></div><div><h3>Discover</h3><Link to="/blog">The Ecovion journal</Link><Link to="/for-farmers">For farmers</Link><Link to="/contact">Partner with us</Link></div><div><h3>Get in touch</h3><a href="mailto:info.ecovion@gmail.com">info.ecovion@gmail.com <ArrowUpRight size={14}/></a><a href="tel:+917903062113">+91 79030 62113</a><p className="footer-address">Saharanpur, Uttar Pradesh<br />India</p></div></div><div className="site-container footer-bottom"><span>© 2026 Ecovion. All rights reserved.</span><div style={{display:'flex', gap:'20px'}}><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></div><a href="https://www.linkedin.com/company/ecovion-pvt-ltd/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14}/></a></div></footer>; }
export function PartnerBand() { return <section className="partner-band"><div className="site-container"><div><span className="eyebrow">LET’S GROW SOMETHING BETTER</span><h2>Big ideas grow<br />through collaboration.</h2></div><div><p>Researchers, farmers, and forward-thinkers.<br />There’s a place for you in our journey.</p><Button asChild className="light-button"><Link to="/contact">Partner with Ecovion <ArrowUpRight /></Link></Button></div></div></section>; }
export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <section className="page-intro site-container"><span className="eyebrow"><span className="tiny-dot" />{eyebrow}</span><h1>{title}</h1><p>{description}</p></section>; }