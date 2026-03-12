import type {FC} from 'react';

const CloseIcon: FC<{className?: string}> = ({className = 'h-5 w-5'}) => (
  <svg
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
);

export default CloseIcon;
