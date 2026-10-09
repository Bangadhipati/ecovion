import { createFileRoute } from '@tanstack/react-router';
import { PageIntro } from '../components/site-shell';
import { pageHead } from '@/lib/site-data';

export const Route = createFileRoute('/privacy')({
  head: () => pageHead('Privacy Policy | Ecovion', 'Privacy Policy for Ecovion.'),
  component: Privacy
});

function Privacy() {
  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08] bg-center bg-fixed bg-no-repeat z-[-1] block md:hidden"
        style={{
          backgroundImage: 'url("/ECOVION%20square%20Logo.png")',
          backgroundSize: '400px'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08] bg-center bg-fixed bg-no-repeat z-[-1] hidden md:block"
        style={{
          backgroundImage: 'url("/Ecovion%20horizontal%20Logo.png")',
          backgroundSize: '700px'
        }}
      />
      <PageIntro eyebrow="LEGAL" title="Privacy Policy" description="How we handle and protect your information." />
      <div className="site-container max-w-3xl pb-20 prose dark:prose-invert">
        <p>Ecovion is committed to protecting your privacy. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you use our website and services.</p>
        
        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground">1. Information Collection</h3>
        <p>We collect information that you provide directly to us when contacting us, subscribing to our newsletter, or requesting partnership information.</p>
        
        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground">2. Use of Information</h3>
        <p>We use the information we collect to communicate with you, respond to your inquiries, and improve our services and website experience.</p>
        
        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground">3. Information Sharing</h3>
        <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information.</p>
        
        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground">4. Data Security</h3>
        <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access or alteration of your personal information.</p>
        
        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground">5. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at info.ecovion@gmail.com.</p>
        
        <p className="mt-12 text-sm text-muted-foreground">Last updated: October 2026</p>
      </div>
    </div>
  );
}
