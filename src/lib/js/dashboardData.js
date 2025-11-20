import { collection, getDocs, query, where, getCountFromServer, orderBy, limit } from 'firebase/firestore';
import { db } from '$lib/js/firebase.js';

// Obtener conteo de productos con bajo stock (menos de 5 unidades)
export async function getLowStockCount() {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('stock', '<=', 5));
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch (error) {
        console.error('Error getting low stock count:', error);
        return 0;
    }
}

// Obtener conteo total de productos
export async function getTotalProducts() {
    try {
        const productsRef = collection(db, 'products');
        const snapshot = await getCountFromServer(productsRef);
        return snapshot.data().count;
    } catch (error) {
        console.error('Error getting total products:', error);
        return 0;
    }
}

// Obtener conteo total de proveedores
export async function getTotalProviders() {
    try {
        const providersRef = collection(db, 'proveedores');
        const snapshot = await getCountFromServer(providersRef);
        return snapshot.data().count;
    } catch (error) {
        console.error('Error getting total providers:', error);
        return 0;
    }
}

// Obtener transacciones recientes
export async function getRecentTransactions(limitCount = 5) {
    try {
        const transactionsRef = collection(db, 'cuentas');
        const q = query(transactionsRef, orderBy('fecha', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Asegurarse de que la fecha sea manejada correctamente
                fecha: data.fecha?.toDate ? data.fecha.toDate() : (data.fecha || new Date())
            };
        });
    } catch (error) {
        console.error('Error getting recent transactions:', error);
        return [];
    }
}

// Obtener productos recién agregados
export async function getRecentProducts(limitCount = 5) {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('id', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Asegurar que los valores numéricos sean números
                valorVenta: Number(data.valorVenta) || 0,
                stock: Number(data.stock) || 0
            };
        });
    } catch (error) {
        console.error('Error getting recent products:', error);
        return [];
    }
}

// Obtener resumen financiero
export async function getFinancialSummary() {
    try {
        const transactionsRef = collection(db, 'cuentas');
        const snapshot = await getDocs(transactionsRef);

        let ingresos = 0;
        let gastos = 0;

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const monto = Number(data.monto) || 0;
            if (data.tipo === 'ingreso') {
                ingresos += monto;
            } else if (data.tipo === 'gasto') {
                gastos += monto;
            }
        });

        return {
            ingresos,
            gastos,
            balance: ingresos - gastos
        };
    } catch (error) {
        console.error('Error getting financial summary:', error);
        return {
            ingresos: 0,
            gastos: 0,
            balance: 0
        };
    }
}

// Obtener productos más vendidos (esto es un ejemplo, necesitarías una colección de ventas)
export async function getTopSellingProducts(limitCount = 5) {
    // Esto es un placeholder - necesitarías implementar la lógica real basada en tu estructura de datos
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('stock', 'asc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
