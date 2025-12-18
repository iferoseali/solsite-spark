import { ProjectData, PersonalityStyles } from "./types";

interface StorySectionProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const StorySection = ({ project, styles }: StorySectionProps) => {
  const chapters = [
    {
      number: 'Chapter I',
      title: 'The Beginning',
      text: project.description || `In the vast digital cosmos of Solana, a new force emerged. ${project.coinName || 'This coin'} was born from the collective dreams of degens and visionaries alike.`
    },
    {
      number: 'Chapter II',
      title: 'The Journey',
      text: `As word spread across the blockchain, believers gathered. Each holder became part of something greater—a movement that transcended mere transactions. ${project.ticker || '$TOKEN'} became a symbol of unity.`
    },
    {
      number: 'Chapter III',
      title: 'The Future',
      text: `The path ahead glows with promise. With diamond hands and unwavering conviction, the ${project.coinName || 'community'} marches toward the moon. This is not just a coin—it's a legacy.`
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          The Legend of {project.coinName || 'Your Coin'}
        </h2>
        <div className="space-y-8">
          {chapters.map((chapter, i) => (
            <div 
              key={i}
              className="p-8 rounded-2xl"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div 
                className="text-xs uppercase tracking-widest mb-2"
                style={{ color: styles.primary }}
              >
                {chapter.number}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {chapter.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {chapter.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
