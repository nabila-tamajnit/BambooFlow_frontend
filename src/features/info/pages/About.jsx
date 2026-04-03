import logoI3 from '../images/logo-interface3.webp';
import studentImg from '../images/student.png';

export const About = () => {
    return (
        <>
            <section className="py-6 px-12 flex items-center gap-6">
                <h1 className="text-3xl text-main-800 font-chewy">
                    A propos de nous !
                </h1>
            </section>

            <section className="flex flex-col px-12 gap-12 pb-12">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="md:w-1/5 w-full flex justify-center">
                        <img
                            src={logoI3}
                            alt="Logo d'interface 3"
                            className="w-full max-w-[180px] rounded-xl"
                        />
                    </div>
                    <div className="md:w-4/5 w-full">
                        <h2 className="text-2xl font-chewy text-main-700 mb-2">
                            Interface 3
                        </h2>

                        <p className="font-poppins text-main-900 leading-relaxed mb-3">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid nihil, nemo minus voluptates quibusdam laboriosam non fugiat quidem doloremque vitae nisi eligendi expedita. Impedit modi voluptatem voluptas repellat nobis ipsam?
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="md:w-1/5 w-full flex justify-center">
                        <img
                            src={studentImg}
                            alt="Image d'illustration d'une stagiaire"
                            className="w-full max-w-[180px] rounded-xl"
                        />
                    </div>
                    <div className="md:w-4/5 w-full">
                        <h2 className="text-2xl font-chewy text-main-700 mb-2">
                            Les web 14
                        </h2>
                        <p className="font-poppins text-main-900 leading-relaxed mb-3">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, iusto numquam? Suscipit, corrupti dolores! Eum fugiat repellendus ipsum provident perspiciatis eligendi harum asperiores blanditiis, voluptas laboriosam error? Itaque, rerum quo!
                        </p>
                        <p className="font-poppins text-main-900 leading-relaxed mb-3">
                            Pariatur necessitatibus quos modi neque corrupti provident. Amet minima odio corporis! Dolores incidunt rem ea vitae, sapiente commodi reiciendis expedita quae nostrum, obcaecati adipisci voluptate repudiandae labore. Accusamus, mollitia officia.
                        </p>
                        <p className="font-poppins text-main-900 leading-relaxed">
                            Error facere veniam fuga sint maxime commodi accusantium, debitis accusamus placeat eligendi id eum perspiciatis, libero dignissimos nemo modi omnis esse sequi repudiandae, adipisci sapiente ab illum! Laudantium, obcaecati ex!
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}


