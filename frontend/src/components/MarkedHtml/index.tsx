'use client';

import { marked } from 'marked';
import styles from './index.module.scss';

interface MarkedHtmlProps {
  markdownString?: string | null;
  height?: number;
}

const MarkedHtml: React.FC<MarkedHtmlProps> = ({ markdownString, height }) => {
  const htmlString = marked(markdownString || '');

  return (
    <div className={styles.container}>
      <div style={{ maxHeight: height }} dangerouslySetInnerHTML={{ __html: htmlString }} />
    </div>
  );
};

export default MarkedHtml;
