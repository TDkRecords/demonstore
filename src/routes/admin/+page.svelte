<script>
    import { onMount } from "svelte";
    import {
        getLowStockCount,
        getTotalProducts,
        getTotalProviders,
        getRecentTransactions,
        getRecentProducts,
        getFinancialSummary,
    } from "$lib/js/dashboardData";

    let loading = true;
    let stats = {
        lowStock: 0,
        totalProducts: 0,
        totalProviders: 0,
        recentTransactions: [],
        recentProducts: [],
        financial: { ingresos: 0, gastos: 0, balance: 0 },
    };

    onMount(async () => {
        try {
            loading = true;
            const [
                lowStock,
                totalProducts,
                totalProviders,
                recentTransactions,
                recentProducts,
                financial,
            ] = await Promise.all([
                getLowStockCount(),
                getTotalProducts(),
                getTotalProviders(),
                getRecentTransactions(5),
                getRecentProducts(5),
                getFinancialSummary(),
            ]);

            stats = {
                lowStock: lowStock || 0,
                totalProducts: totalProducts || 0,
                totalProviders: totalProviders || 0,
                recentTransactions: recentTransactions || [],
                recentProducts: recentProducts || [],
                financial: financial || { ingresos: 0, gastos: 0, balance: 0 },
            };
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            stats = {
                lowStock: 0,
                totalProducts: 0,
                totalProviders: 0,
                recentTransactions: [],
                recentProducts: [],
                financial: { ingresos: 0, gastos: 0, balance: 0 },
            };
        } finally {
            loading = false;
        }
    });

    const formatDate = (dateValue) => {
        try {
            if (!dateValue) return "Sin fecha";
            const date = dateValue?.toDate
                ? dateValue.toDate()
                : new Date(dateValue);
            if (isNaN(date.getTime())) return "Fecha inválida";
            const options = {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };
            return date.toLocaleDateString("es-CO", options);
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Error de fecha";
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };
</script>

<div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-7xl mx-auto space-y-6">
        {#if loading}
            <div class="flex items-center justify-center h-64">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"
                ></div>
            </div>
        {:else}
            <!-- Header -->
            <header class="mb-8">
                <h1 class="text-3xl font-bold flex items-center gap-3">
                    <i class="fas fa-tachometer-alt"></i> Panel de Control
                </h1>
                <p class="text-gray-400 mt-2">Resumen general de tu tienda</p>
            </header>

            <!-- Stats Grid - 4 columnas -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Productos -->
                <div
                    class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300 hover:shadow-lg"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div
                            class="p-3 rounded-full bg-red-500/20 text-red-400"
                        >
                            <i class="fas fa-tshirt text-2xl"></i>
                        </div>
                        {#if stats.lowStock > 0}
                            <span
                                class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full border border-yellow-500/30"
                            >
                                <i class="fas fa-exclamation-triangle"></i>
                                {stats.lowStock}
                            </span>
                        {/if}
                    </div>
                    <p class="text-gray-400 text-sm mb-1">Total Productos</p>
                    <h3 class="text-3xl font-bold text-white mb-2">
                        {stats.totalProducts}
                    </h3>
                    <a
                        href="/admin/prendas"
                        class="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 group"
                    >
                        Ver productos
                        <i
                            class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"
                        ></i>
                    </a>
                </div>

                <!-- Proveedores -->
                <div
                    class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div
                            class="p-3 rounded-full bg-blue-500/20 text-blue-400"
                        >
                            <i class="fas fa-truck text-2xl"></i>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm mb-1">Proveedores</p>
                    <h3 class="text-3xl font-bold text-white mb-2">
                        {stats.totalProviders}
                    </h3>
                    <a
                        href="/admin/proveedores"
                        class="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 group"
                    >
                        Ver proveedores
                        <i
                            class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"
                        ></i>
                    </a>
                </div>

                <!-- Ingresos -->
                <div
                    class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div
                            class="p-3 rounded-full bg-green-500/20 text-green-400"
                        >
                            <i class="fas fa-arrow-down text-2xl"></i>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm mb-1">Ingresos Totales</p>
                    <h3 class="text-3xl font-bold text-green-400 mb-2">
                        {formatCurrency(stats.financial.ingresos)}
                    </h3>
                    <p class="text-green-400 text-sm">
                        <i class="fas fa-chart-line mr-1"></i>
                        {stats.financial.ingresos > 0
                            ? "Ventas activas"
                            : "Sin ingresos"}
                    </p>
                </div>

                <!-- Gastos -->
                <div
                    class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div
                            class="p-3 rounded-full bg-purple-500/20 text-purple-400"
                        >
                            <i class="fas fa-arrow-up text-2xl"></i>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm mb-1">Gastos Totales</p>
                    <h3 class="text-3xl font-bold text-red-400 mb-2">
                        {formatCurrency(stats.financial.gastos)}
                    </h3>
                    <a
                        href="/admin/cuentas"
                        class="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 group"
                    >
                        Ver transacciones
                        <i
                            class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"
                        ></i>
                    </a>
                </div>
            </div>

            <!-- Balance Card -->
            <div
                class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-{stats
                    .financial.balance >= 0
                    ? 'green'
                    : 'red'}-500 transition-all duration-300"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div
                            class="p-4 rounded-full bg-{stats.financial
                                .balance >= 0
                                ? 'green'
                                : 'red'}-500/20 text-{stats.financial.balance >=
                            0
                                ? 'green'
                                : 'red'}-400"
                        >
                            <i class="fas fa-balance-scale text-3xl"></i>
                        </div>
                        <div>
                            <p class="text-gray-400 text-sm mb-1">
                                Balance General
                            </p>
                            <h3
                                class="text-4xl font-bold text-{stats.financial
                                    .balance >= 0
                                    ? 'green'
                                    : 'red'}-400"
                            >
                                {formatCurrency(stats.financial.balance)}
                            </h3>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-400 mb-1">Estado</p>
                        <span
                            class="px-3 py-1 rounded-full text-sm font-medium bg-{stats
                                .financial.balance >= 0
                                ? 'green'
                                : 'red'}-500/20 text-{stats.financial.balance >=
                            0
                                ? 'green'
                                : 'red'}-400 border border-{stats.financial
                                .balance >= 0
                                ? 'green'
                                : 'red'}-500/30"
                        >
                            {stats.financial.balance >= 0
                                ? "Positivo"
                                : "Negativo"}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Main Content - 2 columnas -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Últimas Transacciones -->
                <div
                    class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                >
                    <div
                        class="p-4 border-b border-gray-700 flex items-center justify-between"
                    >
                        <h2 class="text-lg font-semibold flex items-center">
                            <i class="fas fa-exchange-alt mr-2 text-blue-400"
                            ></i>
                            Últimas Transacciones
                        </h2>
                        <span
                            class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-400"
                        >
                            {stats.recentTransactions.length}
                        </span>
                    </div>
                    <div
                        class="divide-y divide-gray-700 max-h-96 overflow-y-auto"
                    >
                        {#if stats.recentTransactions.length > 0}
                            {#each stats.recentTransactions as trans}
                                <div
                                    class="p-4 hover:bg-gray-750 transition-colors"
                                >
                                    <div
                                        class="flex justify-between items-start mb-2"
                                    >
                                        <div class="flex-1">
                                            <div
                                                class="font-medium text-white flex items-center gap-2"
                                            >
                                                <i
                                                    class="fas fa-{trans.tipo ===
                                                    'ingreso'
                                                        ? 'arrow-down text-green-400'
                                                        : 'arrow-up text-red-400'}"
                                                ></i>
                                                {trans.concepto ||
                                                    trans.categoria ||
                                                    "Sin concepto"}
                                            </div>
                                            <div class="text-sm text-gray-400">
                                                {trans.categoria ||
                                                    "Sin categoría"}
                                            </div>
                                        </div>
                                        <div
                                            class="font-bold text-lg {trans.tipo ===
                                            'ingreso'
                                                ? 'text-green-400'
                                                : 'text-red-400'}"
                                        >
                                            {trans.tipo === "ingreso"
                                                ? "+"
                                                : "-"}
                                            {formatCurrency(trans.monto)}
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        <i class="far fa-clock mr-1"></i>
                                        {formatDate(trans.fecha)}
                                    </div>
                                </div>
                            {/each}
                        {:else}
                            <div class="p-8 text-center text-gray-500">
                                <i class="fas fa-receipt text-4xl mb-3"></i>
                                <p class="text-lg mb-1">
                                    No hay transacciones recientes
                                </p>
                                <p class="text-sm">
                                    Comienza agregando tu primera transacción
                                </p>
                            </div>
                        {/if}
                    </div>
                    <div class="p-4 border-t border-gray-700 text-right">
                        <a
                            href="/admin/cuentas"
                            class="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 group"
                        >
                            Ver todas las transacciones
                            <i
                                class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"
                            ></i>
                        </a>
                    </div>
                </div>

                <!-- Productos Recientes -->
                <div
                    class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                >
                    <div
                        class="p-4 border-b border-gray-700 flex items-center justify-between"
                    >
                        <h2 class="text-lg font-semibold flex items-center">
                            <i class="fas fa-tshirt mr-2 text-red-400"></i>
                            Productos Recientes
                        </h2>
                        <span
                            class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-400"
                        >
                            {stats.recentProducts.length}
                        </span>
                    </div>
                    <div
                        class="divide-y divide-gray-700 max-h-96 overflow-y-auto"
                    >
                        {#if stats.recentProducts.length > 0}
                            {#each stats.recentProducts as product}
                                <div
                                    class="p-4 hover:bg-gray-750 transition-colors"
                                >
                                    <div
                                        class="flex justify-between items-start mb-2"
                                    >
                                        <div class="flex-1">
                                            <div
                                                class="font-medium text-white flex items-center gap-2"
                                            >
                                                <i
                                                    class="fas fa-box text-gray-400"
                                                ></i>
                                                {product.name || "Sin nombre"}
                                            </div>
                                            <div class="text-sm text-gray-400">
                                                Stock: {product.stock || 0} unidades
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div
                                                class="font-bold text-lg text-green-400"
                                            >
                                                {formatCurrency(
                                                    product.valorVenta || 0,
                                                )}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {product.fechaRegistro
                                                    ? formatDate(
                                                          product.fechaRegistro,
                                                      )
                                                    : "Sin fecha"}
                                            </div>
                                        </div>
                                    </div>
                                    {#if product.stock <= 5}
                                        <span
                                            class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full border border-yellow-500/30"
                                        >
                                            <i
                                                class="fas fa-exclamation-triangle"
                                            ></i>
                                            Bajo stock
                                        </span>
                                    {/if}
                                </div>
                            {/each}
                        {:else}
                            <div class="p-8 text-center text-gray-500">
                                <i class="fas fa-tshirt text-4xl mb-3"></i>
                                <p class="text-lg mb-1">
                                    No hay productos registrados
                                </p>
                                <p class="text-sm">
                                    Agrega tu primer producto para comenzar
                                </p>
                            </div>
                        {/if}
                    </div>
                    <div class="p-4 border-t border-gray-700 text-right">
                        <a
                            href="/admin/prendas"
                            class="text-sm text-red-400 hover:text-red-300 inline-flex items-center gap-1 group"
                        >
                            Ver todos los productos
                            <i
                                class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"
                            ></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div>
                <h2 class="text-xl font-semibold mb-4 flex items-center">
                    <i class="fas fa-bolt mr-2 text-yellow-400"></i>
                    Acciones Rápidas
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="/admin/prendas"
                        class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300 text-center group hover:shadow-lg"
                    >
                        <div
                            class="text-red-400 mb-3 group-hover:scale-110 transition-transform"
                        >
                            <i class="fas fa-plus-circle text-3xl"></i>
                        </div>
                        <span class="text-sm font-medium">Nuevo Producto</span>
                    </a>
                    <a
                        href="/admin/proveedores"
                        class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 text-center group hover:shadow-lg"
                    >
                        <div
                            class="text-blue-400 mb-3 group-hover:scale-110 transition-transform"
                        >
                            <i class="fas fa-truck text-3xl"></i>
                        </div>
                        <span class="text-sm font-medium">Nuevo Proveedor</span>
                    </a>
                    <a
                        href="/admin/cuentas"
                        class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300 text-center group hover:shadow-lg"
                    >
                        <div
                            class="text-green-400 mb-3 group-hover:scale-110 transition-transform"
                        >
                            <i class="fas fa-coins text-3xl"></i>
                        </div>
                        <span class="text-sm font-medium"
                            >Nueva Transacción</span
                        >
                    </a>
                    <a
                        href="/admin/categorias"
                        class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 text-center group hover:shadow-lg"
                    >
                        <div
                            class="text-purple-400 mb-3 group-hover:scale-110 transition-transform"
                        >
                            <i class="fas fa-tags text-3xl"></i>
                        </div>
                        <span class="text-sm font-medium">Nueva Categoría</span>
                    </a>
                </div>
            </div>
        {/if}
    </div>
</div>
