import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, Search, MoveRight } from 'lucide-react';
import { PageIntro } from '@/components/site-shell';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/site-data';
import { getBlogs } from '@/lib/firebase-db';

const handleShare = (e: React.MouseEvent, title: string, slug: string) => {
  e.preventDefault();
  const url = `${window.location.origin}/blog/${slug}`;
  if (navigator.share) {
    navigator.share({ title, url }).catch(console.error);
  } else {
    navigator.clipboard.writeText(url);
    alert('Article link copied to clipboard!');
  }
};

export const Route = createFileRoute('/blog/')({ 
  loader: async () => await getBlogs(),
  head: () => pageHead('The Ecovion journal', 'Explore ideas on sustainable agriculture, material science, and root-zone delivery in the Ecovion journal.'), 
  component: Blog 
});

function Blog() { 
  const articles = Route.useLoaderData();
  const [filter, setFilter] = useState('All stories');
  const [query, setQuery] = useState('');
  
  // Sort by date (newest first)
  const sortedArticles = [...articles].sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  
  // Find the explicitly featured article, or default to the latest one
  const featuredStory = sortedArticles.find((a: any) => a.isFeatured) || sortedArticles[0];
  
  const visible = sortedArticles.filter((a: any) => 
    (filter === 'All stories' || a.category === filter) && 
    `${a.title} ${a.summary || ''}`.toLowerCase().includes(query.toLowerCase())
  );
  
  return <>
    <PageIntro eyebrow="THE ECOVION JOURNAL" title="Ideas for a greener tomorrow." description="Notes from the intersection of material science, sustainable agriculture, and possibility."/>
    <section className="site-container blog-section">
      {featuredStory && (
        <div className="relative mb-11">
          <Link to="/blog/$slug" params={{slug:featuredStory.slug}} className="featured-story mb-0">
            <img src={featuredStory.image} alt="Featured article image" width={1024} height={1024}/>
            <div>
              <span className="eyebrow">FEATURED STORY · {featuredStory.category.toUpperCase()}</span>
              <h2>{featuredStory.title}</h2>
              <p>{featuredStory.summary && featuredStory.summary.substring(0, 150) + (featuredStory.summary.length > 150 ? '...' : '')}</p>
              <span className="text-link">Read the story <ArrowUpRight size={19}/></span>
              <small>By {featuredStory.authors ? featuredStory.authors.map((x:any)=>x.name).join(', ') : featuredStory.author}</small>
            </div>
          </Link>
          <button 
            onClick={(e) => handleShare(e, featuredStory.title, featuredStory.slug)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-background/80 hover:bg-background text-foreground p-2 sm:p-3 rounded-full backdrop-blur-sm shadow-sm transition-all z-10 hover:scale-105"
            aria-label="Share article"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
        </div>
      )}
      <div className="filter-bar">
        <div className="filter-options">
          {['All stories','Sustainable agriculture','Material science'].map(f=><Button key={f} variant={filter===f?'default':'ghost'} onClick={()=>setFilter(f)} aria-pressed={filter===f}>{f}</Button>)}
        </div>
        <label className="search-input">
          <Search size={17}/>
          <input aria-label="Search stories" placeholder="Search stories" value={query} onChange={e=>setQuery(e.target.value)}/>
        </label>
      </div>
      <div className="article-grid">
        {visible.map((a: any) => (
          <Link to="/blog/$slug" params={{slug:a.slug}} className="article-card relative" key={a.slug}>
            <div className="article-image relative">
              <img src={a.image} alt={a.title} width={600} height={400} loading="lazy"/>
              <button 
                onClick={(e) => handleShare(e, a.title, a.slug)}
                className="absolute top-3 right-3 bg-background/80 hover:bg-background text-foreground p-2 rounded-full backdrop-blur-sm shadow-sm transition-all z-10 hover:scale-105"
                aria-label="Share article"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
            </div>
            <div className="article-meta">
              <span>{a.category}</span>
              <span>By {a.authors ? a.authors.map((x:any)=>x.name).join(', ') : a.author}</span>
            </div>
            <h3>{a.title}</h3>
            {a.summary && <p className="text-muted-foreground text-[11px] mt-2 line-clamp-3 leading-relaxed">{a.summary}</p>}
            <span className="read-story">Read story <MoveRight size={17}/></span>
          </Link>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <Search size={30}/>
          <h2>No stories found</h2>
          <p>Try another topic or search term.</p>
          <Button variant="outline" onClick={()=>{setQuery('');setFilter('All stories')}}>Clear filters</Button>
        </div>
      )}
      <p className="editorial-note">Editorial perspectives on Ecovion’s areas of research. Illustrative photography.</p>
    </section>
  </>; 
}