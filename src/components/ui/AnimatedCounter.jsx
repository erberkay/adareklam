import { useInView } from 'react-intersection-observer';
import { useCountUp } from '../../hooks/useCountUp';

export default function AnimatedCounter({ target, suffix = '', prefix = '', duration = 1500, className = '' }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const count = useCountUp(target, duration, inView);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString('tr-TR')}{suffix}
    </span>
  );
}
