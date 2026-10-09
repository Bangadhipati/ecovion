import { createFileRoute } from '@tanstack/react-router';
import { PageIntro } from '../components/site-shell';
import { pageHead } from '@/lib/site-data';

export const Route = createFileRoute('/terms')({
  head: () => pageHead('Terms & Conditions | Ecovion', 'Terms and Conditions for Ecovion.'),
  component: Terms
});

function Terms() {
  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08] bg-center bg-fixed bg-no-repeat z-[-1] block md:hidden"
        style={{
          backgroundImage: 'url("/ECOVION%20square%20Logo.png")',
          backgroundSize: 'min(400px, 80vw)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08] bg-center bg-fixed bg-no-repeat z-[-1] hidden md:block"
        style={{
          backgroundImage: 'url("/Ecovion%20horizontal%20Logo.png")',
          backgroundSize: 'min(700px, 80vw)'
        }}
      />
      <PageIntro eyebrow="LEGAL" title="Terms & Conditions" description="Terms of use for the Ecovion website." />
      <div className="site-container max-w-3xl pb-20 prose dark:prose-invert">
        <p>Welcome to Ecovion. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Ecovion's website if you do not agree to take all of the terms and conditions stated on this page.</p>
        
        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground">1. License</h3>
        <p>Unless otherwise stated, Ecovion and/or its licensors own the intellectual property rights for all material on Ecovion. All intellectual property rights are reserved. You may access this from Ecovion for your own personal use subjected to restrictions set in these terms and conditions.</p>
        
        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground">2. Restrictions</h3>
        <p>You are specifically restricted from all of the following:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>Publishing any website material in any other media</li>
          <li>Selling, sublicensing, and/or otherwise commercializing any website material</li>
          <li>Using this website in any way that is or may be damaging to this website</li>
        </ul>
        
        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground">3. No Warranties</h3>
        <p>This website is provided "as is," with all faults, and Ecovion express no representations or warranties, of any kind related to this website or the materials contained on this website.</p>
        
        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground">4. Governing Law & Jurisdiction</h3>
        <p>These Terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.</p>
        
        <p className="mt-12 text-sm text-muted-foreground">Last updated: October 2026</p>
      </div>
    </div>
  );
}
