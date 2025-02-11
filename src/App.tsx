import { Typography, Container, Box, Link } from "@mui/material";
import "./App.css";
import TechStacks from "./components/TechStacks";
import Projects from "./components/Projects";
import MiniProjects from "./components/MiniProjects";
import Header from "./components/Header";

function App() {
    return (
        <div className="app">
            <Header />
            <Container component="main" className="main-content">
                <Box
                    component="section"
                    id="home"
                    style={{ padding: 16, marginTop: 16 }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        style={{
                            fontFamily: "Bitter, serif",
                            fontWeight: 700,
                            fontStyle: "italic",
                        }}
                    >
                        Full Stack Software Engineer
                    </Typography>
                    <Typography variant="body1">
                        I am Vincent AU, a passionate software engineer crafting
                        innovative solutions to complex challenges and solving
                        daily problem. With a solid foundation in programming,
                        system design, and emerging technologies, I thrive on
                        building efficient, scalable, and user-friendly
                        applications.
                        <br />
                        Beyond coding, I enjoy playing racket sports like
                        badminton, tennis, and squash. This space is where I
                        share my journey, mini projects, and thoughts. Feel free
                        to explore and reach out if you have any questions or
                        just want to chat!
                    </Typography>
                </Box>
                <Box
                    component="section"
                    id="techstacks"
                    style={{
                        padding: 16,
                        marginTop: 16,
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        style={{ fontFamily: "Bitter, serif", fontWeight: 700 }}
                    >
                        Tech Stacks
                    </Typography>
                    <TechStacks />
                </Box>
                <Box
                    component="section"
                    id="projects"
                    style={{ padding: 16, marginTop: 16 }}
                >
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        style={{ fontFamily: "Bitter, serif", fontWeight: 700 }}
                    >
                        Selected Projects
                    </Typography>
                    <Projects />
                </Box>
                <Box
                    component="section"
                    id="miniprojects"
                    style={{ padding: 16, marginTop: 16 }}
                >
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        style={{ fontFamily: "Bitter, serif", fontWeight: 700 }}
                    >
                        Mini Projects
                    </Typography>
                    <MiniProjects />
                </Box>
                <Box
                    component="section"
                    id="contact"
                    style={{ padding: 16, marginTop: 16 }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        style={{ fontFamily: "Bitter, serif", fontWeight: 700 }}
                    >
                        Contact Me
                    </Typography>
                    <Typography variant="body1">
                        Reach me via email at{" "}
                        <Link href="mailto:vincentwcau@gmail.com">
                            vincent@example.com
                        </Link>{" "}
                        or connect with me on{" "}
                        <Link
                            href="https://www.linkedin.com/in/vincentwcau"
                            target="_blank"
                            rel="noopener"
                        >
                            LinkedIn
                        </Link>
                        .
                    </Typography>
                </Box>
            </Container>
            <footer className="footer">
                <Typography variant="body2">
                    &copy; 2025 Vincent Au. All rights reserved.
                </Typography>
            </footer>
        </div>
    );
}

export default App;
