import { ServerCrash, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SystemMaintenance() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none z-0" />

      <div className="max-w-md w-full bg-card/40 backdrop-blur-xl border border-border/50 p-8 sm:p-12 rounded-3xl shadow-2xl relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-8">
          {/* Glow effect in the background */}
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full z-0" />

          {/* Main Server icon sitting in the middle */}
          <div className="w-24 h-24 bg-background border border-border/50 rounded-2xl flex items-center justify-center relative z-10 shadow-xl transform rotate-3">
            <ServerCrash className="w-12 h-12 text-primary" strokeWidth={1.5} />
          </div>
          
          {/* Smaller icon overlapping in FRONT of the bottom right corner */}
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center backdrop-blur-md z-20 transform -rotate-12">
            <ThumbsDown className="w-5 h-5 text-amber-500" strokeWidth={2} />
          </div>
        </div>

        <h1 className="text-2xl font-bold font-heading tracking-tight mb-3">Service Unavailable</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          The Ecovion Admin Dashboard is currently undergoing scheduled maintenance. Please check back later or contact your system administrator if this persists.
        </p>

        <Button 
          variant="outline" 
          className="w-full h-11 bg-background/50 hover:bg-background border-border/50"
          onClick={() => window.location.href = '/'}
        >
          Return to Website
        </Button>
      </div>
    </div>
  );
}
