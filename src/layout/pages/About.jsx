export const About = () => {
 
    return (
        <>
            <section className="py-12 px-44 flex flex-col gap-4 items-start">
 
                <h1 className="text-5xl text-main-800 font-chewy">Interface<span className="text-secondary-400">3</span></h1>
 
                <div >
                    <p className="text-lg text-main-900 bg-main-50 py-5 px-5 rounded">
                        Centre de formation continue, Interface3 s’est donné pour mission de favoriser l’accès des femmes aux métiers IT, techniques et logistiques ou à des fonctions administratives et commerciales transformées par la technologie informatique.<br />
                        <br />
 
                        Depuis le début de son histoire, en 1986, l’ASBL a choisi d’organiser des formations non-mixtes pour contourner les obstacles qui empêchent les femmes d'accéder aux professions informatiques et contribuer ainsi à plus de diversité dans ce secteur encore fortement masculin. Grâce au soutien de ses partenaires pédagogiques, financiers et européens, Interface3 organise aujourd’hui 12 formations qualifiantes, plusieurs modules d'initiation et d'orientation ainsi que des ateliers de sensibilisation aux STIM, en collaboration avec des écoles et des associations, en portant une attention particulière à la question du genre.<br />
                        <br />
 
                        Chaque année, Interface3 accueille en formation près de 300 femmes en quête d’un meilleur avenir professionnel. Le taux d’insertion à la sortie des formations qualifiantes? Entre 70% et 80%! Un réseau d’anciennes et un système de marrainage favorisent l’insertion des nouvelles recrues dans les nombreuses entreprises partenaires qui nous font confiance chaque année. Des chiffres-clés qui encouragent une équipe toujours plus motivée, année après année.
 
                    </p>
 
                </div>
            </section>
 
            <section className="py-12 px-44 flex flex-col gap-4 items-start">
 
 
                <h2 className="text-5xl text-main-800 font-chewy">Full Stack <span className="text-secondary-400">JavaScript Developer</span></h2>
 
                <div className="bg-main-50 flex flex-row py-8 px-3 ">
                    <p className="text-lg text-main-900  py-5 px-5 rounded ">
                        Plongez dans le monde passionnant du développement web. Apprenez à créer des interfaces modernes et responsives avec JavaScript et React, puis connectez-les à des bases de données dynamiques grâce à Node.js et Express. Du frontend au backend, développez des applications web complètes.
                    </p>
 
                    <img src="../images/ordinateur.jpg" alt="Image d'ordinateur avec des nombres binaires" className="h-50 rounded" />
 
                </div>
 
            </section>
        </>
    )
}