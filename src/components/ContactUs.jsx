import  { useState } from "react";
import { FaLeaf, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaQuestionCircle } from "react-icons/fa";
import Footer from "./Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Valid email is required";
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim()) errs.message = "Message cannot be empty";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
    } else {
      console.log("Send to backend:", formData);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-light d-flex flex-column">
        <h1 className="text-center mt-4 text-success">
                  <FaLeaf className="me-2" />
                  Contact Us
                </h1>
      <div className="container py-5 flex-grow-1">
        <div className="row">
          {/* Info Panel */}
          <div className="col-lg-5 mb-4">
            <div className="card bg-black border-success shadow-lg">
              <div className="card-body p-4">
                <h3 className="text-success mb-3"><FaLeaf className="me-2 text-warning"/>Get in Touch</h3>
                <p className="text-success">We’d love to hear from you. Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.</p>
                <hr className="border-success" />
                <ul className="list-unstyled text-success">
                  <li className="mb-3"><FaPhoneAlt className="me-2"/>+254 113 252660</li>
                  <li className="mb-3"><FaEnvelope className="me-2"/>support@smartfarm.com</li>
                  <li className="mb-3"><FaMapMarkerAlt className="me-2"/> Nairobi, Kenya</li>
                  <li className="mb-3"><FaClock className="me-2"/>Mon - Fri: 8am - 6pm</li>
                </ul>

                <h5 className="text-warning mt-4"><FaQuestionCircle className="me-2"/>FAQs</h5>
                <div className="accordion accordion-flush" id="faqAccordion">
                  {[
                    { q: "How do I start a farm?", a: "You can start by assessing your land and choosing the right crops." },
                    { q: "What services do you offer?", a: "We provide weather forecasting, crop monitoring, and advisory services." },
                    { q: "Can I integrate with my existing dashboard?", a: "Yes, our APIs allow easy integration with your systems." }
                  ].map((item, idx) => (
                    <div className="accordion-item bg-dark border-success" key={idx}>
                      <h2 className="accordion-header" id={`heading${idx}`}>
                        <button className="accordion-button collapsed bg-black text-success" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`} aria-expanded="false" aria-controls={`collapse${idx}`}>
                          {item.q}
                        </button>
                      </h2>
                      <div id={`collapse${idx}`} className="accordion-collapse collapse" aria-labelledby={`heading${idx}`} data-bs-parent="#faqAccordion">
                        <div className="accordion-body text-light bg-black border-top border-success">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="col-lg-7">
            <div className="card bg-black border-success shadow-lg">
              <div className="card-body p-4">
                <h3 className="text-success mb-4">Suggestion!?</h3>

                {submitted ? (
                  <div className="alert alert-success" role="alert">
                    Thank you, {formData.name}! Your message has been sent.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {[
                      { name: 'name', label: 'Name' },
                      { name: 'email', label: 'Email' },
                      { name: 'subject', label: 'Subject' }
                    ].map((field) => (
                      <div className="mb-3" key={field.name}>
                        <label className="form-label text-success">{field.label}</label>
                        <input
                          type={field.name === 'email' ? 'email' : 'text'}
                          name={field.name}
                          className={`form-control bg-dark text-success border-${field.name in errors ? 'danger' : 'success'}`}
                          value={formData[field.name]}
                          onChange={handleChange}
                        />
                        {errors[field.name] && <div className="text-danger mt-1">{errors[field.name]}</div>}
                      </div>
                    ))}

                    <div className="mb-3">
                      <label className="form-label text-success">Message</label>
                      <textarea
                        name="message"
                        rows="5"
                        className={`form-control bg-dark text-success border-${errors.message ? 'danger' : 'success'}`}
                        value={formData.message}
                        onChange={handleChange}
                      />
                      {errors.message && <div className="text-danger mt-1">{errors.message}</div>}
                    </div>

                    <button type="submit" className="btn btn-success me-2">
                      Send Message
                    </button>
                    <button type="reset" className="btn btn-warning" onClick={() => { setFormData({ name: '', email: '', subject: '', message: '' }); setErrors({}); }}>
                      Reset
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

       
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
