import React, { useEffect, useState } from 'react';
import { OrderAPI } from '../api';

const OrderPanel: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);

    const load = async () => {
        const o: any = await OrderAPI.list(); if (Array.isArray(o)) setOrders(o);
    };

    useEffect(() => { load(); }, []);

    const remove = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; await OrderAPI.delete(id); load(); }

    const changeStatus = async (id: string, status: string) => {
        try {
            await OrderAPI.update(id, { status });
            load();
        } catch { alert('حدث خطأ أثناء تحديث الحالة'); }
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
                                <div>المستخدم: {o.user?.name || o.user}</div>
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
