import React, { useEffect, useState } from 'react';
import { ProductAPI, CategoryAPI, BASE } from '../api';

const ProductPanel: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [form, setForm] = useState<any>({ name: '', price: '', description: '', category: '', size: '' });
    const [images, setImages] = useState<FileList | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const load = async () => {
        const p: any = await ProductAPI.list();
        if (Array.isArray(p)) setProducts(p);
        const c: any = await CategoryAPI.list();
        if (Array.isArray(c)) setCategories(c);
    };

    useEffect(() => { load(); }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // use FormData when files present
            let payload: any = form;
            if (images && images.length) {
                const fd = new FormData();
                fd.append('name', form.name);
                fd.append('price', String(form.price));
                fd.append('description', form.description);
                fd.append('category', form.category);
                fd.append('size', String(form.size));
                Array.from(images).forEach(f => fd.append('images', f));
                payload = fd;
            }
            if (editingId) await ProductAPI.update(editingId, payload);
            else await ProductAPI.create(payload);
            setForm({ name: '', price: '', description: '', category: '', size: '' }); setImages(null); setEditingId(null); load();
        } catch (err) { alert('حدث خطأ'); }
    };

    const edit = (p: any) => { setEditingId(p._id); setForm({ name: p.name, price: p.price, description: p.description || '', category: p.category?._id || '', size: p.size || '' }); }
    const remove = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; await ProductAPI.delete(id); load(); }

    return (
        <div className="panel">
            <h2>إدارة المنتجات</h2>
            <form onSubmit={submit} className="form">
                <label>الاسم</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <label>السعر</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                <label>الوصف</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <label>التصنيف</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">--</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <label>الحجم (مل)</label>
                <input type="number" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
                <label>صور المنتج (اختياري)</label>
                <input type="file" accept="image/*" multiple onChange={e => setImages(e.target.files)} />
                <button type="submit">{editingId ? 'تحديث' : 'إضافة'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', price: '', description: '', category: '', size: '' }) }}>إلغاء</button>}
            </form>

            <ul className="list">
                {products.map(p => {
                    const first = p.images && p.images.length ? p.images[0] : null;
                    const img = first ? (first.startsWith('http') ? first : `${BASE}${first}`) : `${BASE}/uploads/placeholder.png`;
                    return (
                        <li key={p._id}>
                            <div className="item">
                                <img src={img} alt={p.name} />
                                <div className="meta">
                                    <strong>{p.name}</strong>
                                    <div>السعر: {p.price}</div>
                                    <div>التصنيف: {p.category?.name || '-'}</div>
                                </div>
                                <div className="actions">
                                    <button onClick={() => edit(p)}>تعديل</button>
                                    <button onClick={() => remove(p._id)}>حذف</button>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

export default ProductPanel;
