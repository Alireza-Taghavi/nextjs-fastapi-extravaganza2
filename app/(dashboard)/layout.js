import Header from "../../components/layout/header";

export default function DashboardLayout ({ children}) {

    return (
        <>
            <Header/>
            <main className=" w-full flex flex-col items-center font-pt">
                {children}
            </main>
        </>
    )
}