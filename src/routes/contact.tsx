import { createFileRoute } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, CheckCircle2 } from 'lucide-react';
import { PageIntro } from '@/components/site-shell';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/site-data';
import { createEnquiry } from '@/lib/firebase-db';

export const Route = createFileRoute('/contact')({head:()=>pageHead('Let’s connect','Contact Ecovion to explore research partnerships, agricultural collaborations, and material innovation.'),component:Contact});

function Contact(){
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setSubmitting(true);
    const data=new FormData(e.currentTarget);
    try {
      await createEnquiry({
        name: data.get('name'),
        email: data.get('email'),
        organization: data.get('organization'),
        interest: data.get('interest'),
        message: data.get('message'),
        status: 'new'
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageIntro eyebrow="LET’S CONNECT" title="Good things grow together." description="Have a question, a bold idea, or a shared purpose? We’d love to hear from you."/>
      <section className="site-container contact-grid">
        <div>
          <h2>Start a conversation.</h2>
          <p className="muted-copy">From field collaborations to material science research, let’s explore what we can build together.</p>
          <a className="contact-detail" href="mailto:info.ecovion@gmail.com"><Mail/><div><small>EMAIL US</small><span>info.ecovion@gmail.com</span></div><ArrowUpRight size={18}/></a>
          <a className="contact-detail" href="tel:+917903062113"><Phone/><div><small>GIVE US A CALL</small><span>+91 79030 62113</span></div><ArrowUpRight size={18}/></a>
          <div className="contact-detail"><MapPin/><div><small>FIND US</small><span>3/3697, New Kapil Vihar<br/>Saharanpur 247001, Uttar Pradesh, India</span></div></div>
          <div className="mt-8">
            <small className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4 block">FOLLOW US</small>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/ecovion_iitr/" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"><Instagram size={18}/></a>
              <a href="https://www.facebook.com/Ecovion.IITR" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"><Facebook size={18}/></a>
              <a href="https://www.linkedin.com/company/ecovion-pvt-ltd/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"><Linkedin size={18}/></a>
            </div>
          </div>
        </div>
        
        {submitted ? (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-secondary rounded-lg border border-border h-full min-h-[400px]">
            <CheckCircle2 className="w-16 h-16 text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-4">Message sent!</h3>
            <p className="text-muted-foreground mb-8">Thank you for reaching out. Our team will review your enquiry and get back to you shortly.</p>
            <Button variant="outline" onClick={() => setSubmitted(false)}>Send another message</Button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <label>Your name<input name="name" placeholder="Full name" required disabled={submitting}/></label>
              <label>Email address<input name="email" type="email" placeholder="you@organization.com" required disabled={submitting}/></label>
            </div>
            <label>Organization <span>(optional)</span><input name="organization" placeholder="Your organization" disabled={submitting}/></label>
            <label>I’m interested in
              <select name="interest" disabled={submitting}>
                <option>Research collaboration</option>
                <option>Farm & field collaboration</option>
                <option>Future products</option>
                <option>General enquiry</option>
              </select>
            </label>
            <label>Your message<textarea name="message" rows={5} placeholder="Tell us what’s on your mind…" required disabled={submitting}/></label>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : <>Send <ArrowUpRight/></>}
            </Button>
          </form>
        )}
      </section>
    </>
  );
}