import type {FC} from 'react';

const CheckIcon: FC<{className?: string}> = ({
  className = 'h-6 w-6 text-green-600',
}) => (
  <svg
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
  </svg>
);

export default CheckIcon;
