import { ProjectData, PersonalityStyles } from "./types";

interface AboutSectionProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const AboutSection = ({ project, styles }: AboutSectionProps) => {
  if (!project.description) return null;

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          className="text-4xl md:text-5xl font-bold text-white mb-8"
        >
          About {project.coinName || 'Us'}
        </h2>
        <p className="text-lg md:text-xl text-white/60 leading-relaxed">
          {project.description}
        </p>
      </div>
    </section>
  );
};
