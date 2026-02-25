import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageContentWrapper from "@/components/PageContentWrapper";

export default function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <PageContentWrapper>
                {children}
            </PageContentWrapper>
            <Footer />
        </>
    );
}
