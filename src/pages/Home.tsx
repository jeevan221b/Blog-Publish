import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NexusStatus } from '@/components/NexusStatus';
import { FeaturedPost } from '@/components/FeaturedPost';
import { getFeaturedPost } from '@/lib/posts';

export function Home() {
  const featured = getFeaturedPost();

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
          <p className="text-base sm:text-lg leading-relaxed max-w-lg mb-8" style={{ color: 'var(--text-muted)' }}>
            I build small, slightly stubborn systems — bots, home servers, and
            the occasional microcontroller — and write about what breaks
            along the way.
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
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              View projects
            </a>
          </div>
        </div>

        <NexusStatus />
      </section>

      <section id="experience" className="py-14 border-t scroll-mt-24" style={{ borderColor: 'var(--border)' }}>
        <p className="font-mono text-xs tracking-widest mb-6" style={{ color: 'var(--text-faint)' }}>
          EXPERIENCE
        </p>
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Experience details are coming to the full portfolio soon. In the
            meantime, the blog is a decent proxy for what I've actually been
            doing.
          </p>
        </div>
      </section>

      <section id="projects" className="py-14 border-t scroll-mt-24" style={{ borderColor: 'var(--border)' }}>
        <p className="font-mono text-xs tracking-widest mb-6" style={{ color: 'var(--text-faint)' }}>
          FEATURED PROJECT
        </p>
        {featured && <FeaturedPost post={featured} />}
      </section>
    </div>
  );
}
