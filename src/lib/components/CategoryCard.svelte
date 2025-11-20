<script>
    export let category;
    export let onEdit;
    export let onDelete;

    let open = false;

    const fmtDate = (t) => {
        if (!t) return "-";
        try {
            const d = t.toDate ? t.toDate() : new Date(t);
            return d.toLocaleString();
        } catch (e) {
            return String(t);
        }
    };
</script>

<article
    class="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 flex flex-col hover:shadow-xl transition-shadow"
>
    <div class="p-4 flex items-start justify-between">
        <div class="flex-1 pr-3">
            <h3 class="font-semibold text-2xl leading-tight">
                {category.nombre}
            </h3>
            <p class="text-sm text-gray-400 mt-1 line-clamp-2">
                {category.descripcion}
            </p>
            <div class="mt-3 text-xs text-gray-300">
                <div><strong>Código:</strong> {category.codigo}</div>
                <div class="mt-1">
                    <strong>Creada:</strong>
                    {fmtDate(category.fechaCreacion)}
                </div>
                <div class="mt-1">
                    <strong>Actualizada:</strong>
                    {fmtDate(category.fechaActualizacion)}
                </div>
            </div>
        </div>

        <div class="relative">
            <button
                class="text-gray-300 px-2 py-1 hover:text-white cursor-pointer"
                aria-label="menu-categoria"
                on:click={() => (open = !open)}
            >
                <i class="fas fa-ellipsis-v text-lg"></i>
            </button>

            {#if open}
                <div
                    class="absolute right-0 mt-2 w-44 bg-gray-700 rounded-lg shadow-lg border border-gray-600"
                >
                    <button
                        class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
                        on:click={() => {
                            onEdit(category);
                            open = false;
                        }}
                    >
                        <i class="fas fa-edit"></i> Editar
                    </button>

                    <button
                        class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
                        on:click={() => {
                            if (confirm("¿Eliminar categoría?")) {
                                onDelete(category.docId);
                            }
                            open = false;
                        }}
                    >
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
            {/if}
        </div>
    </div>
</article>
