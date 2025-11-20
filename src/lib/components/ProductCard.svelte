<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { loadProducts, deleteProductByDocId } from "$lib/js/crud.js";
    import { loadCategories } from "$lib/js/categoriesCrud.js";

    const dispatch = createEventDispatcher();

    // Data
    let products = [];
    let categories = [];
    let openCategories = {};
    let openMenu = null; // Track which menu is open

    // Group products by category
    $: productsByCategory = (() => {
        const grouped = {};

        // Create groups for all categories
        categories?.forEach((cat) => {
            grouped[cat.docId] = {
                category: cat,
                products: [],
            };
        });

        // Group for uncategorized products
        grouped["sin-categoria"] = {
            category: {
                nombre: "Sin categoría",
                docId: "sin-categoria",
                codigo: "-",
            },
            products: [],
        };

        // Assign products to categories
        products?.forEach((product) => {
            if (product.categoryId && grouped[product.categoryId]) {
                grouped[product.categoryId].products.push(product);
            } else {
                grouped["sin-categoria"].products.push(product);
            }
        });

        return Object.values(grouped).filter(
            (group) => group.products?.length > 0,
        );
    })();

    // Format currency
    const formatCurrency = (n) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(n);

    // Toggle category accordion
    function toggleCategory(id) {
        openCategories[id] = !openCategories[id];
        openCategories = { ...openCategories };
    }

    // Toggle menu
    function toggleMenu(productId) {
        openMenu = openMenu === productId ? null : productId;
    }

    // Close menu when clicking outside
    function handleClickOutside(event) {
        if (openMenu && !event.target.closest(".menu-container")) {
            openMenu = null;
        }
    }

    // Handle edit
    function handleEdit(product) {
        dispatch("edit", { product });
        openMenu = null; // Close the menu
    }

    // Get image source
    const imgSrc = (p) => (p?.image?.trim() ? p.image : "/imagenotfound.jpg");

    // Initialize component
    onMount(async () => {
        try {
            [products, categories] = await Promise.all([
                loadProducts(),
                loadCategories(),
            ]);
            // Open all categories by default
            categories?.forEach((cat) => (openCategories[cat.docId] = true));
            openCategories["sin-categoria"] = true;
        } catch (error) {
            console.error("Error loading data:", error);
            alert("Error al cargar los datos");
        }
    });

    // Handle delete
    async function handleDelete(docId) {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            await deleteProductByDocId(docId);
            // Reload products after deletion
            [products, categories] = await Promise.all([
                loadProducts(),
                loadCategories(),
            ]);
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error al eliminar el producto");
        }
    }

    // Find category by ID
    function findCategory(categoryId) {
        return categories?.find((c) => c.docId === categoryId);
    }
</script>

<div class="space-y-4">
    {#if products.length === 0}
        <div
            class="bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 p-8 text-center"
        >
            <i class="fas fa-tshirt text-4xl text-gray-600 mb-3"></i>
            <p class="text-gray-400">No hay productos registrados</p>
            <p class="text-sm text-gray-500 mt-1">
                Agrega tu primer producto para comenzar
            </p>
        </div>
    {:else}
        {#each productsByCategory as group (group.category.docId)}
            <div
                class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden transition-all duration-200"
            >
                <!-- Category Header -->
                <button
                    class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-750 transition-colors"
                    on:click={() => toggleCategory(group.category.docId)}
                >
                    <div class="flex items-center gap-3">
                        <i class="fas fa-tag text-blue-400"></i>
                        <span class="text-lg font-semibold">
                            {group.category.nombre}
                        </span>
                        <span
                            class="text-sm text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full"
                        >
                            {group.products.length}
                        </span>
                    </div>
                    <i
                        class="fas fa-chevron-{openCategories[
                            group.category.docId
                        ]
                            ? 'up'
                            : 'down'} text-gray-400 transition-transform duration-200"
                    ></i>
                </button>

                <!-- Products Grid -->
                {#if openCategories[group.category.docId]}
                    <div class="p-4 border-t border-gray-700 bg-gray-850/50">
                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {#each group.products as product (product.docId)}
                                <article
                                    class="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-200"
                                >
                                    <!-- Product Image -->
                                    <div class="relative h-48 w-full">
                                        <img
                                            src={imgSrc(product)}
                                            alt={product.name}
                                            class="w-full h-full object-cover"
                                            on:error={(e) =>
                                                (e.target.src =
                                                    "/imagenotfound.jpg")}
                                        />
                                    </div>

                                    <!-- Product Content -->
                                    <div class="p-4">
                                        <div
                                            class="flex justify-between items-start mb-2"
                                        >
                                            <h3
                                                class="font-semibold text-lg text-white"
                                            >
                                                {product.name}
                                            </h3>
                                            <div class="relative">
                                                <button
                                                    title="menu"
                                                    class="text-gray-400 hover:text-white p-1 -mt-1 -mr-1 cursor-pointer"
                                                    on:click|stopPropagation={() =>
                                                        toggleMenu(
                                                            product.docId,
                                                        )}
                                                >
                                                    <i class="fas fa-ellipsis-v"
                                                    ></i>
                                                </button>

                                                {#if openMenu === product.docId}
                                                    <div
                                                        role="menu"
                                                        tabindex="0"
                                                        class="menu-container absolute right-0 mt-1 w-40 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700"
                                                    >
                                                        <button
                                                            type="button"
                                                            role="menuitem"
                                                            tabindex="0"
                                                            class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center cursor-pointer"
                                                            on:click={() =>
                                                                handleEdit(
                                                                    product,
                                                                )}
                                                        >
                                                            <i
                                                                class="fas fa-edit mr-2 text-blue-400"
                                                            ></i>
                                                            Editar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            role="menuitem"
                                                            tabindex="0"
                                                            class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center cursor-pointer"
                                                            on:click={() =>
                                                                handleDelete(
                                                                    product.docId,
                                                                )}
                                                        >
                                                            <i
                                                                class="fas fa-trash-alt mr-2 text-red-400"
                                                            ></i>
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>

                                        {#if product.description}
                                            <p
                                                class="text-sm text-gray-300 mb-3 line-clamp-2"
                                            >
                                                {product.description}
                                            </p>
                                        {/if}

                                        <!-- Category -->
                                        {#if product.categoryId}
                                            {#each [findCategory(product.categoryId)] as category}
                                                {#if category}
                                                    <p
                                                        class="text-xs text-blue-400 mb-3 flex items-center"
                                                    >
                                                        <i
                                                            class="fas fa-tag mr-1"
                                                        ></i>
                                                        {category.nombre}
                                                        {#if category.codigo}
                                                            <span
                                                                class="text-gray-500 ml-1"
                                                                >({category.codigo})</span
                                                            >
                                                        {/if}
                                                    </p>
                                                {/if}
                                            {/each}
                                        {/if}

                                        <!-- Prices -->
                                        <div class="space-y-2 mb-3">
                                            <div
                                                class="flex justify-between items-center"
                                            >
                                                <span
                                                    class="text-sm text-gray-300"
                                                    >Compra:</span
                                                >
                                                <span
                                                    class="text-green-400 font-medium"
                                                >
                                                    {formatCurrency(
                                                        product.valorCompra,
                                                    )}
                                                </span>
                                            </div>
                                            <div
                                                class="flex justify-between items-center"
                                            >
                                                <span
                                                    class="text-sm text-gray-300"
                                                    >Venta:</span
                                                >
                                                <span
                                                    class="text-red-400 font-medium"
                                                >
                                                    {formatCurrency(
                                                        product.valorVenta,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Stock and Sizes -->
                                        <div
                                            class="pt-3 border-t border-gray-700"
                                        >
                                            <div
                                                class="flex justify-between items-center mb-2"
                                            >
                                                <span
                                                    class="text-sm text-gray-300"
                                                    >Stock:</span
                                                >
                                                <span
                                                    class="text-white font-medium"
                                                >
                                                    {product.stock} unidades
                                                </span>
                                            </div>

                                            {#if product.clothingType === "top" && product.sizes}
                                                <div
                                                    class="flex flex-wrap gap-1.5 mt-2"
                                                >
                                                    {#each Object.entries(product.sizes).filter(([_, qty]) => qty > 0) as [size, qty]}
                                                        <span
                                                            class="text-xs bg-gray-700 px-2 py-1 rounded border border-gray-600"
                                                        >
                                                            {size.toUpperCase()}:
                                                            {qty}
                                                        </span>
                                                    {/each}
                                                </div>
                                            {:else if product.numericSizes?.length > 0}
                                                <div
                                                    class="flex flex-wrap gap-1.5 mt-2"
                                                >
                                                    {#each product.numericSizes as item}
                                                        <span
                                                            class="text-xs bg-gray-700 px-2 py-1 rounded border border-gray-600"
                                                        >
                                                            T/{item.size}: U/{item.quantity}
                                                        </span>
                                                    {/each}
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </article>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    {/if}
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .transition-all {
        transition: all 0.2s ease;
    }
</style>
