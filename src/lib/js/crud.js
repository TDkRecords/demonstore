// $lib/js/productsCrud.js
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    limit,
} from "firebase/firestore";
import { db } from "$lib/js/firebase.js";

const COLL = "products";

export const emptyProduct = () => ({
    name: "",
    description: "",
    valorCompra: 0,
    valorVenta: 0,
    image: "",
    providerId: null,
    categoryId: null, // Reference to the category document ID
    clothingType: "top", // 'top' or 'bottom'
    sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, universal: 0 }, // for top
    numericSizes: [], // for bottom
    stock: 0,
});

export async function loadProducts() {
    const q = query(collection(db, COLL), orderBy("id", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
}

export async function getNextProductId() {
    const q = query(collection(db, COLL), orderBy("id", "desc"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return 1;
    const max = snap.docs[0].data().id ?? 0;
    return max + 1;
}

export async function saveProduct(product, editingDocId = null) {
    const payload = { ...product };
    if (!payload.image) payload.image = "/imagenotfound.jpg";

    if (editingDocId) {
        await updateDoc(doc(db, COLL, editingDocId), payload);
        return { updated: true };
    } else {
        if (!payload.id) payload.id = await getNextProductId();
        await addDoc(collection(db, COLL), payload);
        return { created: true };
    }
}

export async function deleteProductByDocId(docId) {
    await deleteDoc(doc(db, COLL, docId));
    return { deleted: true };
}
