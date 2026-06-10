import Sidebar from "../_components/organisms/sidebar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 pt-16 md:pt-0 md:overflow-y-auto md:h-screen">
                {children}
            </main>
        </div>
    );
}