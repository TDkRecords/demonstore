<script>
    import "@fortawesome/fontawesome-free/css/all.min.css";
    import CategoryCard from "$lib/components/CategoryCard.svelte";
    import { onMount } from "svelte";
    import {
        loadCategories,
        saveCategory,
        deleteCategoryByDocId,
        emptyCategory,
    } from "$lib/js/categoriesCrud";

    let formData = { ...emptyCategory() };
    let editingDocId = null;
    let categories = [];

    $: formTitle = editingDocId ? "Editar categoría" : "Nueva categoría";

    onMount(async () => {
        await refresh();
    });

    async function refresh() {
        categories = await loadCategories();
    }

    function startEdit(category) {
        editingDocId = category.docId;
        formData = { ...emptyCategory(), ...category };
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function clearForm() {
        formData = { ...emptyCategory() };
        editingDocId = null;
    }

    async function handleSave(e) {
        e.preventDefault();
        try {
            await saveCategory(formData, editingDocId);
            await refresh();
            clearForm();
            alert("Categoría guardada correctamente");
        } catch (err) {
            console.error(err);
            alert(err.message || "Error al guardar categoría");
        }
    }

    async function handleDelete(docId) {
        try {
            await deleteCategoryByDocId(docId);
            await refresh();
            if (editingDocId === docId) clearForm();
            alert("Categoría eliminada");
        } catch (err) {
            console.error(err);
            alert("Error al eliminar categoría");
        }
    }
</script>

<div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-6xl mx-auto space-y-6">
        <header class="flex items-center justify-between">
            <h1 class="text-3xl font-bold flex items-center gap-3">
                <i class="fas fa-tags"></i> Categorías
            </h1>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section
                class="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit"
            >
                <h2 class="text-xl font-semibold mb-4">{formTitle}</h2>

                <form on:submit|preventDefault={handleSave} class="space-y-4">
                    <div>
                        <label
                            for="codigo"
                            class="block text-sm font-medium text-gray-300 mb-1"
                            >Código *</label
                        >
                        <input
                            id="codigo"
                            type="text"
                            bind:value={formData.codigo}
                            required
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label
                            for="nombre"
                            class="block text-sm font-medium text-gray-300 mb-1"
                            >Nombre *</label
                        >
                        <input
                            id="nombre"
                            type="text"
                            bind:value={formData.nombre}
                            required
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label
                            for="descripcion"
                            class="block text-sm font-medium text-gray-300 mb-1"
                            >Descripción</label
                        >
                        <textarea
                            id="descripcion"
                            rows="3"
                            bind:value={formData.descripcion}
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-red-500"
                            placeholder="Detalles adicionales..."
                        ></textarea>
                    </div>

                    <div class="flex gap-2 pt-2">
                        <button
                            type="submit"
                            class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
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
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        {/if}
                    </div>
                </form>
            </section>

            <section class="lg:col-span-2">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-xl font-semibold">Listado de categorías</h2>
                    <div class="text-sm text-gray-400">
                        {categories.length}
                        {categories.length === 1 ? "categoría" : "categorías"}
                    </div>
                </div>

                {#if categories.length === 0}
                    <div
                        class="bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 p-8 text-center"
                    >
                        <i
                            class="fas fa-folder-open text-4xl text-gray-600 mb-2"
                        ></i>
                        <p class="text-gray-400">
                            No hay categorías registradas
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                            Crea tu primera categoría
                        </p>
                    </div>
                {:else}
                    <div class="space-y-3">
                        {#each categories as cat (cat.docId)}
                            <CategoryCard
                                category={cat}
                                onEdit={() => startEdit(cat)}
                                onDelete={() => handleDelete(cat.docId)}
                            />
                        {/each}
                    </div>
                {/if}
            </section>
        </div>
    </div>
</div>
