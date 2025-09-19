function ContactPage() {
  return (
    <div className="container-fluid py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold mb-3">Contact Us</h2>
        <p className="lead text-muted">
          Get in touch with our team for product inquiries, technical support, or business partnerships.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="contact-icon mb-3">📧</div>
              <h5 className="card-title fw-bold">Email Support</h5>
              <p className="card-text text-muted mb-3">
                Reach out to our technical team for product specifications and support
              </p>
              <a href="mailto:support@proplastics-demo.com" className="btn btn-outline-primary">
                support@proplastics-demo.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="contact-icon mb-3">📞</div>
              <h5 className="card-title fw-bold">Phone Support</h5>
              <p className="card-text text-muted mb-3">
                Speak directly with our sales team for immediate assistance
              </p>
              <a href="tel:+15551234567" className="btn btn-outline-primary">
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="contact-icon mb-3">📍</div>
              <h5 className="card-title fw-bold">Visit Our Facility</h5>
              <p className="card-text text-muted mb-3">
                Tour our manufacturing facility and see our quality processes
              </p>
              <address className="mb-0">
                <strong>Professional Plastics</strong><br />
                123 Industrial Way, Suite 100<br />
                Anaheim, CA 92805
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-bold">🕒 Business Hours</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-semibold">Sales & Support</h6>
                  <ul className="list-unstyled mb-0">
                    <li><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM PST</li>
                    <li><strong>Saturday:</strong> 9:00 AM - 2:00 PM PST</li>
                    <li><strong>Sunday:</strong> Closed</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-semibold">Emergency Support</h6>
                  <p className="text-muted mb-0">
                    For urgent technical issues outside business hours, 
                    please email us and we'll respond within 4 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Simple Contact Form */}
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 fw-bold">📬 Send us a message</h5>
            </div>
            <div className="card-body">
              <form className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Name</label>
                  <input className="form-control" placeholder="Your name" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="you@example.com" />
                </div>
                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea rows="4" className="form-control" placeholder="How can we help?" />
                </div>
                <div className="col-12 d-grid d-md-flex gap-3">
                  <button type="button" className="btn btn-primary px-4">Send Message</button>
                  <button type="reset" className="btn btn-outline-secondary px-4">Clear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;


