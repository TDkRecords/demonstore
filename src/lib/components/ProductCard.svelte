<script>
    export let product;
    export let providers = [];
    export let onEdit;
    export let onDelete;
    export let imgSrc;

    let open = false;

    const formatCurrency = (n) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(n);

    // buscar proveedor por id numérico
    $: provider =
        providers && product?.providerId != null
            ? providers.find((p) => Number(p.id) === Number(product.providerId))
            : null;
</script>

<article
    class="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 flex flex-col hover:shadow-xl transition-shadow"
>
    <!-- IMAGEN -->
    <div class="relative h-48 w-full">
        <img
            src={imgSrc(product)}
            alt={product.name}
            class="w-full h-full object-cover"
            on:error={(e) => (e.target.src = "/imagenotfound.jpg")}
        />
    </div>

    <!-- CONTENIDO -->
    <div class="p-4 flex flex-col grow">
        <div class="flex justify-between items-start">
            <div class="flex-1 pr-3">
                <h3 class="font-semibold text-2xl leading-tight">
                    {product.name}
                </h3>

                <p class="text-sm text-gray-400 mt-1 line-clamp-2">
                    {product.description}
                </p>

                {#if provider}
                    <p class="text-xs text-gray-300 mt-2">
                        <strong>Proveedor:</strong>
                        {provider.empresa} — {provider.nombre}
                    </p>
                {/if}

                <!-- VALORES ECONÓMICOS -->
                <div class="mt-4 space-y-1">
                    <p class="text-sm text-gray-200">
                        <strong>Valor de compra:</strong>
                        <span class="text-green-400">
                            {formatCurrency(product.valorCompra)}
                        </span>
                    </p>

                    <p class="text-sm text-gray-200">
                        <strong>Valor de venta:</strong>
                        <span class="text-red-400">
                            {formatCurrency(product.valorVenta)}
                        </span>
                    </p>
                </div>
            </div>

            <!-- MENÚ -->
            <div class="relative">
                <button
                    class="text-gray-300 px-2 py-1 hover:text-white cursor-pointer"
                    aria-label="menu-producto"
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
                                onEdit(product);
                                open = false;
                            }}
                        >
                            <i class="fas fa-edit"></i> Editar
                        </button>

                        <button
                            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
                            on:click={() => {
                                onDelete(product.docId);
                                open = false;
                            }}
                        >
                            <i class="fas fa-trash-alt"></i> Eliminar
                        </button>
                    </div>
                {/if}
            </div>
        </div>

        <!-- STOCK -->
        <div class="mt-4 text-xs text-gray-200">
            Hay <strong class="text-sm">{product.stock}</strong> en stock
        </div>

        <!-- TALLAS -->
        <div class="mt-4">
            <div class="text-xs text-gray-400">
                {product.clothingType === "top"
                    ? "Tallas disponibles (cantidad)"
                    : "Tallas disponibles"}
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
                {#if product.clothingType === "top"}
                    {#each Object.entries(product.sizes || {}).filter(([, q]) => q > 0) as [sz, q]}
                        <span
                            class="text-xs bg-gray-700 px-2 py-1 rounded-md border border-gray-600"
                        >
                            <strong>{sz.toUpperCase()}:</strong>
                            <span class="ml-1">{q}</span>
                        </span>
                    {/each}
                    {#if !Object.values(product.sizes || {}).some((q) => q > 0)}
                        <span class="text-xs text-gray-500"
                            >Sin tallas registradas</span
                        >
                    {/if}
                {:else if product.numericSizes?.length > 0}
                    {#each product.numericSizes as item}
                        <span
                            class="text-xs bg-gray-700 px-2 py-1 rounded-md border border-gray-600"
                        >
                            {item.size} — {item.quantity}
                        </span>
                    {/each}
                {:else}
                    <span class="text-xs text-gray-500"
                        >Sin tallas registradas</span
                    >
                {/if}
            </div>
        </div>
    </div>
</article>
