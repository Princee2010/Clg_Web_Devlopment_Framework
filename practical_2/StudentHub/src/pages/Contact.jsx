import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");

  return (
    <section className="page" aria-labelledby="contact-heading">
      <h1 id="contact-heading">Contact</h1>
      <p>Contact me</p>

      <label htmlFor="message">Message</label>
      <input
        id="message"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message"
      />
      <p className="char-count" aria-live="polite">
        Character count: {message.length}
      </p>
    </section>
  );
}

export default Contact;
