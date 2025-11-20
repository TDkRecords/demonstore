<script>
    import "@fortawesome/fontawesome-free/css/all.min.css";

    let open = false;
</script>

<!-- NAVBAR -->
<nav class="bg-gray-800 px-5 py-3">
    <div class="flex justify-between items-center">
        <!-- IZQUIERDA -->
        <a href="/" class="flex items-center gap-2 text-white">
            <i class="fas fa-arrow-left"></i>
            <span class="font-medium">Visitar demon store</span>
        </a>

        <!-- BOTÓN HAMBURGUESA (solo móvil) -->
        <button
            class="text-white text-2xl md:hidden"
            aria-label="Menu"
            title="Menu"
            on:click={() => (open = !open)}
        >
            <i class="fas fa-bars"></i>
        </button>

        <!-- MENÚ DESKTOP -->
        <div class="hidden md:flex items-center gap-2">
            <a
                href="/admin"
                class="flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-gray-700 transition ease-in-out duration-300 text-white"
            >
                <i class="fas fa-home"></i>
                <span>Panel</span>
            </a>

            <a
                href="/admin/categorias"
                class="flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-gray-700 transition ease-in-out duration-300 text-white"
            >
                <i class="fas fa-tags"></i>
                <span>Categorías</span>
            </a>

            <a
                href="/admin/proveedores"
                class="flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-gray-700 transition ease-in-out duration-300 text-white"
            >
                <i class="fas fa-truck"></i>
                <span>Proveedores</span>
            </a>

            <a
                href="/admin/prendas"
                class="flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-gray-700 transition ease-in-out duration-300 text-white"
            >
                <i class="fas fa-tshirt"></i>
                <span>Prendas</span>
            </a>

            <a
                href="/admin/cuentas"
                class="flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-gray-700 transition ease-in-out duration-300 text-white"
            >
                <i class="fas fa-coins"></i>
                <span>Cuentas</span>
            </a>
        </div>
    </div>

    <!-- MENÚ MÓVIL (COLLAPSABLE) -->
    {#if open}
        <div class="flex flex-col gap-2 mt-3 md:hidden animate-fadeIn">
            <a
                href="/admin"
                class="flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-gray-700 transition ease-in-out duration-300 text-white"
            >
                <i class="fas fa-home"></i> Panel
            </a>

            <a
                href="/admin/prendas"
                class="flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-gray-700 transition ease-in-out duration-300 text-white"
            >
                <i class="fas fa-tshirt"></i> Prendas
            </a>

            <a
                href="/admin/proveedores"
                class="flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-gray-700 transition ease-in-out duration-300 text-white"
            >
                <i class="fas fa-truck"></i> Proveedores
            </a>

            <a
                href="/admin/cuentas"
                class="flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-gray-700 transition ease-in-out duration-300 text-white"
            >
                <i class="fas fa-coins"></i> Cuentas
            </a>
        </div>
    {/if}
</nav>

<div>
    <slot />
</div>

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fadeIn {
        animation: fadeIn 0.18s ease-out;
    }
</style>
