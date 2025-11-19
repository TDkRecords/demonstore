<script>
    import ProviderCard from "$lib/components/ProviderCard.svelte";
    import "@fortawesome/fontawesome-free/css/all.min.css";
    import { onMount } from "svelte";
    import {
        loadProviders,
        saveProvider,
        deleteProviderByDocId,
        getNextId,
    } from "$lib/js/providersCrud.js";

    import { Timestamp } from "firebase/firestore";

    // Form fields
    let editingDocId = null; // docId de Firestore cuando estamos editando
    let id = null;
    let empresa = "";
    let tipo = "";
    let address = "";
    let phone = "";
    let email = "";
    let website = "";
    let nombre = "";
    let cargo = "";
    let pais = "";
    let ciudad = "";
    let fecha = ""; // bind to input[type=date] -> yyyy-mm-dd
    let comentarios = "";
    let image = "";

    let preview = "/imagenotfound.jpg";

    let providers = [];

    $: preview = image && image.trim() !== "" ? image : "/imagenotfound.jpg";

    onMount(async () => {
        await refresh();
    });

    async function refresh() {
        providers = await loadProviders();
    }

    function clearForm() {
        editingDocId = null;
        id = null;
        empresa = "";
        tipo = "";
        address = "";
        phone = "";
        email = "";
        website = "";
        nombre = "";
        cargo = "";
        pais = "";
        ciudad = "";
        fecha = "";
        comentarios = "";
        image = "";
    }

    async function handleSave(e) {
        e.preventDefault();

        // Si no hay id y no estamos editando, pedir siguiente id
        if (!id) id = await getNextId();

        const payload = {
            id: Number(id),
            empresa,
            tipo,
            address,
            phone,
            email,
            website,
            nombre,
            cargo,
            pais,
            ciudad,
            fecha: fecha || null, // saveProvider convertirá a Timestamp o serverTimestamp
            comentarios,
            image,
        };

        await saveProvider(payload, editingDocId);
        await refresh();
        clearForm();
    }

    function startEdit(provider) {
        // provider viene del loadProviders con docId
        editingDocId = provider.docId;
        id = provider.id;
        empresa = provider.empresa ?? "";
        tipo = provider.tipo ?? "";
        address = provider.address ?? "";
        phone = provider.phone ?? "";
        email = provider.email ?? "";
        website = provider.website ?? "";
        nombre = provider.nombre ?? "";
        cargo = provider.cargo ?? "";
        pais = provider.pais ?? "";
        ciudad = provider.ciudad ?? "";
        // fecha puede ser Timestamp -> convertir a yyyy-mm-dd
        if (provider.fecha && provider.fecha.toDate) {
            const d = provider.fecha.toDate();
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            fecha = `${y}-${m}-${day}`;
        } else {
            fecha = provider.fecha ?? "";
        }
        comentarios = provider.comentarios ?? "";
        image = provider.image ?? "";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function remove(docId) {
        if (!confirm("¿Eliminar proveedor?")) return;
        await deleteProviderByDocId(docId);
        await refresh();
    }

    const imgSrc = (p) =>
        p?.image && p.image.trim() !== "" ? p.image : "/imagenotfound.jpg";
</script>

<div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-6xl mx-auto space-y-6">
        <header class="flex items-center justify-between">
            <h1 class="text-3xl font-bold flex items-center gap-3">
                <i class="fas fa-handshake"></i> Proveedores
            </h1>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- FORM -->
            <section
                class="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit"
            >
                <h2 class="text-xl font-semibold mb-4">
                    {editingDocId ? "Editar proveedor" : "Agregar proveedor"}
                </h2>

                <form on:submit|preventDefault={handleSave} class="space-y-4">
                    <!-- Empresa -->
                    <div>
                        <label class="text-sm text-gray-300" for="empresa"
                            >Empresa</label
                        >
                        <input
                            id="empresa"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={empresa}
                            required
                        />
                    </div>

                    <!-- Descripción = tipo -->
                    <div>
                        <label class="text-sm text-gray-300" for="tipo"
                            >Tipo</label
                        >
                        <input
                            id="tipo"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={tipo}
                        />
                    </div>

                    <!-- Address -->
                    <div>
                        <label class="text-sm text-gray-300" for="address"
                            >Dirección</label
                        >
                        <input
                            id="address"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={address}
                        />
                    </div>

                    <!-- Phone -->
                    <div>
                        <label class="text-sm text-gray-300" for="phone"
                            >Teléfono</label
                        >
                        <input
                            id="phone"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={phone}
                        />
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="text-sm text-gray-300" for="email"
                            >Email</label
                        >
                        <input
                            id="email"
                            type="email"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={email}
                        />
                    </div>

                    <!-- Website -->
                    <div>
                        <label class="text-sm text-gray-300" for="website"
                            >Website</label
                        >
                        <input
                            id="website"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={website}
                        />
                    </div>

                    <!-- Nombre (contacto) -->
                    <div>
                        <label class="text-sm text-gray-300" for="nombre"
                            >Nombre (contacto)</label
                        >
                        <input
                            id="nombre"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={nombre}
                        />
                    </div>

                    <!-- Cargo -->
                    <div>
                        <label class="text-sm text-gray-300" for="cargo"
                            >Cargo</label
                        >
                        <input
                            id="cargo"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={cargo}
                        />
                    </div>

                    <!-- Pais / Ciudad -->
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="text-sm text-gray-300" for="pais"
                                >País</label
                            >
                            <input
                                id="pais"
                                class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                                bind:value={pais}
                            />
                        </div>
                        <div>
                            <label class="text-sm text-gray-300" for="ciudad"
                                >Ciudad</label
                            >
                            <input
                                id="ciudad"
                                class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                                bind:value={ciudad}
                            />
                        </div>
                    </div>

                    <!-- Fecha -->
                    <div>
                        <label class="text-sm text-gray-300" for="fecha"
                            >Fecha</label
                        >
                        <input
                            id="fecha"
                            type="date"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={fecha}
                        />
                    </div>

                    <!-- Comentarios -->
                    <div>
                        <label class="text-sm text-gray-300" for="comentarios"
                            >Comentarios</label
                        >
                        <textarea
                            id="comentarios"
                            rows="3"
                            class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                            bind:value={comentarios}
                        ></textarea>
                    </div>

                    <!-- Imagen + preview -->
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center"
                    >
                        <div>
                            <label class="text-sm text-gray-300" for="image"
                                >Imagen (URL)</label
                            >
                            <input
                                id="image"
                                class="w-full px-3 py-2 rounded bg-gray-900 text-white"
                                bind:value={image}
                                placeholder="https://..."
                                on:input={() =>
                                    (preview =
                                        image && image.trim()
                                            ? image
                                            : "/imagenotfound.jpg")}
                            />
                        </div>

                        <div class="flex justify-center">
                            <img
                                src={preview}
                                alt="preview"
                                class="w-28 h-28 md:w-32 md:h-32 object-cover rounded border border-gray-700"
                                on:error={(e) => {
                                    if (!e.target.dataset.failed) {
                                        e.target.dataset.failed = true;
                                        e.target.src = "/imagenotfound.jpg";
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div class="flex gap-3 pt-2">
                        <button
                            class="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                            type="submit"
                        >
                            <i class="fas fa-save mr-2"></i>{editingDocId
                                ? "Actualizar"
                                : "Guardar"}
                        </button>

                        <button
                            type="button"
                            on:click={clearForm}
                            class="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                        >
                            <i class="fas fa-times mr-2"></i>Limpiar
                        </button>
                    </div>
                </form>
            </section>

            <!-- LIST ( ocupa 2 col en desktop ) -->
            <section class="lg:col-span-2">
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                    {#if providers.length === 0}
                        <div
                            class="col-span-full text-center py-12 text-gray-400 border border-gray-700 rounded"
                        >
                            No hay proveedores
                        </div>
                    {:else}
                        {#each providers as p (p.docId)}
                            <ProviderCard
                                provider={p}
                                {imgSrc}
                                onEdit={startEdit}
                                onDelete={remove}
                            />
                        {/each}
                    {/if}
                </div>
            </section>
        </div>
    </div>
</div>
