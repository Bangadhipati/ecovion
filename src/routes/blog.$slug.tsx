import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { pageHead } from '@/lib/site-data';
import { getBlogBySlug } from '@/lib/firebase-db';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Route = createFileRoute('/blog/$slug')({ 
  loader: async ({params}) => {
    const article = await getBlogBySlug(params.slug);
    if(!article) throw notFound();
    return article;
  }, 
  head: ({loaderData}) => pageHead(loaderData?.title ?? 'Story unavailable', loaderData?.intro ?? 'This journal story could not be found.'), 
  component: Article 
});

function Article(){
  const article=Route.useLoaderData();
  
  // Backwards compatibility for multiple authors vs single author
  const authorsList = article.authors || [{ name: article.author, role: article.authorRole, image: article.authorImage, bio: article.authorBio }];

  // Join paragraphs back into a single markdown string
  const markdownContent = article.paragraphs?.join('\n\n') || '';

  return <article className="site-container article-detail">
    <Link to="/blog" className="text-link"><ArrowLeft size={17}/> Back to the journal</Link>
    <div className="article-title">
      <span className="eyebrow">{article.category}</span>
      <h1>{article.title}</h1>
      <span className="article-byline">By {authorsList.map((a: any) => a.name).join(', ')}</span>
    </div>
    <img className="article-cover" src={article.image} alt={article.title} width={1200} height={800}/>
    <div className="article-prose">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({node, ...props}) => <h2 className="text-primary font-bold text-2xl sm:text-3xl mt-12 mb-6" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-primary font-bold text-xl sm:text-2xl mt-8 mb-4" {...props} />,
          p: ({node, ...props}) => <p className="mb-6 last:mb-0" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="bg-primary/10 border-l-4 border-primary p-6 my-8 text-foreground/90 italic rounded-r-xl shadow-sm [&>p:last-child]:mb-0 [&>ul:last-child]:mb-0" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 last:mb-0" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 last:mb-0" {...props} />,
          li: ({node, ...props}) => <li className="pl-2" {...props} />,
          strong: ({node, ...props}) => <strong className="text-primary font-bold" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto mb-8"><table className="w-full text-left text-sm border-collapse" {...props} /></div>,
          thead: ({node, ...props}) => <thead className="bg-muted/50 border-b border-border" {...props} />,
          th: ({node, ...props}) => <th className="p-4 px-6 font-semibold border-b border-border" {...props} />,
          td: ({node, ...props}) => <td className="p-4 px-6 border-b border-border" {...props} />,
          a: ({node, ...props}) => <a className="text-primary underline hover:text-primary/80" {...props} />
        }}
      >
        {markdownContent}
      </ReactMarkdown>
      
      {/* Authors Section */}
      <div className="mt-16 pt-8 border-t border-border/50 flex flex-col gap-8">
        {authorsList.map((a: any, idx: number) => (
          <div key={idx} className="p-6 sm:p-8 bg-muted/50 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 border border-border/50">
            <img src={a.image} alt={a.name} className="w-20 h-20 rounded-full object-cover shrink-0 ring-4 ring-background shadow-sm" />
            <div>
              <h3 className="text-lg font-bold mb-1">{a.name}</h3>
              <span className="text-[11px] text-primary font-bold uppercase tracking-widest block mb-3">{a.role}</span>
              <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">{a.bio}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="article-end">
        <span className="eyebrow">KEEP EXPLORING</span>
        <h2>See the science in action.</h2>
        <Link to="/technology" className="text-link">Discover our technology <ArrowUpRight size={18}/></Link>
      </div>
    </div>
  </article>;
}