import React, { useEffect, useState } from 'react';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

type User = { name?: string } | string;

type Order = {
    _id: string;
    user?: User;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | string;
};

const OrderPanel: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    // Load orders from server
    const load = async () => {
        try {
            const res = await fetch(`${BASE}/api/order/all`);
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
            console.log(data)
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        const t = setTimeout(() => {
            load();
        }, 0);
        return () => clearTimeout(t);
    }, []);

    // Delete order
    const remove = async (id: string) => {
        if (!confirm('هل أنت متأكد؟')) return;
        try { await fetch(`${BASE}/api/order/delete/${id}`, { method: 'DELETE' }); load(); }
        catch (err) { console.error(err); }
    }

    // Update order status
    const changeStatus = async (id: string, status: string) => {
        try {
            await fetch(`${BASE}/api/order/update/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
            load();
        } catch (err) { console.error(err); alert('حدث خطأ أثناء تحديث الحالة'); }
    }

    return (
        <div className="panel">
            <h2>إدارة الطلبات</h2>

            <ul className="list">
                {orders.map(o => (
                    <li key={o._id}>
                        <div className="item">
                            <div className="meta">
                                <strong>طلب: {o._id}</strong>
                                <div>المستخدم: {typeof o.user === 'string' ? o.user : o.user?.name}</div>
                                <div>المبلغ الإجمالي: {o.totalAmount}</div>
                                <div>
                                    الحالة:
                                    <select value={o.status} onChange={e => changeStatus(o._id, e.target.value)}>
                                        <option value="pending">قيد المعالجة</option>
                                        <option value="confirmed">مؤكد</option>
                                        <option value="shipped">مرسل</option>
                                        <option value="delivered">تم التسليم</option>
                                        <option value="cancelled">ملغى</option>
                                    </select>
                                </div>
                            </div>
                            <div className="actions">
                                <button onClick={() => remove(o._id)}>حذف</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OrderPanel;
