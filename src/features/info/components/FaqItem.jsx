export function FaqItem({ question, response }) {

    return (
        <article className="bg-main-50 border border-main-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="font-chewy text-main-700 text-xl mb-2">
                {question}
            </p>
            <p className="font-poppins text-main-900 leading-relaxed">
                {response}
            </p>
        </article>
    )
}