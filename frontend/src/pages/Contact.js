function Contact() {
  return (
    <div className="contact">
      <h2>Contact Me</h2>
      <div className="contact-content">
        <p>Want to reach out? Here are the best ways to contact me:</p>

        <div className="contact-card">
          <h3>Email</h3>
          <a href="mailto:eshita.isk@gmail.com">eshita.isk@gmail.com</a>
        </div>

        <div className="contact-card">
          <h3>LinkedIn</h3>
          <a
            href="https://www.linkedin.com/in/eshita-islam-keya-5504b230a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eshita Islam Keya
          </a>
        </div>

        <div className="contact-card">
          <h3>GitHub</h3>
          <a
            href="https://github.com/EshitaIKeya"
            target="_blank"
            rel="noopener noreferrer"
          >
            EshitaIKeya
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
