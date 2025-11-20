<script>
    import AccountCard from "$lib/components/AccountCard.svelte";
    import "@fortawesome/fontawesome-free/css/all.min.css";
    import { onMount } from "svelte";
    import {
        loadAccounts,
        saveAccount,
        deleteAccountByDocId,
        emptyAccount,
    } from "$lib/js/accountsCrud";
    import { loadProducts } from "$lib/js/crud.js";

    // State
    let formData = { ...emptyAccount() };
    let editingDocId = null;
    let accounts = [];
    let productos = [];
    let tallasVendidas = [];
    let currentTalla = "";
    let currentCantidad = 1;

    // Constants
    const tipos = [
        { value: "ingreso", label: "Ingreso" },
        { value: "gasto", label: "Gasto" },
    ];

    const categoriasGasto = [
        { value: "servicios", label: "Servicios" },
        { value: "nomina", label: "Nómina" },
        { value: "alquiler", label: "Alquiler" },
        { value: "compra", label: "Compra" },
        { value: "otros", label: "Otros gastos" },
    ];

    // Reactive computations
    $: selectedProduct = productos.find((p) => p.docId === formData.productoId);
    $: isVenta = formData.tipo === "ingreso" && formData.categoria === "venta";
    $: tallasDisponibles = getTallasDisponibles(
        selectedProduct,
        tallasVendidas,
    );
    $: montoTotal = tallasVendidas.reduce(
        (sum, item) => sum + item.cantidad * item.precioUnitario,
        0,
    );

    // Update monto when tallasVendidas changes (solo para ventas)
    $: if (isVenta) {
        formData.monto = montoTotal;
    }

    $: totalIngresos = accounts
        .filter((a) => a.tipo === "ingreso")
        .reduce((sum, a) => sum + (Number(a.monto) || 0), 0);

    $: totalGastos = accounts
        .filter((a) => a.tipo === "gasto")
        .reduce((sum, a) => sum + (Number(a.monto) || 0), 0);

    $: balance = totalIngresos - totalGastos;

    onMount(async () => {
        await refresh();
        setTodayDate();
    });

    async function refresh() {
        [accounts, productos] = await Promise.all([
            loadAccounts(),
            loadProducts(),
        ]);
    }

    function setTodayDate() {
        formData.fecha = new Date().toISOString().split("T")[0];
    }

    function getTallasDisponibles(product, vendidas) {
        if (!product) return [];

        if (product.clothingType === "top") {
            return Object.entries(product.sizes || {})
                .filter(([_, stock]) => stock > 0)
                .map(([talla, stock]) => {
                    const vendido =
                        vendidas.find((t) => t.talla == talla)?.cantidad || 0;
                    return { talla, stock, disponible: stock - vendido };
                })
                .filter((t) => t.disponible > 0);
        } else {
            const sizes = product.numericSizes || [];
            return sizes
                .map((sizeObj) => {
                    if (!sizeObj) return null;
                    const talla = String(sizeObj.size);
                    const stock = sizeObj.quantity || 0;
                    const vendido =
                        vendidas.find((t) => t.talla == talla)?.cantidad || 0;
                    return { talla, stock, disponible: stock - vendido };
                })
                .filter((item) => item && item.disponible > 0);
        }
    }

    function handleTipoChange() {
        formData.categoria = "";
        if (formData.tipo === "gasto") {
            formData.productoId = "";
            tallasVendidas = [];
        }
    }

    function handleProductoChange() {
        tallasVendidas = [];
        currentTalla = "";
        currentCantidad = 1;
    }

    function agregarTalla() {
        if (!currentTalla || currentCantidad < 1) {
            alert("Seleccione una talla y cantidad válida");
            return;
        }

        const tallaInfo = tallasDisponibles.find(
            (t) => t.talla === currentTalla,
        );
        if (!tallaInfo || tallaInfo.disponible < currentCantidad) {
            alert("No hay suficiente stock disponible para esta talla");
            return;
        }

        const existing = tallasVendidas.find((t) => t.talla === currentTalla);
        if (existing) {
            const nuevaCantidad = existing.cantidad + currentCantidad;
            if (nuevaCantidad > tallaInfo.stock) {
                alert("La cantidad total excede el stock disponible");
                return;
            }
            existing.cantidad = nuevaCantidad;
            tallasVendidas = [...tallasVendidas]; // Trigger reactivity
        } else {
            tallasVendidas = [
                ...tallasVendidas,
                {
                    talla: currentTalla,
                    cantidad: currentCantidad,
                    precioUnitario: selectedProduct.valorVenta,
                },
            ];
        }

        // Reset selection
        currentTalla = "";
        currentCantidad = 1;
    }

    function quitarTalla(index) {
        tallasVendidas = tallasVendidas.filter((_, i) => i !== index);
    }

    function clearForm() {
        formData = { ...emptyAccount() };
        editingDocId = null;
        tallasVendidas = [];
        currentTalla = "";
        currentCantidad = 1;
        setTodayDate();
    }

    async function handleSave(e) {
        e.preventDefault();

        try {
            const payload = { ...formData };

            if (isVenta) {
                if (tallasVendidas.length === 0) {
                    alert("Debe agregar al menos una talla vendida");
                    return;
                }
                payload.tallasVendidas = [...tallasVendidas];
                payload.productoNombre = selectedProduct?.name;
                payload.monto = montoTotal;
            }

            await saveAccount(payload, editingDocId);
            await refresh();
            clearForm();
            alert("Transacción guardada exitosamente");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert(error.message || "Error al guardar la transacción");
        }
    }

    function startEdit(account) {
        editingDocId = account.docId;
        formData = { ...emptyAccount(), ...account };

        // Convert date
        if (account.fecha) {
            const date = account.fecha.toDate?.() ?? new Date(account.fecha);
            formData.fecha = date.toISOString().split("T")[0];
        } else {
            setTodayDate();
        }

        // Reset tallas
        tallasVendidas = [];
        currentTalla = "";
        currentCantidad = 1;

        // Load sales data
        if (
            account.tipo === "ingreso" &&
            account.categoria === "venta" &&
            account.tallasVendidas
        ) {
            tallasVendidas = [...account.tallasVendidas];
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function remove(docId) {
        if (!confirm("¿Estás seguro de eliminar esta transacción?")) return;
        try {
            await deleteAccountByDocId(docId);
            await refresh();
            if (editingDocId === docId) clearForm();
            alert("Transacción eliminada exitosamente");
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Error al eliminar la transacción");
        }
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(value);
    }
</script>

<div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-6xl mx-auto space-y-6">
        <header class="flex items-center justify-between">
            <h1 class="text-3xl font-bold flex items-center gap-3">
                <i class="fas fa-coins"></i> Cuentas
            </h1>
        </header>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {#each [{ label: "Total Ingresos", value: totalIngresos, color: "text-green-400" }, { label: "Total Gastos", value: totalGastos, color: "text-red-400" }, { label: "Balance", value: balance, color: balance >= 0 ? "text-green-400" : "text-red-400" }] as card}
                <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div class="text-sm text-gray-400">{card.label}</div>
                    <div class={`text-2xl font-bold ${card.color}`}>
                        {formatCurrency(card.value)}
                    </div>
                </div>
            {/each}
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Form -->
            <section
                class="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit"
            >
                <h2 class="text-xl font-semibold mb-4">
                    {editingDocId ? "Editar transacción" : "Nueva transacción"}
                </h2>

                <form on:submit|preventDefault={handleSave} class="space-y-4">
                    <!-- Transaction Type -->
                    <div>
                        <label
                            for="Tipo"
                            class="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Tipo
                        </label>
                        <div class="grid grid-cols-2 gap-2">
                            {#each tipos as t}
                                <label class="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="tipo"
                                        value={t.value}
                                        bind:group={formData.tipo}
                                        on:change={handleTipoChange}
                                        class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600"
                                    />
                                    <span class="ml-2 text-sm text-gray-300"
                                        >{t.label}</span
                                    >
                                </label>
                            {/each}
                        </div>
                    </div>

                    <!-- Category -->
                    <div>
                        <label
                            for="categoria"
                            class="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Categoría
                        </label>
                        <select
                            id="categoria"
                            bind:value={formData.categoria}
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">Seleccionar categoría</option>
                            {#if formData.tipo === "ingreso"}
                                <option value="venta">Venta de producto</option>
                            {:else}
                                {#each categoriasGasto as cat}
                                    <option value={cat.value}
                                        >{cat.label}</option
                                    >
                                {/each}
                            {/if}
                        </select>
                    </div>

                    {#if isVenta}
                        <!-- Product Selection -->
                        <div>
                            <label
                                for="producto"
                                class="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Producto *
                            </label>
                            <select
                                id="producto"
                                bind:value={formData.productoId}
                                on:change={handleProductoChange}
                                class="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                                required
                            >
                                <option value="">Seleccionar producto</option>
                                {#each productos as p}
                                    <option value={p.docId}>
                                        {p.name} - ${p.valorVenta?.toLocaleString()}
                                    </option>
                                {/each}
                            </select>
                        </div>

                        <!-- Size Selection -->
                        {#if selectedProduct}
                            <div class="space-y-3">
                                <div class="flex items-end gap-2">
                                    <div class="flex-1">
                                        <label
                                            for="talla"
                                            class="block text-sm font-medium text-gray-300 mb-1"
                                        >
                                            Talla
                                        </label>
                                        <select
                                            bind:value={currentTalla}
                                            class="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                                        >
                                            <option value=""
                                                >Seleccionar talla</option
                                            >
                                            {#each tallasDisponibles as t}
                                                <option value={t.talla}>
                                                    {t.talla} - {t.disponible} disponibles
                                                </option>
                                            {/each}
                                        </select>
                                    </div>
                                    <div class="w-24">
                                        <label
                                            for="cantidad"
                                            class="block text-sm font-medium text-gray-300 mb-1"
                                        >
                                            Cantidad
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            bind:value={currentCantidad}
                                            class="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        on:click={agregarTalla}
                                        class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!currentTalla ||
                                            currentCantidad < 1}
                                        aria-label="Agregar talla"
                                    >
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>

                                <!-- Added Sizes List -->
                                {#if tallasVendidas.length > 0}
                                    <div
                                        class="border border-gray-700 rounded p-3 bg-gray-900"
                                    >
                                        <h4
                                            class="text-sm font-medium text-gray-300 mb-2"
                                        >
                                            Tallas a vender:
                                        </h4>
                                        <ul class="space-y-2">
                                            {#each tallasVendidas as item, i}
                                                <li
                                                    class="flex justify-between items-center text-sm bg-gray-800 p-2 rounded"
                                                >
                                                    <span class="text-gray-200">
                                                        Talla <strong
                                                            >{item.talla}</strong
                                                        >
                                                        x {item.cantidad}
                                                        <span
                                                            class="text-gray-400 text-xs block"
                                                        >
                                                            ${item.precioUnitario?.toLocaleString()}
                                                            c/u
                                                        </span>
                                                    </span>
                                                    <div
                                                        class="flex items-center gap-3"
                                                    >
                                                        <span
                                                            class="font-medium text-green-400"
                                                        >
                                                            ${(
                                                                item.cantidad *
                                                                item.precioUnitario
                                                            ).toLocaleString()}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            on:click={() =>
                                                                quitarTalla(i)}
                                                            class="text-red-400 hover:text-red-300 p-1"
                                                            aria-label="Quitar talla"
                                                        >
                                                            <i
                                                                class="fas fa-times"
                                                            ></i>
                                                        </button>
                                                    </div>
                                                </li>
                                            {/each}
                                            <li
                                                class="pt-2 mt-2 border-t border-gray-700 font-medium flex justify-between items-center"
                                            >
                                                <span class="text-gray-300"
                                                    >Total:</span
                                                >
                                                <span
                                                    class="text-xl text-green-400"
                                                >
                                                    {formatCurrency(montoTotal)}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    {:else}
                        <!-- Amount for expenses -->
                        <div>
                            <label
                                for="monto"
                                class="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Monto *
                            </label>
                            <div class="relative">
                                <div
                                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                >
                                    <span class="text-gray-400">$</span>
                                </div>
                                <input
                                    id="monto"
                                    type="number"
                                    min="0"
                                    step="100"
                                    bind:value={formData.monto}
                                    class="w-full pl-8 pr-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-red-500"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>
                    {/if}

                    <!-- Date -->
                    <div>
                        <label
                            for="fecha"
                            class="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Fecha
                        </label>
                        <input
                            id="fecha"
                            type="date"
                            bind:value={formData.fecha}
                            required
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <!-- Description -->
                    <div>
                        <label
                            for="descripcion"
                            class="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            rows="3"
                            bind:value={formData.descripcion}
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-red-500"
                            placeholder="Detalles adicionales..."
                        ></textarea>
                    </div>

                    <!-- Buttons -->
                    <div class="flex gap-2 pt-2">
                        <button
                            type="submit"
                            class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isVenta && tallasVendidas.length === 0}
                        >
                            <i class="fas fa-save"></i>
                            {editingDocId ? "Actualizar" : "Guardar"}
                        </button>

                        {#if editingDocId}
                            <button
                                type="button"
                                on:click={clearForm}
                                class="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
                            >
                                <i class="fas fa-times"></i>
                                Cancelar
                            </button>
                        {/if}
                    </div>
                </form>
            </section>

            <!-- Transactions List -->
            <section class="lg:col-span-2">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-xl font-semibold">
                        Historial de transacciones
                    </h2>
                    <div class="text-sm text-gray-400">
                        {accounts.length}
                        {accounts.length === 1
                            ? "transacción"
                            : "transacciones"}
                    </div>
                </div>

                {#if accounts.length === 0}
                    <div
                        class="bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 p-8 text-center"
                    >
                        <i class="fas fa-receipt text-4xl text-gray-600 mb-2"
                        ></i>
                        <p class="text-gray-400">
                            No hay transacciones registradas
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                            Comienza agregando tu primera transacción
                        </p>
                    </div>
                {:else}
                    <div class="space-y-3">
                        {#each accounts as account (account.docId)}
                            <AccountCard
                                {account}
                                onEdit={() => startEdit(account)}
                                onDelete={() => remove(account.docId)}
                            />
                        {/each}
                    </div>
                {/if}
            </section>
        </div>
    </div>
</div>
