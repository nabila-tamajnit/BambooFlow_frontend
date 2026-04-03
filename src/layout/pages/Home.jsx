
export const Home = () => {
    return (
        <>
            <section className="py-12 px-44 flex flex-col gap-4 items-start text-main-800">
                <h1 className="text-4xl">
                    Bienvenue sur <span>Pro'<span className="text-secondary-400">Duck</span>'Tivity</span>!
                </h1>
                <h2 className="text-2xl">
                    Le site pour booster ta productivité.
                </h2>
                <button className="btn">Demander de l'aide à Ducky</button>
            </section>
        </>
    )
}