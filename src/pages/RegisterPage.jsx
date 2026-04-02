import PageSEO from '../components/ui/PageSEO';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import Button from '../components/ui/Button';
import GradientBlob from '../components/ui/GradientBlob';
import useSiteSettingsStore from '../store/useSiteSettingsStore';
import { auth, db } from '../lib/firebase';

const schema = z.object({
  displayName: z.string().min(2, 'En az 2 karakter girin'),
  email: z.string().email('Geçerli e-posta girin'),
  password: z.string().min(6, 'En az 6 karakter'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Şifreler uyuşmuyor', path: ['confirmPassword'] });

export default function RegisterPage() {
  const navigate = useNavigate();
  const siteName = useSiteSettingsStore((s) => s.settings.siteName);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ displayName, email, password }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid, email, displayName, role: 'customer',
        createdAt: serverTimestamp(), lastLogin: serverTimestamp(),
      });
      toast.success('Hesap oluşturuldu!');
      navigate('/musteri');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') toast.error('Bu e-posta zaten kayıtlı.');
      else toast.error('Kayıt başarısız.');
    }
  };

  return (
    <PageTransition>
      <PageSEO title="Kayıt Ol" path="/kayit" noindex />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)', position: 'relative', overflow: 'hidden', padding: '2rem' }}>
        <GradientBlob size={500} opacity={0.08} x="80%" y="30%" />
        <GradientBlob size={400} opacity={0.06} x="20%" y="70%" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="glass-card"
          style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', position: 'relative', zIndex: 1 }}
        >
          <Link to="/" style={{ textDecoration: 'none', display: 'block', marginBottom: '2rem', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {siteName}
            </span>
          </Link>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Kayıt Ol</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Yeni hesap oluşturun</p>

          <GoogleLoginButton onSuccess={() => navigate('/musteri')} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>veya</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FloatInput label="Ad Soyad" error={errors.displayName?.message} {...register('displayName')} />
            <FloatInput label="E-posta" type="email" error={errors.email?.message} {...register('email')} />
            <FloatInput label="Şifre" type="password" error={errors.password?.message} {...register('password')} />
            <FloatInput label="Şifre Tekrar" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            <Button type="submit" loading={isSubmitting} variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
              Kayıt Ol
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Hesabınız var mı?{' '}
            <Link to="/giris" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Giriş Yap</Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}

function FloatInput({ label, error, ...rest }) {
  return (
    <div className="floating-label-group">
      <input placeholder=" " {...rest} />
      <label>{label}</label>
      <span className="floating-underline" />
      {error && <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}
