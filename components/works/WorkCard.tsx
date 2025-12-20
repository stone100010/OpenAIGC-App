'use client';

import { WorkListItem } from '@/types/work';
import { ImageWorkCard } from './ImageWorkCard';
import { VideoWorkCard } from './VideoWorkCard';
import { AudioWorkCard } from './AudioWorkCard';
import { TextWorkCard } from './TextWorkCard';

interface WorkCardProps {
  work: WorkListItem;
  priority?: boolean;
}

export function WorkCard({ work, priority = false }: WorkCardProps) {
  switch (work.contentType) {
    case 'image':
      return <ImageWorkCard work={work} priority={priority} />;
    case 'video':
      return <VideoWorkCard work={work} priority={priority} />;
    case 'audio':
      return <AudioWorkCard work={work} />;
    case 'text':
      return <TextWorkCard work={work} />;
    default:
      return <ImageWorkCard work={work} priority={priority} />;
  }
}
