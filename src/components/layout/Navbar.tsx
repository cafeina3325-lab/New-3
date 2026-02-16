import TitleBar from "./TitleBar";
import NavMenu from "./NavMenu";

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 flex items-start pointer-events-none">
            <TitleBar />
            <NavMenu />
        </header>
    );
}
