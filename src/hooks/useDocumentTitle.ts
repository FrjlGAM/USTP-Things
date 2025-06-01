import { useEffect, useRef } from 'react';

interface DocumentTitleOptions {
  /**
   * The prefix to add before the title (e.g., 'My App | ')
   */
  prefix?: string;
  
  /**
   * The suffix to add after the title (e.g., ' | My App')
   */
  suffix?: string;
  
  /**
   * Whether to include the title in the format: 'Title - Site Name' (default: true)
   */
  includeSiteName?: boolean;
  
  /**
   * The site name to use (default: document.title or 'Site Name')
   */
  siteName?: string;
  
  /**
   * The separator to use between title and site name (default: ' - ')
   */
  separator?: string;
  
  /**
   * Whether to restore the previous title when the component unmounts (default: true)
   */
  restoreOnUnmount?: boolean;
}

/**
 * A hook to manage the document title and meta tags
 * 
 * @param {string} title - The title to set
 * @param {DocumentTitleOptions} options - Configuration options
 */
export function useDocumentTitle(
  title: string,
  options: DocumentTitleOptions = {}
): void {
  const {
    prefix = '',
    suffix = '',
    includeSiteName = true,
    siteName: customSiteName,
    separator = ' - ',
    restoreOnUnmount = true,
  } = options;
  
  const defaultSiteName = typeof document !== 'undefined' 
    ? document.title 
    : 'Site Name';
  
  const siteName = customSiteName || defaultSiteName;
  const previousTitleRef = useRef<string>('');
  
  // Store the original title on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      previousTitleRef.current = document.title;
    }
    
    return () => {
      if (restoreOnUnmount && typeof document !== 'undefined') {
        document.title = previousTitleRef.current;
      }
    };
  }, [restoreOnUnmount]);
  
  // Update the document title
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    let newTitle = '';
    
    // Add prefix if provided
    if (prefix) {
      newTitle += prefix;
    }
    
    // Add the main title
    newTitle += title;
    
    // Add site name if enabled
    if (includeSiteName && siteName) {
      // Only add separator if there's content before it
      if (newTitle) {
        newTitle += separator + siteName;
      } else {
        newTitle = siteName;
      }
    }
    
    // Add suffix if provided
    if (suffix) {
      newTitle += suffix;
    }
    
    // Update the document title
    document.title = newTitle;
  }, [title, prefix, suffix, includeSiteName, siteName, separator]);
}

// Example usage:
/*
function ProductPage({ product }) {
  // Simple usage
  useDocumentTitle(product.name);
  
  // With options
  useDocumentTitle(product.name, {
    prefix: 'Buy ',
    suffix: ' | Best Deals',
    includeSiteName: true,
    siteName: 'My Awesome Store',
    separator: ' | ',
    restoreOnUnmount: true,
  });
  
  return (
    <div>
      <h1>{product.name}</h1>
      {/* ... */}
    </div>
  );
}
*/

// Meta tags management
interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

/**
 * A hook to manage meta tags in the document head
 * 
 * @param {MetaTag[]} tags - An array of meta tags to update
 * @param {boolean} removeOnUnmount - Whether to remove the meta tags when the component unmounts (default: true)
 */
export function useMetaTags(tags: MetaTag[], removeOnUnmount: boolean = true): void {
  const addedTags = useRef<HTMLMetaElement[]>([]);
  
  // Update meta tags
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const head = document.head;
    const newTags: HTMLMetaElement[] = [];
    
    // Add or update each meta tag
    tags.forEach(tag => {
      let meta: HTMLMetaElement | null = null;
      
      // Try to find existing meta tag
      if (tag.name) {
        meta = document.querySelector(`meta[name="${tag.name}"]`);
      } else if (tag.property) {
        meta = document.querySelector(`meta[property="${tag.property}"]`);
      }
      
      // Create new meta tag if it doesn't exist
      if (!meta) {
        meta = document.createElement('meta');
        
        if (tag.name) {
          meta.setAttribute('name', tag.name);
        } else if (tag.property) {
          meta.setAttribute('property', tag.property);
        }
        
        head.appendChild(meta);
        newTags.push(meta);
      }
      
      // Update content
      meta.setAttribute('content', tag.content);
    });
    
    // Store references to added tags for cleanup
    addedTags.current = [...addedTags.current, ...newTags];
    
    // Cleanup function
    return () => {
      if (removeOnUnmount) {
        newTags.forEach(tag => {
          if (tag.parentNode === head) {
            head.removeChild(tag);
          }
        });
        
        // Remove from addedTags ref
        addedTags.current = addedTags.current.filter(tag => !newTags.includes(tag));
      }
    };
  }, [tags, removeOnUnmount]);
  
  // Cleanup all added tags on unmount if needed
  useEffect(() => {
    return () => {
      if (removeOnUnmount && addedTags.current.length > 0) {
        const head = document.head;
        addedTags.current.forEach(tag => {
          if (tag.parentNode === head) {
            head.removeChild(tag);
          }
        });
        addedTags.current = [];
      }
    };
  }, [removeOnUnmount]);
}

// Example usage:
/*
function SEO({ title, description, image, url, type = 'website' }) {
  // Set document title
  useDocumentTitle(title, {
    includeSiteName: true,
    siteName: 'My Awesome Site',
  });
  
  // Set meta tags
  useMetaTags([
    // Standard meta tags
    { name: 'description', content: description },
    
    // Open Graph / Facebook
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]);
  
  // Canonical URL
  useLinkTag({
    rel: 'canonical',
    href: url,
  });
  
  return null; // This is a head-only component
}
*/
