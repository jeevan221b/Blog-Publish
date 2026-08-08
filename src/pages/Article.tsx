import { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ArticleHeader } from '@/components/ArticleHeader';
import { ArticleContent } from '@/components/ArticleContent';
import { ArticleFooter } from '@/components/ArticleFooter';
import { TableOfContents } from '@/components/TableOfContents';
import { ReadingProgress } from '@/components/ReadingProgress';
import { PostNavigation } from '@/components/PostNavigation';
import { RelatedPosts } from '@/components/RelatedPosts';
import { NotFound } from './NotFound';
import {
  getPostBySlug,
  getAdjacentPosts,
  getRelatedPosts,
} from '@/lib/posts';
import { extractToc } from '@/lib/toc';

export function Article() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  const toc = useMemo(() => (post ? extractToc(post.content) : []), [post]);
  const { prev, next } = useMemo(
    () => (post ? getAdjacentPosts(post.slug) : { prev: null, next: null }),
    [post]
  );
  const related = useMemo(
    () => (post ? getRelatedPosts(post) : []),
    [post]
  );

  if (!post) {
    return <NotFound />;
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
            <ArticleFooter tags={post.tags} />
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
