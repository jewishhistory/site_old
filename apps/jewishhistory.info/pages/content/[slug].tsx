import React, { FC } from 'react';
import fs from 'fs';
import path from 'path';
import markdownIt from 'markdown-it';
import Link from 'next/link';

const PostPage: FC<{ content: string, meta: any }> = ({ content, meta }) => {
  const renderSubEntities = (entities, title) => {
    if (Array.isArray(entities) && entities.length) {
      return (
        <>
          <h2>{title}</h2>
          <ul>
            {entities.map(entity => (
              <li key={entity.code}>
                <Link href={`/content/${entity.code}/`}><a>{entity.name}</a></Link>
              </li>
            ))}
          </ul>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <h1>{meta.name}</h1>
      <div dangerouslySetInnerHTML={{__html: content}}/>
      <hr/>
      {renderSubEntities(meta.persons, 'Личности')}
      {renderSubEntities(meta.events, 'События')}
    </>
  );
}

export default PostPage;

const contentDir = './apps/jewishhistory.info/pages/content';

export async function getStaticProps({ params }) {
  const doc = getDocByFileName(params.slug);

  return {
    props: { content: doc.content, meta: doc.meta }
  };
}

export async function getStaticPaths() {
  const files = fs.readdirSync(contentDir)
    .filter((f) => f.match(/.md$/));

  return {
    paths: files.map(file => {
      return {
        params: {
          slug: file.replace('.md', '')
        }
      }
    }),
    fallback: false
  }
}

function getDocByFileName(filename) {
  const realSlug = filename.replace(/\.md$/, '');
  const fullPath = path.join(contentDir, `${realSlug}.md`);
  const metaPath = path.join(contentDir, `${realSlug}.json`);
  const content = fs.readFileSync(fullPath, 'utf8');
  const meta = JSON.parse(fs.readFileSync(metaPath, { encoding: 'utf8' }));

  if (meta.persons) {
    meta.persons = meta.persons.map(p => JSON.parse(fs.readFileSync(path.join(contentDir, `${p}.json`), { encoding: 'utf8' })));
  }

  if (meta.events) {
    meta.events = meta.events.map(p => JSON.parse(fs.readFileSync(path.join(contentDir, `${p}.json`), { encoding: 'utf8' })));
  }

  return { slug: realSlug, meta, content: markdownIt().renderInline(content) }

}
