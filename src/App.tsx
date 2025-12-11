import { Layout } from './components/Layout';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Education } from './components/sections/Education';
import { Volunteering } from './components/sections/Volunteering';
import { Projects } from './components/sections/Projects';
import { Awards } from './components/sections/Awards';
import { Certifications } from './components/sections/Certifications';
import { Memberships } from './components/sections/Memberships';

function App() {
  return (
    <Layout>
      <About />
      <Experience />
      <Education />
      <Volunteering />
      <Projects />
      <Awards />
      <Certifications />
      <Memberships />
    </Layout>
  );
}

export default App;
