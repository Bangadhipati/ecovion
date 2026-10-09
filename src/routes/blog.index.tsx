import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, Search, MoveRight } from 'lucide-react';
import { PageIntro } from '@/components/site-shell';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/site-data';
import { getBlogs } from '@/lib/firebase-db';

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
        <Link to="/blog/$slug" params={{slug:featuredStory.slug}} className="featured-story">
          <img src={featuredStory.image} alt="Featured article image" width={1024} height={1024}/>
          <div>
            <span className="eyebrow">FEATURED STORY · {featuredStory.category.toUpperCase()}</span>
            <h2>{featuredStory.title}</h2>
            <p>{featuredStory.summary && featuredStory.summary.substring(0, 150) + (featuredStory.summary.length > 150 ? '...' : '')}</p>
            <span className="text-link">Read the story <ArrowUpRight size={19}/></span>
            <small>By {featuredStory.authors ? featuredStory.authors.map((x:any)=>x.name).join(', ') : featuredStory.author}</small>
          </div>
        </Link>
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
          <Link to="/blog/$slug" params={{slug:a.slug}} className="article-card" key={a.slug}>
            <div className="article-image">
              <img src={a.image} alt={a.title} width={600} height={400} loading="lazy"/>
              <span className="article-arrow"><ArrowUpRight size={20}/></span>
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