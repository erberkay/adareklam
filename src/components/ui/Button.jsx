import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-ghost';

  const sizeStyles = {
    sm: { padding: '8px 20px', fontSize: '0.8rem' },
    md: {},
    lg: { padding: '18px 48px', fontSize: '1rem' },
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={`${baseClass} ${className}`}
      style={sizeStyles[size]}
      disabled={disabled || loading}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
