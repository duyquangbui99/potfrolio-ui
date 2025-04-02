import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollToSection() {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollTarget = params.get("scroll");
        if (scrollTarget) {
            const element = document.getElementById(scrollTarget);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);
}
