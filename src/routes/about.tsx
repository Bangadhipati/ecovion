import { createFileRoute } from '@tanstack/react-router';
import { PageIntro, PartnerBand } from '@/components/site-shell';
import { research, pageHead } from '@/lib/site-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const teamMembers = [
  {
    name: 'Dr. Madhuparna Ray',
    role: 'Co-Founder & CEO',
    image: '/didi 2.png',
    tags: ['PhD · IIT Roorkee', 'MSc Materials Science', 'GATE AIR 232'],
    description: 'Ph.D from the Department of Polymer and Process Engineering at IIT Roorkee. Earlier, she completed her bachelor’s (Chemistry) and master’s (Materials Science) from the University of Burdwan and CIPET Bhubaneswar, respectively, and spent 5 years involved in MOF research. AIR 232, GATE 2017.',
  },
  {
    name: 'Abhinav K. Singh',
    role: 'Founder',
    image: '/abhinav.png',
    tags: ['PhD Scholar IIT Roorkee', 'M.Tech ICT Mumbai', 'Pusa Krishi Grant'],
    description: 'Founder of Ecovion Pvt. Ltd. and a Ph.D. researcher in the Department of Polymer and Process Engineering at IIT Roorkee. Holds an M.Tech in Polymer Engineering & Technology from ICT Mumbai and a B.Tech in Plastic Technology from HBTU Kanpur (AIR 169, GATE 2020). Industry experience as a Research Engineer and academic experience as a Lecturer, with expertise in sustainable materials, advanced polymers and agricultural technologies. Recipient of the Pusa Krishi Startup Grant.',
  },
  {
    name: 'Prof. Gaurav Manik',
    role: 'Mentor',
    image: '/gaurav.png',
    tags: ['B.Tech · HBTU Kanpur', 'PhD · IIT Bombay'],
    description: 'Former HOD and Professor in the Department of Polymer and Process Engineering, IIT Roorkee, with 15+ years of research experience in chemical science & engineering. Center of Excellence in Polymeric Materials for Medical Practice Devices, Department of Chemical Engineering, Faculty of Engineering, Chulalongkorn University, Bangkok, 10330, Thailand.',
  },
  {
    name: 'Shreedhar Bhat',
    role: 'Business Advisor',
    image: '/shreedhar.png',
    tags: ['16+ Years Startup Exp', 'Tech Entrepreneur'],
    description: 'Seasoned tech entrepreneur with 16+ years startup experience building successful bootstrapped businesses in Technology, Agriculture.',
  }
];

export const Route = createFileRoute('/about')({ head: () => pageHead('Our story', 'Meet Ecovion, an India-based deep-tech startup developing a material-innovation platform, incubated at ICAR–IARI (Pusa Krishi).'), component: About });
function About() { return <><PageIntro eyebrow="OUR STORY" title="Better materials. A better tomorrow." description="Rooted in scientific curiosity. Driven by real-world purpose." /><section className="site-container editorial-grid"><img src={research} alt="Research into smart material systems for agriculture" width={1200} height={800} /><div><span className="eyebrow">MEET ECOVION</span><h2>Small-scale innovation.<br />Planet-scale ambition.</h2><p>We are an India-based deep-tech startup building a material-innovation platform for controlled delivery and environmental remediation.</p><p className="muted-copy">At our core, we design proprietary material systems that regulate how active molecules behave in soil, water, and biological interfaces. Rather than focusing on a single product, we are building a platform with possibilities across multiple applications.</p><div className="fact-strip"><strong>ICAR–IARI</strong><span>Incubated at Pusa Krishi</span></div></div></section><section className="site-container founders-section"><span className="eyebrow">THE PEOPLE BEHIND THE PURPOSE</span><h2>Science brought us together.<br />Impact moves us forward.</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">{teamMembers.map((member) => (<Dialog key={member.name}><DialogTrigger asChild><div className="founder-card cursor-pointer group text-left"><div className="relative overflow-hidden rounded-2xl aspect-square mb-5"><img src={member.image} alt={member.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" /></div><h3 className="text-xl font-bold mb-1">{member.name}</h3><span className="text-sm text-primary font-medium">{member.role}</span></div></DialogTrigger><DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto sm:p-8 p-6 rounded-3xl"><DialogHeader className="mb-6"><div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left"><div className="relative shrink-0"><img src={member.image} alt={member.name} className="w-32 h-32 sm:w-28 sm:h-28 rounded-full object-cover shadow-lg border-4 border-background ring-1 ring-border" /></div><div className="flex flex-col justify-center sm:mt-2"><DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">{member.name}</DialogTitle><DialogDescription className="text-primary text-[13px] sm:text-sm font-bold uppercase tracking-widest">{member.role}</DialogDescription></div></div></DialogHeader><div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">{member.tags.map(tag => (<span key={tag} className="text-xs bg-muted border border-border text-foreground px-3 py-1.5 rounded-full font-medium">{tag}</span>))}</div><div className="bg-muted/30 p-5 sm:p-6 rounded-2xl border border-border/50"><p className="text-[15px] sm:text-base text-foreground/80 leading-relaxed whitespace-pre-line">{member.description}</p></div></DialogContent></Dialog>))}</div></section><PartnerBand /></>; }