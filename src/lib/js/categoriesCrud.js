import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    getDocs,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db } from "$lib/js/firebase.js";

const COLL = "categorias";

export const emptyCategory = () => ({
    codigo: "",
    nombre: "",
    descripcion: "",
    fechaCreacion: null,
    fechaActualizacion: null
});

export async function loadCategories() {
    const q = query(collection(db, COLL), orderBy("fechaCreacion", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
}

function preparePayload(category, isEdit = false) {
    const payload = { ...category };

    // Remove client-only fields if any
    delete payload.docId;

    // Ensure empty strings are present for required fields
    payload.codigo = payload.codigo || "";
    payload.nombre = payload.nombre || "";
    payload.descripcion = payload.descripcion || "";

    // Timestamps handled by caller
    return payload;
}

export async function saveCategory(category, editingDocId = null) {
    const payload = preparePayload(category, !!editingDocId);

    if (editingDocId) {
        // Update
        await updateDoc(doc(db, COLL, editingDocId), {
            ...payload,
            fechaActualizacion: serverTimestamp()
        });
    } else {
        // Create
        await addDoc(collection(db, COLL), {
            ...payload,
            fechaCreacion: serverTimestamp(),
            fechaActualizacion: serverTimestamp()
        });
    }

    return { ok: true };
}

export async function deleteCategoryByDocId(docId) {
    await deleteDoc(doc(db, COLL, docId));
    return { ok: true };
}