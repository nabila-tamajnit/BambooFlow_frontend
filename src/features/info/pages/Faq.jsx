import { FaqItem } from '../components/FaqItem';
import faqs from '../data/faq.json';

export const Faq = () => {
    return (
        <>
            <section className="py-6 px-4 sm:px-12 flex items-center gap-6">
                <h1 className="text-3xl text-main-800 font-chewy">
                    La foire aux questions est ici !
                </h1>
            </section>

            <section className="flex flex-col px-4 sm:px-12 gap-4 pb-12">
                {faqs.map(faq => (
                    <FaqItem key={faq.id} {...faq} />
                ))}
            </section>
        </>
    )
}