import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUploadCloud, FiShare2, FiShield, FiFolder, FiDownload, FiEdit3 } from 'react-icons/fi';

const Landing = () => {
  const { user } = useAuth();

  const features = [
    { icon: <FiUploadCloud />, title: 'Upload Files', desc: 'Securely upload files to AWS cloud storage' },
    { icon: <FiShare2 />, title: 'Share Instantly', desc: 'Generate share links with one click' },
    { icon: <FiShield />, title: 'Privacy Control', desc: 'Set files as private or public' },
    { icon: <FiFolder />, title: 'Manage Files', desc: 'View, organize, and track your files' },
    { icon: <FiDownload />, title: 'Easy Downloads', desc: 'Download files anytime, anywhere' },
    { icon: <FiEdit3 />, title: 'Rename Files', desc: 'Rename files without re-uploading' },
  ];

  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Cloud File Sharing
            <span className="hero-accent"> Made Simple</span>
          </h1>
          <p className="hero-subtitle">
            Upload, manage, and share your files securely with AWS-powered cloud storage.
            Fast, reliable, and easy to use.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="hero-register-btn">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg" id="hero-login-btn">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob"></div>
          <div className="hero-card-stack">
            <div className="hero-card hc-1">📄 report.pdf</div>
            <div className="hero-card hc-2">🖼️ photo.jpg</div>
            <div className="hero-card hc-3">📊 data.xlsx</div>
          </div>
        </div>
      </section>

      <section className="features" id="features-section">
        <h2 className="section-title">Everything You Need</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
