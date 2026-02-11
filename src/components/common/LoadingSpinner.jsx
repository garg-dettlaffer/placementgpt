import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-primary-200 dark:border-dark-700 border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {message && (
        <p className="text-sm text-dark-600 dark:text-dark-400 font-medium">
          {message}
        </p>
      )}
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" message="Loading..." />
    </div>
  );
}

export function InlineSpinner() {
  return <LoadingSpinner size="sm" message="" />;
}
