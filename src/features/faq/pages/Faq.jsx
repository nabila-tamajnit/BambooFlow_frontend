import data from "../faq.json"

export const Faq = () => {

    return (
        <>
            <section className="py-6 px-8 flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-2 text-main-800 ">
                    <h1 className="text-4xl font-chewy">Foire aux questions</h1>

                    <p className="mb-5">Tout ce que vous avez besoin de savoir pour bien démarrer.</p>
                </div>

                <div className="flex flex-col gap-6" >
                    {data.map(faq => (
                        <div key={faq} className="bg-main-50 flex flex-col gap-2 rounded-lg border border-main-600 p-4">
                            <p className="text-main-800 font-bold font-chewy text-lg tracking-widest">{faq.question}</p>
                            <p className="text-main-800">{faq.reponse}</p>
                        </div>
                    ))}
                </div>

            </section>
        </>
    )
}