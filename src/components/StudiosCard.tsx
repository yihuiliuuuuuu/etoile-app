import React from 'react';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { StudioBar } from './StudioBar';
import { Studio } from '../types';

interface StudiosCardProps {
  studios: Studio[];
}

export const StudiosCard: React.FC<StudiosCardProps> = ({ studios }) => (
  <Card>
    <SectionHeader icon="😊" title="Studios Attended" actionLabel="View" />
    <StudioBar studios={studios} />
  </Card>
);
