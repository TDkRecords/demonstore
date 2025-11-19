<script>
    import "@fortawesome/fontawesome-free/css/all.min.css";
    import { fly } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    const products = [
        {
            name: "Camisetas",
            image: "/imagenotfound.jpg",
            description:
                "Diseños únicos y de alta calidad para lucir con estilo.",
        },
        {
            name: "Gorras",
            image: "/imagenotfound.jpg",
            description: "Complementa tu look con nuestras gorras exclusivas.",
        },
        {
            name: "Chaquetas",
            image: "/imagenotfound.jpg",
            description: "Estilo y protección en todas las temporadas.",
        },
        {
            name: "Pantalones",
            image: "/imagenotfound.jpg",
            description: "Comodidad y tendencia en cada diseño.",
        },
        {
            name: "Buzos",
            image: "/imagenotfound.jpg",
            description: "Abrígate con estilo y comodidad.",
        },
        {
            name: "Ideas",
            image: "/imagenotfound.jpg",
            description: "Bundles Style para lucirte.",
        },
    ];

    const socialMedia = [
        {
            name: "WhatsApp",
            url: "https://wa.me/573189746650",
            icon: "fab fa-whatsapp",
        },
        {
            name: "Instagram",
            url: "https://instagram.com/demon__store",
            icon: "fab fa-instagram",
        },
        {
            name: "TikTok",
            url: "https://tiktok.com/@demon__store",
            icon: "fab fa-tiktok",
        },
        {
            name: "Facebook",
            url: "https://facebook.com/DemonStore",
            icon: "fab fa-facebook",
        },
    ];
</script>

<main
    class="min-h-screen bg-linear-to-br from-gray-900 to-black text-white overflow-x-hidden"
>
    <!-- Floating Action Button -->
    <div class="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
        <a
            href="https://wa.me/+573189746650"
            class="bg-red-600 hover:bg-red-700 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 text-sm sm:text-base"
            aria-label="Ir a contacto"
        >
            <i class="fas fa-phone-alt text-xl"></i>
        </a>
    </div>

    <!-- Hero Section -->
    <section
        id="inicio"
        class="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
        <!-- Animated background elements -->
        <div class="absolute inset-0 z-0">
            <div
                class="absolute top-1/4 -left-20 w-96 h-96 bg-red-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
            ></div>
            <div
                class="absolute top-1/2 -right-20 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
            ></div>
            <div
                class="absolute bottom-1/4 left-1/2 w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
            ></div>
        </div>

        <div class="relative z-10 container mx-auto px-4 text-center">
            <div
                class="inline-block mb-8 overflow-hidden rounded-full p-1 bg-linear-to-r from-red-600 to-red-900"
                in:fly={{ y: -50, duration: 1000, easing: quintOut }}
            >
                <img
                    src="/logo.jpg"
                    alt="Demon Store Logo"
                    class="h-32 w-32 object-cover rounded-full border-4 border-black"
                    width="128"
                    height="128"
                />
            </div>

            <h1
                class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-red-400 px-4"
            >
                DEMON STORE
            </h1>

            <p
                class="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
            >
                "Además de venderte ropa, te vendemos estilo"
            </p>

            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <a
                    href="#catalogo"
                    class="relative px-8 py-4 bg-linear-to-r from-red-600 to-red-800 text-white font-bold rounded-full overflow-hidden group"
                >
                    <span class="relative z-10">Explorar Catálogo</span>
                    <span
                        class="absolute inset-0 bg-linear-to-r from-red-700 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></span>
                </a>

                <a
                    href="#contacto"
                    class="px-8 py-4 border-2 border-red-600 text-red-400 hover:bg-red-900/30 font-bold rounded-full transition-colors duration-300"
                >
                    Contáctanos
                </a>
            </div>

            <div class="mt-16">
                <a
                    href="#catalogo"
                    class="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-300"
                    aria-label="Desplazarse hacia abajo"
                >
                    <span class="text-sm mb-2">Ver más</span>
                    <i class="fas fa-chevron-down animate-bounce"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- Products Section -->
    <section
        id="catalogo"
        class="py-16 sm:py-20 bg-linear-to-b from-gray-900 to-black relative overflow-hidden"
    >
        <!-- Decorative elements -->
        <div
            class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10"
        >
            <div
                class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0dGVybiBpZD0icGF0dGVybi1iYXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFucm9ybT0icm90YXRlKDEzNSkiPjxyZWN0IGlkPSJwYXR0ZXJuLWJnIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggaWQ9InBhdHRlcm4tZmciIGQ9Ik0wIDBoMjB2MjBIMHpNMjAgMjBoMjB2MjBIMjB6TTIwIDQwaDIwdjIwSDIwek0wIDQwaDIwdjIwSDB6TTAgMjBoMjB2MjBIMHoiIGZpbGw9IiNlMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybi1iYXNlKSIvPjwvc3ZnPg==')]"
            ></div>
        </div>

        <div class="container mx-auto px-4 relative z-10">
            <div class="text-center mb-20">
                <h2
                    class="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-red-400 inline-block"
                >
                    Nuestro Catálogo
                </h2>
                <p class="text-xl text-gray-400 max-w-2xl mx-auto">
                    Descubre nuestra exclusiva colección de prendas
                    seleccionadas para ti
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6">
                {#each products as product, i}
                    <article
                        class="group relative bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:-translate-y-2"
                        in:fly={{
                            y: 50,
                            duration: 500,
                            delay: i * 100,
                            easing: quintOut,
                        }}
                    >
                        <div class="relative overflow-hidden">
                            <img
                                src={product.image}
                                alt={`Imagen de ${product.name}`}
                                class="w-full h-64 sm:h-72 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                                width="300"
                                height="400"
                                loading="lazy"
                            />
                            <div
                                class="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6"
                            >
                                <p class="text-gray-300 text-sm">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                        <div class="p-6">
                            <h3
                                class="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors"
                            >
                                {product.name}
                            </h3>
                            <button
                                class="w-full bg-linear-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white py-3 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-[1.03] active:scale-95"
                            >
                                <a href="https://wa.me/c/573189746650">
                                    Ver colección
                                </a>
                                <i class="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </article>
                {/each}
            </div>

            <div class="mt-16 text-center">
                <p class="text-gray-400 mb-6">¿No encuentras lo que buscas?</p>
                <a
                    href="#contacto"
                    class="inline-flex items-center text-red-400 hover:text-white font-medium group transition-colors"
                >
                    Contáctanos y te ayudaremos
                    <i
                        class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"
                    ></i>
                </a>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section
        id="contacto"
        class="relative py-24 bg-linear-to-b from-black to-gray-900 overflow-hidden"
    >
        <!-- Decorative elements -->
        <div class="absolute top-0 left-0 w-full h-full opacity-5">
            <div
                class="absolute -top-1/2 -left-1/4 w-full h-full bg-red-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"
            ></div>
            <div
                class="absolute -bottom-1/2 -right-1/4 w-full h-full bg-red-700 rounded-full mix-blend-overlay filter blur-3xl opacity-20"
            ></div>
        </div>

        <div class="relative z-10 container mx-auto px-4">
            <div class="text-center mb-16">
                <h2
                    class="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-red-400 inline-block"
                >
                    Contáctanos
                </h2>
                <p class="text-xl text-gray-400 max-w-2xl mx-auto">
                    Estamos aquí para ayudarte. ¡Visítanos o escríbenos!
                </p>
            </div>

            <div
                class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
                <!-- Contact Info -->
                <div
                    class="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl w-full"
                >
                    <div class="space-y-8">
                        <div class="flex items-start">
                            <div class="bg-red-900/50 p-3 rounded-xl mr-4">
                                <i
                                    class="fas fa-map-marker-alt text-2xl text-red-400"
                                ></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold mb-2">
                                    Ubicación
                                </h3>
                                <p class="text-gray-400">Pasto, Nariño</p>
                                <p class="text-gray-400">
                                    Cra 23 #14-38 / Calle del Colorado
                                </p>
                                <a
                                    href="https://maps.google.com?q=Pasto,Nariño,Cra 23 #14-38 / Calle del Colorado"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center text-red-400 hover:text-white mt-2 group transition-colors"
                                >
                                    Ver en mapa
                                    <i
                                        class="fas fa-external-link-alt ml-2 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                                    ></i>
                                </a>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="bg-red-900/50 p-3 rounded-xl mr-4">
                                <i
                                    class="fas fa-phone-alt text-2xl text-red-400"
                                ></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold mb-2">Teléfono</h3>
                                <a
                                    href="tel:+573189746650"
                                    class="text-2xl font-bold text-white hover:text-red-400 transition-colors block mb-1"
                                >
                                    318 974 6650
                                </a>
                                <p class="text-gray-400">
                                    Llámanos para más información
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="bg-red-900/50 p-3 rounded-xl mr-4">
                                <i class="far fa-clock text-2xl text-red-400"
                                ></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold mb-2">
                                    Horario de Atención
                                </h3>
                                <div class="space-y-1">
                                    <p
                                        class="text-gray-400 flex justify-between"
                                    >
                                        <span>Lunes a Sábado:</span>
                                        <span class="text-white ml-4"
                                            >9:00 AM - 7:00 PM</span
                                        >
                                    </p>
                                    <p
                                        class="text-gray-400 flex justify-between"
                                    >
                                        <span>Domingos y Festivos:</span>
                                        <span class="text-white ml-4"
                                            >10:00 AM - 4:00 PM</span
                                        >
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4">
                            <h3 class="text-xl font-bold mb-4">Síguenos</h3>
                            <div class="flex space-x-4">
                                {#each socialMedia as social}
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Síguenos en ${social.name}`}
                                        class="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center text-xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-900/30"
                                    >
                                        <i class={social.icon}></i>
                                    </a>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Map Placeholder -->
                <div class="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div class="flex justify-center items-center h-full w-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.92532938962!2d-77.28248876306532!3d1.2122514167522997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed483671749ed%3A0x969dd879fabb652d!2sCra.%2023%20%23%2014-38%2C%20Pasto%2C%20Nari%C3%B1o!5e0!3m2!1ses-419!2sco!4v1762736559821!5m2!1ses-419!2sco"
                            width="600"
                            height="600"
                            style="border:0;"
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            title="Mapa de Demon Store"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-linear-to-b from-gray-900 to-black py-8 sm:py-12">
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center">
                <div
                    class="w-20 h-20 mb-6 rounded-full bg-linear-to-br from-red-600 to-red-900 p-1"
                >
                    <img
                        src="/logo.jpg"
                        alt="Demon Store Logo"
                        class="w-full h-full object-cover rounded-full border-2 border-gray-800"
                        width="80"
                        height="80"
                        loading="lazy"
                    />
                </div>

                <p
                    class="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-white to-red-400 mb-4"
                >
                    DEMON STORE
                </p>

                <p class="text-gray-500 text-center max-w-md mb-8">
                    "Además de venderte ropa, te vendemos estilo"
                </p>

                <div class="flex space-x-6 mb-8">
                    {#each socialMedia as social}
                        <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Síguenos en ${social.name}`}
                            class="text-gray-500 hover:text-white text-xl transition-colors"
                        >
                            <i class={social.icon}></i>
                        </a>
                    {/each}
                </div>

                <div class="border-t border-gray-800 w-full max-w-2xl pt-8">
                    <p class="text-sm text-gray-600 text-center">
                        &copy; {new Date().getFullYear()} Demon Store.
                    </p>
                    <p class="text-xs text-gray-700 text-center mt-2">
                        Diseñado con ❤️ para amantes de la moda
                    </p>
                </div>
            </div>
        </div>
    </footer>
</main>
