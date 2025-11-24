import React, { useEffect, useState } from 'react';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const ProductPanel: React.FC = () => {
    interface Product {
        _id: string;
        name: string;
        price: number;
        description?: string;
        category?: {
            _id: string;
            name: string;
        };
        size?: number;
        // images may come from server as an array or as a single string
        images?: string[] | string;
        // newer server version stores a single image path in `image`
        image?: string;
    }

    interface Category {
        _id: string;
        name: string;
    }

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    interface ProductForm {
        name: string;
        price: string;
        description: string;
        category: string;
        size: string;
    }
    const [form, setForm] = useState<ProductForm>({ name: '', price: '', description: '', category: '', size: '' });
    const [images, setImages] = useState<FileList | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Load products and categories from server
    const load = async () => {
        try {
            const pRes = await fetch(`${BASE}/api/product/all`);
            const pData = await pRes.json();
            console.log('Loaded categories:', pData);
            if (Array.isArray(pData)) setProducts(pData);
        } catch (err) { console.error('load products', err); }
        try {
            const cRes = await fetch(`${BASE}/api/category/all`);
            const cData = await cRes.json();
            if (Array.isArray(cData)) setCategories(cData);
        } catch (err) { console.error('load categories', err); }
    };

    useEffect(() => {
        const t = setTimeout(() => {
            load();
        }, 0);
        return () => clearTimeout(t);
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // If there are files, send as FormData; otherwise send JSON
            if (images && images.length) {
                const fd = new FormData();
                fd.append('name', form.name);
                fd.append('price', String(form.price));
                fd.append('description', form.description);
                fd.append('category', form.category);
                fd.append('size', String(form.size));
                Array.from(images).forEach(f => fd.append('images', f));
                if (editingId) await fetch(`${BASE}/api/product/update/${editingId}`, { method: 'PUT', body: fd });
                else await fetch(`${BASE}/api/product/create`, { method: 'POST', body: fd });
            } else {
                const body = { ...form };
                if (editingId) await fetch(`${BASE}/api/product/update/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
                else await fetch(`${BASE}/api/product/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            }
            setForm({ name: '', price: '', description: '', category: '', size: '' }); setImages(null); setEditingId(null); load();
        } catch (err) { console.error(err); alert('حدث خطأ'); }
    };

    const edit = (p: Product) => { setEditingId(p._id); setForm({ name: p.name, price: String(p.price), description: p.description || '', category: p.category?._id || '', size: p.size ? String(p.size) : '' }); }
    const remove = async (id: string) => {
        if (!confirm('هل أنت متأكد؟')) return;
        try { await fetch(`${BASE}/api/product/delete/${id}`, { method: 'DELETE' }); load(); }
        catch (err) { console.error(err); }
    }

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
                    // Normalize image from server: prefer `p.image` (single string), then `p.images` if present
                    const first = p.image || (Array.isArray(p.images) ? (p.images.length ? p.images[0] : null) : (typeof p.images === 'string' ? p.images : null));
                    const img = first ? (String(first).startsWith('http') ? String(first) : `${BASE}${String(first)}`) : `${BASE}/uploads/placeholder.png`;
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
