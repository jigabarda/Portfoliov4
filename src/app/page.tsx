import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import { ProjectDrawerProvider } from "@/components/project/ProjectDrawer";
import ExperienceStrip from "@/components/sections/ExperienceStrip";
import Hero from "@/components/sections/Hero";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
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
      </main>
      <Footer />
      <RevealObserver />
    </ProjectDrawerProvider>
  );
}
