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
    runTransaction,
    getDoc
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
    tallasVendidas: []
});

export async function loadAccounts() {
    const q = query(collection(db, COLL), orderBy("fecha", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
}

function preparePayload(account, isEdit = false) {
    const payload = { ...account };

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
    const updatedSizes = { ...producto.sizes };
    const updatedNumericSizes = [...(producto.numericSizes || [])];

    for (const venta of tallasVendidas) {
        const { talla, cantidad, precioUnitario } = venta;

        if (producto.clothingType === 'top') {
            // Top clothing (XS, S, M, L, etc.)
            if (!updatedSizes[talla] || updatedSizes[talla] < cantidad) {
                throw new Error(`Stock insuficiente para talla ${talla}. Disponible: ${updatedSizes[talla] || 0}, Requerido: ${cantidad}`);
            }
            updatedSizes[talla] -= cantidad;
        } else {
            // Bottom clothing (numeric sizes)
            let tallasRemovidas = 0;

            for (let i = updatedNumericSizes.length - 1; i >= 0 && tallasRemovidas < cantidad; i--) {
                const size = updatedNumericSizes[i];
                let sizeValue;

                if (typeof size === 'number' || typeof size === 'string') {
                    sizeValue = String(size);
                } else if (size && typeof size === 'object') {
                    sizeValue = String(size.size || size.talla);
                }

                if (sizeValue === String(talla)) {
                    if (typeof size === 'number' || typeof size === 'string') {
                        // Simple array: remove the item
                        updatedNumericSizes.splice(i, 1);
                        tallasRemovidas++;
                    } else if (size && typeof size === 'object') {
                        // Object format: decrement quantity
                        const currentStock = size.quantity || 0;
                        if (currentStock < cantidad - tallasRemovidas) {
                            throw new Error(`Stock insuficiente para talla ${talla}`);
                        }
                        size.quantity -= (cantidad - tallasRemovidas);
                        tallasRemovidas = cantidad;
                    }
                }
            }

            if (tallasRemovidas < cantidad) {
                throw new Error(`Stock insuficiente para talla ${talla}. Solo se encontraron ${tallasRemovidas} unidades.`);
            }
        }

        totalVenta += cantidad * precioUnitario;
    }

    // Calculate new total stock
    const newStock = producto.clothingType === 'top'
        ? Object.values(updatedSizes).reduce((a, b) => a + b, 0)
        : updatedNumericSizes.length;

    // Update product
    transaction.update(productoRef, {
        sizes: updatedSizes,
        numericSizes: updatedNumericSizes,
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

        const productoData = productoDoc.data();

        // Update stock and calculate total
        const { totalVenta, productoNombre } = updateProductStock(
            transaction,
            productoRef,
            productoData,
            payload.tallasVendidas
        );

        payload.monto = totalVenta;
        payload.productoNombre = productoNombre;

        // Save transaction
        if (editingDocId) {
            const cuentaRef = doc(db, COLL, editingDocId);
            transaction.update(cuentaRef, payload);
        } else {
            const newDocRef = doc(collection(db, COLL));
            transaction.set(newDocRef, payload);
        }

        return { ok: true, totalVenta };
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