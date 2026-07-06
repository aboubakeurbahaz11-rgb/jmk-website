import { Link } from 'react-router-dom';
import { FaFacebook, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-yellow-500/10 mt-auto">
      {/* Gold line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="JMK"
                className="w-14 h-14 object-contain rounded-full border border-yellow-500/20"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h3 className="text-2xl font-black gold-text">JMK</h3>
                <p className="text-white/50 text-xs">Jeunesse Mzab El Khroub</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              فريق شباب مزاب الخروب — التربية، الرياضة، الكفاءة
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.facebook.com/share/1CySPaU5QY/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600/40 transition-all hover:scale-110"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="https://wa.me/213773171283"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-600/40 transition-all hover:scale-110"
              >
                <FaWhatsapp size={16} />
              </a>
              <a
                href="mailto:Jeunessemzabeelkhroub25@gmail.com"
                className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-600/40 transition-all hover:scale-110"
              >
                <FaEnvelope size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-yellow-400 font-bold mb-5 text-lg">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { name: 'الصفحة الرئيسية', path: '/' },
                { name: 'الأخبار', path: '/news' },
                { name: 'المباريات', path: '/matches' },
                { name: 'معرض الصور', path: '/gallery' },
                { name: 'من نحن', path: '/about' },
                { name: 'انضم إلى الفريق', path: '/register' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-yellow-400 font-bold mb-5 text-lg">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FaPhone className="text-yellow-500 flex-shrink-0" size={14} />
                <a href="tel:+213773171283" className="hover:text-white transition-colors" dir="ltr">
                  +213 773 17 12 83
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FaEnvelope className="text-yellow-500 flex-shrink-0" size={14} />
                <a
                  href="mailto:Jeunessemzabeelkhroub25@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  Jeunessemzabeelkhroub25@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FaMapMarkerAlt className="text-yellow-500 flex-shrink-0 mt-0.5" size={14} />
                <span>الخروب، قسنطينة، الجزائر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {currentYear} JMK - شباب مزاب الخروب. جميع الحقوق محفوظة.
          </p>
          <Link to="/admin" className="text-white/20 hover:text-white/40 text-xs transition-colors">
            لوحة الإدارة
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
