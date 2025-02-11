import {
    AppBar,
    Toolbar,
    Typography,
    Link,
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import vincentLogo from "../assets/web-icon.png";
import React from "react";

const navItems = [
    { label: "Home", href: "#home" },
    { label: "Tech Stacks", href: "#techstacks" },
    { label: "Selected Projects", href: "#projects" },
    { label: "Mini Projects", href: "#miniprojects" },
    { label: "Contact", href: "#contact" },
];

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}
const drawerWidth = 240;

const Header = (props: Props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            sx={{ textAlign: "center" }}
                            href={item.href}
                        >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                <img
                    src={vincentLogo}
                    alt="Vincent Logo"
                    style={{ height: 40, marginRight: 16 }}
                />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Vincent AU
                </Typography>
                <nav>
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: "block", sm: "none" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    {navItems.map((item) => (
                        <Link
                            href={item.href}
                            underline="none"
                            color="inherit"
                            sx={{
                                display: { xs: "none", sm: "inline" },
                                margin: "0 8px",
                                fontFamily: "monospace",
                                fontWeight: 700,
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
