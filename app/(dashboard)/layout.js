import Header from "../../components/layout/header";

export default function ({ children}) {

    return (
        <>
            <Header/>
            <main className="h-full w-full flex flex-col items-center">
                {children}
            </main>
        </>
    )
}