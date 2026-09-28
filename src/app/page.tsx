import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import { ProjectDrawerProvider } from "@/components/project/ProjectDrawer";
import About from "@/components/sections/About";
import ExperienceStrip from "@/components/sections/ExperienceStrip";
import Hero from "@/components/sections/Hero";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import ServicesBand from "@/components/sections/ServicesBand";
import Testimonial from "@/components/sections/Testimonial";
import Toolkit from "@/components/sections/Toolkit";
import RevealObserver from "@/components/ui/RevealObserver";
import { featuredProjects } from "@/content/projects";

export default function Page() {
  return (
    <ProjectDrawerProvider projects={featuredProjects}>
      <Nav />
      <main>
        <Hero />
        <ExperienceStrip />
        <Projects />
        <Services />
        <Process />
        <About />
        <Toolkit />
        <ServicesBand />
        <Testimonial />
      </main>
      <Footer />
      <RevealObserver />
    </ProjectDrawerProvider>
  );
}
