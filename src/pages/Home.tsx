import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NexusStatus } from '@/components/NexusStatus';
import { FeaturedPost } from '@/components/FeaturedPost';
import { LoadingState, ErrorState } from '@/components/PageState';
import { getAllPosts, getFeaturedPost } from '@/lib/posts';
import type { BlogPost } from '@/types/post';

export function Home() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAllPosts()
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load posts.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = posts ? getFeaturedPost(posts) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start pt-14 sm:pt-20 pb-16">
        <div>
          <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>
            SOFTWARE ENGINEER · SELF-HOSTER
          </p>
          <h1
            className="font-display font-bold text-4xl sm:text-5xl leading-[1.08] mb-5"
            style={{ color: 'var(--text)' }}
          >
            Raj Diwakar
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-lg mb-4" style={{ color: 'var(--text-muted)' }}>
            I build small, slightly stubborn systems — bots, home servers, and
            the occasional microcontroller — and write about what breaks
            along the way.
          </p>
          <p className="text-base sm:text-lg leading-relaxed max-w-lg mb-8" style={{ color: 'var(--text-muted)' }}>
            This site itself is one of those systems: self-hosted off a phone
            in my room, written up over on the blog along with everything
            else I tinker with.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--color-accent)', color: '#0b0d10' }}
            >
              Read the blog
              <ArrowRight size={15} />
            </Link>
            <a
              href="#latest"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Latest post
            </a>
          </div>
        </div>

        <NexusStatus />
      </section>

      <section id="latest" className="py-14 border-t scroll-mt-24" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-faint)' }}>
            LATEST POST
          </p>
          <Link
            to="/blog"
            className="text-sm font-medium"
            style={{ color: 'var(--color-accent)' }}
          >
            See all posts
          </Link>
        </div>
        {error ? (
          <ErrorState message={error} />
        ) : !posts ? (
          <LoadingState label="Loading latest post" />
        ) : featured ? (
          <FeaturedPost post={featured} />
        ) : null}
      </section>
    </div>
  );
}
