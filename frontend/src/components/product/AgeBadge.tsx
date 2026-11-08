import React from 'react';
import { AgeGroup } from '../../types';
import { getAgeBadgeStyles } from '../../lib/utils';

interface AgeBadgeProps {
  ageGroup: AgeGroup | string;
  size?: 'sm' | 'md';
}

export const AgeBadge: React.FC<AgeBadgeProps> = ({ ageGroup, size = 'sm' }) => {
  const styles = getAgeBadgeStyles(ageGroup);
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses}`}
    >
      {ageGroup}
    </span>
  );
};

