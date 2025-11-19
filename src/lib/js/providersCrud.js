// $lib/js/providersCrud.js
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "$lib/js/firebase.js";

const COLL = "proveedores";

export async function loadProviders() {
    const q = query(collection(db, COLL), orderBy("id", "desc"));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.data().id, docId: d.id, ...d.data() }));
    return list;
}

export async function getNextId() {
    const q = query(collection(db, COLL), orderBy("id", "desc"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return 1;
    const max = snap.docs[0].data().id ?? 0;
    return max + 1;
}

export async function saveProvider(provider, editingDocId = null) {
    // provider: objeto con campos: id:number, empresa, tipo, address, phone, email, website,
    // nombre, cargo, pais, ciudad, fecha (string yyyy-mm-dd o empty), comentarios, image (url)
    const payload = { ...provider };

    // Fecha: si viene como string, convertir a Timestamp; si viene vacío usar serverTimestamp
    if (payload.fecha) {
        // si ya es Timestamp, dejarlo
        if (!(payload.fecha instanceof Timestamp)) {
            const d = new Date(payload.fecha);
            payload.fecha = Timestamp.fromDate(d);
        }
    } else {
        payload.fecha = serverTimestamp();
    }

    if (editingDocId) {
        // actualizar (mantener id)
        const docRef = doc(db, COLL, editingDocId);
        await updateDoc(docRef, payload);
        return { ok: true };
    } else {
        // crear: si no viene id, calcular
        if (!payload.id) payload.id = await getNextId();
        await addDoc(collection(db, COLL), payload);
        return { ok: true };
    }
}

export async function deleteProviderByDocId(docId) {
    await deleteDoc(doc(db, COLL, docId));
}
