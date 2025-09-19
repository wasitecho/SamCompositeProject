function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light w-100 py-4">
      <div className="container-fluid px-3 px-md-4 py-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h5 className="fw-bold mb-3 mb-md-5 d-flex align-items-center">
              <span className="me-2">🏭</span>
              Professional Plastics
            </h5>
            <p className="text-grey mb-0">
              Your trusted partner for industrial plastic solutions. 
              Quality materials, reliable service, exceptional results.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-grey mb-2">
              © {currentYear} Professional Plastics Demo. All rights reserved.
            </p>
            <p className="text-grey mb-0 small">
              Industrial-grade plastics for professional applications
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
