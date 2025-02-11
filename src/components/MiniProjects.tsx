import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const projects = [
    {
        title: "Split a Bill",
        description: "A simple bill splitting app.",
        techSkills: ["React", "Redux", "TypeScript", "Vite", "Material-UI"],
        githubLink: "https://github.com/vincentau623/split-bills",
        gotoLink: "https://splitbill.vincentwcau.com",
    },
    {
        title: "HK Bus ETA Lookup",
        description:
            "To check the real-time Estimated Time of Arrival(ETA) by Hong Kong Bus Route using Hong Kong Bus open data.",
        techSkills: [
            "React",
            "JSON",
            "Moment.js",
            "TypeScript",
            "Vite",
            "Material-UI",
        ],
        githubLink: "https://github.com/vincentau623/hk-bus-eta",
        gotoLink: "https://hkbuseta.vincentwcau.com",
    },
];

const MiniProjects = () => {
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
                            <Typography variant="body2" color="text.secondary">
                                {project.description}
                            </Typography>
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
                        <CardActions>
                            <Button
                                size="small"
                                href={project.githubLink}
                                target="_blank"
                                startIcon={<i className="fab fa-github"></i>}
                            >
                                GitHub
                            </Button>
                            <Button
                                size="small"
                                href={project.gotoLink}
                                target="_blank"
                            >
                                Go to Project
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default MiniProjects;
