import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  multiline = false,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  const Tag = multiline ? 'textarea' : 'input';

  return (
    <div className={`floating-label-group ${className}`}>
      <Tag
        ref={ref}
        placeholder=" "
        rows={multiline ? rows : undefined}
        {...props}
      />
      {label && <label>{label}</label>}
      <span className="floating-underline" />
      {error && (
        <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
