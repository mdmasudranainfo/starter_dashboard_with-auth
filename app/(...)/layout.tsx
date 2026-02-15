import MainLayout from "@/src/components/layout/MainLayout"

const layout = ({ children }: { children: React.ReactNode }) => {
    return <>
        <MainLayout>
            {children}
        </MainLayout>
    </>
}
export default layout