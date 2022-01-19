import React, { FC } from 'react';
import Link from 'next/link';
import { Entity } from 'types/entities';
import { getAllDocs, getDocByFileName } from '../../utils/docs';
import { displayYear } from '../../utils/dates';

const PostPage: FC<{ content: string, meta: Entity }> = ({ content, meta }) => {
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
      {meta.type === 'event' && <div>{displayYear(meta.date_start)}</div>}
      <hr/>
      <div dangerouslySetInnerHTML={{__html: content}}/>
      <hr/>
      {meta.type === 'era' || meta.type === 'event' && renderSubEntities(meta.persons, 'Личности')}
      {meta.type === 'era' && renderSubEntities(meta.events, 'События')}
    </>
  );
}

export default PostPage;

export async function getStaticProps({ params }) {
  try {
    const doc = getDocByFileName(params.slug);
    return {
      props: { content: doc.content, meta: doc.meta }
    };
  } catch {
    return {
      props: { content: '', meta: {} },
    };
  }
}

export async function getStaticPaths() {
  try {
    const files = getAllDocs();

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
  } catch {
    return { paths: [], fallback: false };
  }
}
