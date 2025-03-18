import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import hostImg from "../assets/HOST.png";
import easyTransitImg from "../assets/EasyTransit.png";

const projects = [
    {
        title: "Housing Smart Intake System",
        company: "Hong Kong Housing Authority",
        description: `"Housing Smart Intake (HOST) System" provides a web-based electronic submission system for tenants/owner to report of defects within the flat during the first intake of flats in new housing estates/courts.`,
        techSkills: [
            "React",
            "Angular",
            "Java",
            "Spring Framework",
            "Oracle PL/SQL",
            "OAuth Integration",
        ],
        imgSrc: hostImg,
    },
    {
        title: "EasyTransit",
        company: "SOCIF Limited",
        description:
            "EasyTransit is a mobile app that provide real-time bus arrival information, route planning, and bus stop navigation.",
        techSkills: [
            "React Native",
            "Node.js (ExpressJS)",
            "Swift",
            "Kotlin",
            "PostgreSQL",
            "Redis",
        ],
        imgSrc: easyTransitImg,
    },
];

const Projects = () => {
    return (
        <Grid container spacing={2}>
            {projects.map((project, index) => (
                <Grid size={{ sm: 12, md: 6 }} key={index}>
                    <Card
                        key={index}
                        style={{
                            flex: "1 1 calc(50% - 20px)",
                            marginBottom: "20px",
                            boxSizing: "border-box",
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h5"
                                component="div"
                                gutterBottom
                            >
                                {project.title}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                component="div"
                                gutterBottom
                            >
                                {project.company}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {project.description}
                            </Typography>
                            {project.imgSrc && (
                                <img
                                    style={{ width: "100%", marginTop: "10px" }}
                                    src={project.imgSrc}
                                />
                            )}
                            <div style={{ marginTop: "10px" }}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    useFlexGap
                                    flexWrap="wrap"
                                >
                                    {project.techSkills.map((skill, idx) => (
                                        <Chip
                                            key={idx}
                                            label={skill}
                                            style={{ marginRight: "5px" }}
                                        />
                                    ))}
                                </Stack>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default Projects;
