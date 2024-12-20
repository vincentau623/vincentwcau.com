"use client";

import InfoCard from "@/components/InfoCard";
import TitleBar from "@/components/TitleBar";
import { Chip, Link } from "@nextui-org/react";

export default function LandingPage() {
  const infoCardList = [
    {
      title: "Split a Bill",
      description: "A simple bill splitting app.",
      skills: { frontend: ["React", "Redux", "TypeScript", "Vite", "Material UI"] },
      github: "https://github.com/vincentau623/split-bills",
      href: "https://splitbill.vincentwcau.com",
    },
    {
      title: "HK Bus ETA Lookup",
      description:
        "To check the real-time Estimated Time of Arrival(ETA) by Hong Kong Bus Route using Hong Kong Bus open data.",
      skills: { "frontend": ["React", "TypeScript", "Vite", "Material UI", "Moment.js"] },
      github: "https://github.com/vincentau623/hk-bus-eta",
      href: "https://hkbuseta.vincentwcau.com/",
    },
    {
      title: "Random Number Generator",
      description:
        "Generate a set of random numbers with customizable min, max and size.",
      skills: { "frontend": ["React", "Next.Js", "TypeScript", "Next UI", "TailwindCSS"] },
      href: "/random-number-generator",
    },
    {
      title: "Queens Solver",
      description: "A solver for the N-Queens problem.",
      skills: { "frontend": ["React", "Next.Js", "TypeScript", "Next UI", "TailwindCSS"] },
      href: "/queens",
    },
    {
      title: "JSON To TS Interface Converter",
      description: "Convert a JSON string to a TypeScript interface.",
      skills: { "frontend": ["React", "Next.Js", "TypeScript", "Next UI", "TailwindCSS"] },
      href: "/json-to-model",
    },
    // {
    //   title: "Leaflet Map",
    //   description: "A map using Leaflet.",
    //   href: "/leaflet-map",
    // },
    // tax calculator
    // currency converter
  ];

  return (
    <div className="flex flex-col grow container mx-auto">
      <div id="header" className="-mb-16"></div>
      <div id="about-me" className="pt-20">
        <TitleBar title="About Me" />
        <div className="flex justify-center items-center p-6">
          <div>
            Hello, and welcome to my personal website! I am Wing Chun AU, you
            can call me Vincent. I am a passionate software engineer with a keen
            interest in crafting innovative solutions to complex challenges and
            solving daily problem. With a solid foundation in programming,
            system design, and emerging technologies, I thrive on building
            efficient, scalable, and user-friendly applications.
            <br />
            <br />
            Beyond coding, I enjoy playing racket sports like badminton, tennis,
            and squash. This space is where I share my journey, mini projects,
            and thoughts. Feel free to explore and reach out if you have any
            questions or just want to chat!
          </div>
        </div>
      </div>
      <div id="mini-project" className="pt-12">
        <div className="flex flex-col items-center">
          <TitleBar title="Mini Project Page" />
          {infoCardList && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {infoCardList.map((el) => (
                <InfoCard
                  key={el.title}
                  title={el.title}
                  description={el.description}
                  skills={el.skills}
                  github={el.github}
                  href={el.href}
                />
              ))}
            </div>
          )}
        </div>
        <div id="tech" className="pt-12">
          <TitleBar title="Tech Stacks" />
          <div className="flex flex-col p-6">
            <div>
              Frontend:{" "}
              {[
                "React",
                "React Router",
                "Nextjs",
                "Tailwind CSS",
                "Material UI",
                "React Bootstrap",
                "Formik",
                "TanStack Table",
                "Angular",
                "ng-bootstrap",
                "Vue.js",
                "TypeScript",
                "JavaScript",
                "Vite",
                "Webpack",
                "Unity",
              ].map((el) => (
                <Chip
                  className="mx-1"
                  color="primary"
                  variant="dot"
                  radius="sm"
                  key={el}
                >
                  {el}
                </Chip>
              ))}
            </div>
            <div>
              Mobile App:{" "}
              {["React Native", "Swift", "Objective-C", "Kotlin", "Java"].map(
                (el) => (
                  <Chip
                    className="mx-1"
                    color="secondary"
                    variant="dot"
                    radius="sm"
                    key={el}
                  >
                    {el}
                  </Chip>
                )
              )}
            </div>
            <div>
              Backend:{" "}
              {[
                "Node.js",
                "Express.js",
                "Sequelize",
                "TypeScript",
                "JavaScript",
                "Java",
                "Spring Framework",
                "JDBC",
                "Red Hat Enterprise Linux",
                "Nginx",
                "Object Storage (ECS)",
              ].map((el) => (
                <Chip
                  className="mx-1"
                  color="warning"
                  variant="dot"
                  radius="sm"
                  key={el}
                >
                  {el}
                </Chip>
              ))}
            </div>
            <div>
              Database:{" "}
              {[
                "Oracle (PL/SQL)",
                "PostgreSQL",
                "MySQL",
                "MariaDB",
                "MongoDB",
                "Redis",
              ].map((el) => (
                <Chip
                  className="mx-1"
                  color="danger"
                  variant="dot"
                  radius="sm"
                  key={el}
                >
                  {el}
                </Chip>
              ))}
            </div>
            <div>
              DevOps:{" "}
              {[
                "Git",
                "Azure",
                "AWS",
                "Kubernetes",
                "Jenkins",
                "Control-M",
                "Kibana",
                "Grafana",
                "Cloudflare",
                "Firebase",
              ].map((el) => (
                <Chip
                  className="mx-1"
                  color="success"
                  variant="dot"
                  radius="sm"
                  key={el}
                >
                  {el}
                </Chip>
              ))}
            </div>
            <div>
              Project Management:{" "}
              {["PRINCE2", "Agile", "Technical Writing"].map((el) => (
                <Chip
                  className="mx-1"
                  color="default"
                  variant="dot"
                  radius="sm"
                  key={el}
                >
                  {el}
                </Chip>
              ))}
            </div>
            <div>
              UI/UX design:{" "}
              {["Figma", "Adobe (Photoshop, Illustrator, Premiere Pro)"].map(
                (el) => (
                  <Chip
                    className="mx-1"
                    color="default"
                    variant="dot"
                    radius="sm"
                    key={el}
                  >
                    {el}
                  </Chip>
                )
              )}
            </div>
          </div>
        </div>
        <div id="contact" className="pt-12">
          <TitleBar title="Contact Me" />
          <div className="flex justify-center items-center flex-col p-6">
            <div>Email: vincentwcau@gmail.com</div>
            <div>
              <Link href="https://github.com/vincentau623">Github</Link>
              {` | `}
              <Link href="https://www.linkedin.com/in/vincentwcau/">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
        <div id="footer">
          <div className="flex justify-center items-center p-6">
            <div className="text-center">© 2024 Vincent AU</div>
          </div>
        </div>
      </div>
    </div>
  );
}
