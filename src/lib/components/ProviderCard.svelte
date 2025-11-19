<script>
    export let provider;
    export let onEdit;
    export let onDelete;
    export let imgSrc;

    let open = false;

    const formatDate = (ts) => {
        try {
            if (!ts) return "";
            // ts puede ser Timestamp de Firestore: tiene toDate()
            const d = ts.toDate ? ts.toDate() : new Date(ts);
            return d.toLocaleDateString("es-CO");
        } catch (e) {
            return "";
        }
    };
</script>

<article
    class="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 flex flex-col hover:shadow-xl transition-shadow"
>
    <div class="relative h-44 w-full">
        <img
            src={imgSrc(provider)}
            alt={provider.empresa}
            class="w-full h-full object-cover"
            on:error={(e) => (e.target.src = "/imagenotfound.jpg")}
        />
    </div>

    <div class="p-4 flex flex-col grow">
        <div class="flex justify-between items-start">
            <div class="flex-1 pr-3">
                <h3 class="font-semibold text-2xl leading-tight">
                    {provider.empresa}
                </h3>
                <p class="text-sm text-gray-400 mt-1">
                    <strong>Contacto:</strong>
                    {provider.nombre || "-"}
                </p>
                {#if provider.tipo}
                    <p class="text-xs text-gray-400 mt-1">
                        Tipo: {provider.tipo}
                    </p>
                {/if}
            </div>

            <div class="relative">
                <button
                    class="text-gray-300 px-2 py-1 hover:text-white cursor-pointer"
                    aria-label="menu-proveedor"
                    on:click={() => (open = !open)}
                >
                    <i class="fas fa-ellipsis-v text-lg"></i>
                </button>

                {#if open}
                    <div
                        class="absolute right-0 mt-2 w-44 bg-gray-700 rounded-lg shadow-lg border border-gray-600 overflow-hidden z-20"
                    >
                        <button
                            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
                            on:click={() => {
                                onEdit(provider);
                                open = false;
                            }}
                        >
                            <i class="fas fa-edit"></i> Editar
                        </button>

                        <button
                            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
                            on:click={() => {
                                onDelete(provider.docId);
                                open = false;
                            }}
                        >
                            <i class="fas fa-trash-alt"></i> Eliminar
                        </button>
                    </div>
                {/if}
            </div>
        </div>

        <div class="mt-4 text-sm text-gray-300 flex-1">
            <div class="mb-2">
                <span class="text-xs text-gray-400">Email:</span>
                {provider.email || "-"}
            </div>
            <div class="mb-2">
                <span class="text-xs text-gray-400">Tel:</span>
                {provider.phone || "-"}
            </div>
            <div class="mb-2">
                <span class="text-xs text-gray-400">Dirección:</span>
                {provider.address || "-"}
            </div>
            <div class="mb-2">
                <span class="text-xs text-gray-400">País / Ciudad:</span>
                {provider.pais || "-"} / {provider.ciudad || "-"}
            </div>

            {#if provider.website}
                <div class="mb-2">
                    <a
                        class="text-xs text-blue-300 hover:underline"
                        href={provider.website}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {provider.website}
                    </a>
                </div>
            {/if}

            {#if provider.comentarios}
                <div class="mt-2 text-xs text-gray-400 line-clamp-3">
                    {provider.comentarios}
                </div>
            {/if}
        </div>

        <div
            class="mt-4 flex items-center justify-between text-xs text-gray-400"
        >
            <div>Id: {provider.id}</div>
            <div>{formatDate(provider.fecha)}</div>
        </div>
    </div>
</article>
