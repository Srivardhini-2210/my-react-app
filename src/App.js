import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div>
      <header>
        <div id="name">Sri Vardhini</div>
        <nav>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Project Details</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#recommendations">Recommendations</a></li>
          </ul>
        </nav>
       
      </header>

      <section id="about">
       
        <h2>About Me</h2>
        <p>Hello! I'm Sri Vardhini, a Computer Science student passionate about web development and design. I love creating digital experiences and learning new technologies.</p>
      </section>
 <section id="skills">
        <h2>Skills</h2>
        <div className="skill">
         
          <p>HTML</p>
        </div>
        <div className="skill">
          
          <p>CSS</p>
        </div>
        <div className="skill">
          
          <p>JavaScript</p>
        </div>
      </section>

      <section id="projects">
        <h2>Projects</h2>
        <ul>
          <li><strong>My Productivity Hub:</strong> A to-do list with Pomodoro timer and motivational quotes.</li>
          <li><strong>Campus Event Portal:</strong> Web portal for event registration with live countdown and certificates.</li>
          <li><strong>PhishDefender:</strong> A phishing detection web app using lightweight ML.</li>
        </ul>
      </section>

      <section id="recommendations">
        <h2>Recommendations</h2>
        <ul id="recommendation-list">
          <li>Sri is a very creative and dedicated developer!</li>
          <li>She always brings fresh ideas to every project.</li>
          <li>A quick learner who works well in teams!</li>
        </ul>
      </section>
    </div>
  
  );
}

export default App;
