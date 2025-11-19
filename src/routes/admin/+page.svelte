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
            // Set default values in case of error
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

            // Handle both Date objects and Firestore Timestamps
            const date = dateValue?.toDate
                ? dateValue.toDate()
                : new Date(dateValue);

            // Check if date is valid
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

    const formatCurrencyLocal = (amount) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };
</script>

<div class="min-h-screen bg-gray-900 text-white p-4 md:p-6">
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
            <p class="text-gray-400 mt-1">
                Resumen general y actividad reciente
            </p>
        </header>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <!-- Productos -->
            <div
                class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-colors"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Productos</p>
                        <h3 class="text-2xl font-bold">
                            {stats.totalProducts}
                        </h3>
                    </div>
                    <div class="p-3 rounded-full bg-red-500/20 text-red-400">
                        <i class="fas fa-tshirt text-xl"></i>
                    </div>
                </div>
                {#if stats.lowStock > 0}
                    <div class="mt-2">
                        <span class="text-yellow-400 text-sm">
                            <i class="fas fa-exclamation-triangle mr-1"></i>
                            {stats.lowStock} con bajo stock
                        </span>
                    </div>
                {/if}
            </div>

            <!-- Proveedores -->
            <div
                class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Proveedores</p>
                        <h3 class="text-2xl font-bold">
                            {stats.totalProviders}
                        </h3>
                    </div>
                    <div class="p-3 rounded-full bg-blue-500/20 text-blue-400">
                        <i class="fas fa-truck text-xl"></i>
                    </div>
                </div>
                <div class="mt-2">
                    <a
                        href="/admin/proveedores"
                        class="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                    >
                        Ver todos <i class="fas fa-arrow-right ml-1 text-xs"
                        ></i>
                    </a>
                </div>
            </div>

            <!-- Ingresos -->
            <div
                class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-colors"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Ingresos (30d)</p>
                        <h3 class="text-2xl font-bold text-green-400">
                            {formatCurrencyLocal(stats.financial.ingresos)}
                        </h3>
                    </div>
                    <div
                        class="p-3 rounded-full bg-green-500/20 text-green-400"
                    >
                        <i class="fas fa-arrow-down text-xl"></i>
                    </div>
                </div>
                <div class="mt-2">
                    <span class="text-green-400 text-sm">
                        <i class="fas fa-chart-line mr-1"></i>
                        {stats.financial.ingresos > 0
                            ? "Activo"
                            : "Sin ingresos"}
                    </span>
                </div>
            </div>

            <!-- Gastos -->
            <div
                class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Gastos (30d)</p>
                        <h3 class="text-2xl font-bold text-red-400">
                            {formatCurrencyLocal(stats.financial.gastos)}
                        </h3>
                    </div>
                    <div
                        class="p-3 rounded-full bg-purple-500/20 text-purple-400"
                    >
                        <i class="fas fa-arrow-up text-xl"></i>
                    </div>
                </div>
                <div class="mt-2">
                    <a
                        href="/admin/cuentas"
                        class="text-purple-400 hover:text-purple-300 text-sm flex items-center"
                    >
                        Ver transacciones <i
                            class="fas fa-arrow-right ml-1 text-xs"
                        ></i>
                    </a>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Últimas Transacciones -->
            <div
                class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
            >
                <div class="p-4 border-b border-gray-700">
                    <h2 class="text-lg font-semibold flex items-center">
                        <i class="fas fa-exchange-alt mr-2 text-blue-400"></i>
                        Últimas Transacciones
                    </h2>
                </div>
                <div class="divide-y divide-gray-700">
                    {#if stats.recentTransactions.length > 0}
                        {#each stats.recentTransactions as trans}
                            <div
                                class="p-4 hover:bg-gray-750 transition-colors"
                            >
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="font-medium">
                                            {trans.concepto || "Sin concepto"}
                                        </div>
                                        <div class="text-sm text-gray-400">
                                            {trans.categoria || "Sin categoría"}
                                            • {formatDate(trans.fecha)}
                                        </div>
                                    </div>
                                    <div
                                        class="font-medium {trans.tipo ===
                                        'ingreso'
                                            ? 'text-green-400'
                                            : 'text-red-400'}"
                                    >
                                        {trans.tipo === "ingreso" ? "+" : "-"}
                                        {formatCurrencyLocal(trans.monto)}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div class="p-6 text-center text-gray-500">
                            <i class="fas fa-receipt text-3xl mb-2"></i>
                            <p>No hay transacciones recientes</p>
                        </div>
                    {/if}
                </div>
                <div class="p-4 border-t border-gray-700 text-right">
                    <a
                        href="/admin/cuentas"
                        class="text-sm text-blue-400 hover:text-blue-300"
                    >
                        Ver todas las transacciones <i
                            class="fas fa-arrow-right ml-1"
                        ></i>
                    </a>
                </div>
            </div>

            <!-- Últimos Productos -->
            <div
                class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
            >
                <div class="p-4 border-b border-gray-700">
                    <h2 class="text-lg font-semibold flex items-center">
                        <i class="fas fa-tshirt mr-2 text-green-400"></i>
                        Productos Recientes
                    </h2>
                </div>
                <div class="divide-y divide-gray-700">
                    {#if stats.recentProducts.length > 0}
                        {#each stats.recentProducts as product}
                            <div
                                class="p-4 hover:bg-gray-750 transition-colors"
                            >
                                <div class="flex justify-between items-start">
                                    <div>
                                        <div class="font-medium">
                                            {product.name || "Sin nombre"}
                                        </div>
                                        <div class="text-sm text-gray-400">
                                            Stock: {product.stock || 0} • {formatCurrencyLocal(
                                                product.valorVenta || 0,
                                            )}
                                        </div>
                                    </div>
                                    <div class="text-sm text-gray-400">
                                        {product.fechaRegistro
                                            ? formatDate(product.fechaRegistro)
                                            : "Sin fecha"}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div class="p-6 text-center text-gray-500">
                            <i class="fas fa-tshirt text-3xl mb-2"></i>
                            <p>No hay productos registrados</p>
                        </div>
                    {/if}
                </div>
                <div class="p-4 border-t border-gray-700 text-right">
                    <a
                        href="/admin/prendas"
                        class="text-sm text-green-400 hover:text-green-300"
                    >
                        Ver todos los productos <i
                            class="fas fa-arrow-right ml-1"
                        ></i>
                    </a>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8">
            <h2 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-bolt mr-2 text-yellow-400"></i>
                Acciones Rápidas
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                    href="/admin/prendas"
                    class="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-red-500 transition-colors text-center"
                >
                    <div class="text-red-400 mb-2">
                        <i class="fas fa-plus-circle text-2xl"></i>
                    </div>
                    <span class="text-sm">Nuevo Producto</span>
                </a>
                <a
                    href="/admin/proveedores"
                    class="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors text-center"
                >
                    <div class="text-blue-400 mb-2">
                        <i class="fas fa-truck text-2xl"></i>
                    </div>
                    <span class="text-sm">Nuevo Proveedor</span>
                </a>
                <a
                    href="/admin/cuentas"
                    class="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-green-500 transition-colors text-center"
                >
                    <div class="text-green-400 mb-2">
                        <i class="fas fa-plus-circle text-2xl"></i>
                    </div>
                    <span class="text-sm">Nueva Transacción</span>
                </a>
            </div>
        </div>
    {/if}
</div>
