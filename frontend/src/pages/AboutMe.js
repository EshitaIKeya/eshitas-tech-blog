function AboutMe() {
  return (
    <div className="about-me">
      <h2>About Me</h2>
      <div className="about-content">
        <p>
          Hi! I'm <strong>Eshita Islam</strong>, a software engineering student
          and intern at Apurba Technologies Inc. I'm passionate about backend
          development, web technologies, and learning in public.
        </p>
        <p>
          I built this blog from scratch as a learning project to understand
          full-stack web development. The backend is powered by
          <strong> FastAPI</strong> with <strong>PostgreSQL</strong>, and the
          frontend uses <strong>React</strong>. Everything runs in
          <strong> Docker</strong> containers.
        </p>
        <h3>What I Write About</h3>
        <p>
          I share my journey learning programming, web development, databases,
          and software engineering concepts. If you're a beginner like me, I
          hope my posts help you understand things in simple terms.
        </p>
        <h3>Tech I Work With</h3>
        <p>
          Python, FastAPI, PostgreSQL, SQLAlchemy, React, JavaScript, Docker,
          Git, and VS Code. Always learning more.
        </p>
        <h3>Connect</h3>
        <p>
          Find me on{" "}
          <a
            href="https://www.linkedin.com/in/eshita-islam-keya-5504b230a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>{" "}
          or{" "}
          <a
            href="https://github.com/EshitaIKeya"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default AboutMe;
