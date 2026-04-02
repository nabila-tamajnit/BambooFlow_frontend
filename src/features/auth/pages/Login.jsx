import { LoginForm } from "../components/LoginForm"


export const Login = () => {

    return (
        <>
            <section className="py-6 px-12 flex items-center gap-6">
                <h1 className="text-3xl text-main-800 font-chewy">
                    Se connecter
                </h1>
            </section>

            <section className="flex flex-col px-12 gap-4 pb-12">
                <LoginForm />
            </section>

        </>
    )
}