import Header from "./Header";
import Footer from "./Footer";
import MotionProvider from "./MotionProvider";
export default function PageShell({ children, className = "", motion = true }: {children: React.ReactNode; className?: string; motion?: boolean}) {
  return <><Header /><main id="main" className={`editorial-page ${className}`}>{children}</main><Footer />{motion && <MotionProvider />}</>;
}
