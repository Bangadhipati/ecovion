export default async function handler(req, res) {
  const { slug } = req.query;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  
  // 1. Fetch the default index.html from our own deployment
  const indexUrl = `${protocol}://${host}/`;
  let html = '';
  try {
    const htmlRes = await fetch(indexUrl);
    html = await htmlRes.text();
  } catch(e) {
    return res.status(500).send('Failed to load base HTML');
  }

  // 2. Fetch blog from Firebase via REST API
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    // If not configured, just return the default HTML
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html); 
  }

  try {
    const query = {
      structuredQuery: {
        from: [{ collectionId: 'blogs' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'slug' },
            op: 'EQUAL',
            value: { stringValue: slug }
          }
        },
        limit: 1
      }
    };

    const fbRes = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });
    
    const data = await fbRes.json();
    
    if (data && data[0] && data[0].document) {
      const doc = data[0].document.fields;
      const title = doc.title?.stringValue || 'Ecovion Journal';
      const summary = doc.summary?.stringValue || doc.intro?.stringValue || '';
      const image = doc.image?.stringValue || '';
      
      const fullTitle = `${title} | Ecovion`;
      
      // Inject new Metadata
      html = html.replace(/<title.*?>.*?<\/title>/i, `<title>${fullTitle}</title>`);
      html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${fullTitle}" />`);
      html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${fullTitle}" />`);
      
      if (summary) {
        html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${summary}" />`);
        html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${summary}" />`);
        html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${summary}" />`);
      }
      
      if (image) {
        html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${image}" />`);
        html = html.replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${image}" />`);
      }
    }
  } catch (e) {
    console.error('Firebase preview error:', e);
  }

  // 3. Return the modified HTML!
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); 
  res.status(200).send(html);
}
