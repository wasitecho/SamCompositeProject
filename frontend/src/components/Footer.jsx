import { motion } from 'framer-motion';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const linkVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <motion.footer 
      className="bg-gradient-to-r from-secondary-800 to-secondary-900 text-white w-full py-12 mt-auto"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            className="col-span-1 md:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <motion.span 
                className="text-3xl mr-3"
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ duration: 0.3 }}
              >
                🏭
              </motion.span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Sam Composite
              </h3>
            </div>
            <p className="text-secondary-300 text-sm leading-relaxed">
              Your trusted partner for industrial plastic solutions. 
              Quality materials, reliable service, exceptional results.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-primary-300">Quick Links</h4>
            <ul className="space-y-2">
              {['Products', 'Sheets', 'Categories', 'Contact'].map((item, index) => (
                <motion.li key={item} variants={linkVariants} whileHover="hover">
                  <a 
                    href={`/${item.toLowerCase()}`} 
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-300 text-sm"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-primary-300">Services</h4>
            <ul className="space-y-2">
              {['Full Sheets', 'Cut-to-Size', 'Custom Solutions', 'Quotations'].map((item, index) => (
                <motion.li key={item} variants={linkVariants} whileHover="hover">
                  <span className="text-secondary-300 text-sm">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-primary-300">Contact</h4>
            <div className="space-y-2 text-sm text-secondary-300">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@samcomposite.com</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Industrial Area, Mumbai, India</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-secondary-700 mt-8 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm mb-4 sm:mb-0">
              © {currentYear} Sam Composite. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <motion.a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-300 text-sm"
                variants={linkVariants}
                whileHover="hover"
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-300 text-sm"
                variants={linkVariants}
                whileHover="hover"
              >
                Terms of Service
              </motion.a>
              <motion.a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-300 text-sm"
                variants={linkVariants}
                whileHover="hover"
              >
                Support
              </motion.a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-secondary-500 text-xs">
              Industrial-grade plastics for professional applications • Built with modern web technologies
            </p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default Footer;