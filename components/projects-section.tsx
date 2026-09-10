"use client";

import {ArrowRight} from "lucide-react";
import Image from "next/image";
import {Reveal} from "@/components/reveal";
import {SectionHeading} from "@/components/section-heading";
import type {ProjectsContent} from "@/lib/projects";

export function ProjectsSection({
  copy,
  locale,
  limit = 2,
  showViewAll = true,
}: {
  copy: ProjectsContent;
  locale: "fa" | "en";
  limit?: number;
  showViewAll?: boolean;
}) {
  const published = copy.projects.filter((p) => p.published);
  const projects = published.slice(0, limit);

  if (!projects.length) return null;

  return (
    <section className="section projects" id="projects">
      <div className="shell">
        <Reveal>
          <SectionHeading
            align="center"
            label={copy.label}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        <div className="projects__grid">
          {projects.map((project, index) => (
            <Reveal className="project-card" delay={index * 0.08} key={project.slug}>
              <article className="project-card__inner">
                <div className="project-card__media">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1080px) 50vw, 33vw"
                    className="project-card__image"
                    loading="lazy"
                  />
                  <div className="project-card__overlay">
                    {project.category && (
                      <span className="project-card__category">{project.category}</span>
                    )}
                    {project.year && (
                      <span className="project-card__year">{project.year}</span>
                    )}
                  </div>
                </div>
                <div className="project-card__content">
                  <h3>{project.title}</h3>
                  <p>{project.shortDescription}</p>
                  <div className="project-card__meta">
                    {project.client && (
                      <span className="project-card__client">{project.client}</span>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="project-card__tech">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="project-card__tech-tag">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="project-card__tech-tag project-card__tech-more">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <a
                    className="project-card__cta"
                    href={`/${locale}/projects/${project.slug}`}
                  >
                    <span>{copy.cta}</span>
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {showViewAll && (
          <Reveal>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 56,
              }}
            >
              <a
                href={`/${locale}/projects`}
                className="button button--primary"
                style={{minWidth: 220}}
              >
                {copy.viewAll}
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}