import { Stack, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";

const techStacks = {
    Frontend: [
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
    ],
    "Mobile Apps": ["React Native", "Swift", "Objective-C", "Kotlin", "Java"],
    Backend: [
        "Java",
        "Spring Framework",
        "Node.js",
        "Express.js",
        "Sequelize",
        "TypeScript",
        "Python",
        "Django",
        "Flask",
    ],
    Database: ["MySQL", "PostgreSQL", "MongoDB", "SQLite", "Firebase"],
    DevOps: [
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
    ],
    "Project Management": ["PRINCE2", "Agile", "Technical Writing"],
    "UI/UX Design": ["Figma", "Adobe (Photoshop, Illustrator, Premiere Pro)"],
};

interface TechCategoryProps {
    title: string;
    items: string[];
}

const TechCategory = ({ title, items }: TechCategoryProps) => (
    <div>
        <Typography variant="subtitle1" component="div">
            {`> `}{title}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
            {items.map((item) => (
                <Chip
                    label={item}
                    color="primary"
                    variant="outlined"
                    key={item}
                    style={{ margin: "4px" }}
                />
            ))}
        </Stack>
    </div>
);

const TechStacks = () => (
    <Stack direction="column">
        {Object.entries(techStacks).map(([category, items]) => (
            <TechCategory
                key={category}
                title={category.charAt(0).toUpperCase() + category.slice(1)}
                items={items}
            />
        ))}
    </Stack>
);

export default TechStacks;
