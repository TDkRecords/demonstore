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
    Timestamp,
    runTransaction
} from "firebase/firestore";
import { db } from "$lib/js/firebase.js";

const COLL = "cuentas";
const PRODUCTS_COLL = "products";

export const emptyAccount = () => ({
    monto: 0,
    tipo: "gasto",
    categoria: "",
    descripcion: "",
    fecha: "",
    fechaRegistro: "",
    productoId: "",
    productoNombre: "",
    tallasVendidas: [],
    currentTalla: "",
    currentCantidad: 1
});

export async function loadAccounts() {
    const q = query(collection(db, COLL), orderBy("fecha", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
}

function preparePayload(account, isEdit = false) {
    const payload = { ...account };

    // Remove temporary UI fields
    delete payload.currentTalla;
    delete payload.currentCantidad;

    // Convert date
    if (payload.fecha && !(payload.fecha instanceof Timestamp)) {
        payload.fecha = Timestamp.fromDate(new Date(payload.fecha));
    }

    // Set registration date for new records
    if (!isEdit) {
        payload.fechaRegistro = serverTimestamp();
    }

    return payload;
}

function updateProductStock(transaction, productoRef, producto, tallasVendidas) {
    let totalVenta = 0;

    for (const venta of tallasVendidas) {
        const { talla, cantidad, precioUnitario } = venta;

        if (producto.clothingType === 'top') {
            // Top clothing (XS, S, M, L, etc.)
            if (!producto.sizes[talla] || producto.sizes[talla] < cantidad) {
                throw new Error(`Stock insuficiente para talla ${talla}`);
            }
            producto.sizes[talla] -= cantidad;
        } else {
            // Bottom clothing (numeric sizes)
            const sizeIndex = producto.numericSizes.findIndex((size, idx) => {
                if (typeof size === 'number' || typeof size === 'string') {
                    return String(size) === String(talla);
                }
                if (size && typeof size === 'object') {
                    return String(size.size || size.talla) === String(talla);
                }
                return false;
            });

            if (sizeIndex === -1) {
                throw new Error(`Talla ${talla} no encontrada`);
            }

            const sizeObj = producto.numericSizes[sizeIndex];

            if (typeof sizeObj === 'number' || typeof sizeObj === 'string') {
                // Simple array: remove sold items
                producto.numericSizes.splice(sizeIndex, Math.min(cantidad, producto.numericSizes.length - sizeIndex));
            } else if (sizeObj && typeof sizeObj === 'object') {
                // Object format: decrement stock
                const currentStock = sizeObj.stock || 0;
                if (currentStock < cantidad) {
                    throw new Error(`Stock insuficiente para talla ${talla}`);
                }
                sizeObj.stock -= cantidad;
            }
        }

        totalVenta += cantidad * precioUnitario;
    }

    // Calculate new total stock
    const newStock = producto.clothingType === 'top'
        ? Object.values(producto.sizes).reduce((a, b) => a + b, 0)
        : producto.numericSizes.length;

    // Update product
    transaction.update(productoRef, {
        sizes: producto.sizes,
        numericSizes: producto.numericSizes,
        stock: newStock
    });

    return { totalVenta, productoNombre: producto.name };
}

async function saveProductSale(payload, editingDocId) {
    return runTransaction(db, async (transaction) => {
        // Get product
        const productoRef = doc(db, PRODUCTS_COLL, payload.productoId);
        const productoDoc = await transaction.get(productoRef);

        if (!productoDoc.exists()) {
            throw new Error('Producto no encontrado');
        }

        // Update stock and calculate total
        const { totalVenta, productoNombre } = updateProductStock(
            transaction,
            productoRef,
            productoDoc.data(),
            payload.tallasVendidas
        );

        payload.monto = totalVenta;
        payload.productoNombre = productoNombre;

        // Save transaction
        if (editingDocId) {
            transaction.update(doc(db, COLL, editingDocId), payload);
        } else {
            const newDocRef = doc(collection(db, COLL));
            transaction.set(newDocRef, payload);
        }

        return { ok: true };
    });
}

export async function saveAccount(account, editingDocId = null) {
    const payload = preparePayload(account, !!editingDocId);

    // Handle product sales with stock updates
    if (payload.tipo === 'ingreso' &&
        Array.isArray(payload.tallasVendidas) &&
        payload.tallasVendidas.length > 0) {
        return saveProductSale(payload, editingDocId);
    }

    // Handle regular transactions (expenses, etc.)
    if (editingDocId) {
        await updateDoc(doc(db, COLL, editingDocId), payload);
    } else {
        await addDoc(collection(db, COLL), payload);
    }

    return { ok: true };
}

export async function deleteAccountByDocId(docId) {
    await deleteDoc(doc(db, COLL, docId));
    return { ok: true };
}