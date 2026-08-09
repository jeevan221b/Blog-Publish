import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ArticleHeader } from '@/components/ArticleHeader';
import { ArticleContent } from '@/components/ArticleContent';
import { ArticleFooter } from '@/components/ArticleFooter';
import { TableOfContents } from '@/components/TableOfContents';
import { ReadingProgress } from '@/components/ReadingProgress';
import { PostNavigation } from '@/components/PostNavigation';
import { RelatedPosts } from '@/components/RelatedPosts';
import { LoadingState, ErrorState } from '@/components/PageState';
import { NotFound } from './NotFound';
import {
  getPostBySlug,
  getAllPosts,
  getAdjacentPosts,
  getRelatedPosts,
  PostNotFoundError,
} from '@/lib/posts';
import { extractToc } from '@/lib/toc';
import type { BlogPost } from '@/types/post';

type Status = 'loading' | 'ready' | 'error' | 'not-found';

export function Article() {
  const { slug } = useParams<{ slug: string }>();
  const articleRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setStatus('not-found');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    Promise.all([getPostBySlug(slug), getAllPosts()])
      .then(([postData, posts]) => {
        if (cancelled) return;
        setPost(postData);
        setAllPosts(posts);
        setStatus('ready');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof PostNotFoundError) {
          setStatus('not-found');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load post.');
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  const toc = useMemo(() => (post ? extractToc(post.content) : []), [post]);
  const { prev, next } = useMemo(
    () => (post ? getAdjacentPosts(allPosts, post.slug) : { prev: null, next: null }),
    [post, allPosts]
  );
  const related = useMemo(
    () => (post ? getRelatedPosts(allPosts, post, 3) : []),
    [post, allPosts]
  );

  if (status === 'not-found') {
    return <NotFound />;
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-24">
        <LoadingState label="Loading article" />
      </div>
    );
  }

  if (status === 'error' || !post) {
    return (
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-24">
        <ErrorState message={error ?? undefined} />
      </div>
    );
  }

  return (
    <div ref={articleRef}>
      <ReadingProgress targetRef={articleRef} />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm mt-6 mb-2"
          style={{ color: 'var(--text-faint)' }}
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>
      </div>

      <ArticleHeader post={post} />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_200px] gap-10 xl:gap-16">
          <article className="min-w-0 max-w-[760px]">
            <div className="lg:hidden mb-8">
              <TableOfContents items={toc} variant="mobile" />
            </div>

            <ArticleContent content={post.content} />
            <ArticleFooter />
          </article>

          <TableOfContents items={toc} variant="desktop" />
        </div>

        <div className="max-w-[760px] mt-14 space-y-10 pb-20">
          <PostNavigation prev={prev} next={next} />
          <RelatedPosts posts={related} />
        </div>
      </div>
    </div>
  );
}
