import React, { useEffect, useState } from 'react';

// Simple base URL for the API server. Update if your server runs on another host/port.
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

// Category type used by this component
interface Category {
    _id: string;
    name: string;
    image?: string | null;
}

const CategoryPanel: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Load categories from the server
    const load = async () => {
        try {
            const res = await fetch(`${BASE}/api/category/all`);
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        const t = setTimeout(() => {
            load();
        }, 0);
        return () => clearTimeout(t);
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', name);
        if (imageFile) form.append('image', imageFile);
        try {
            if (editingId) {
                await fetch(`${BASE}/api/category/update/${editingId}`, { method: 'PUT', body: form });
            } else {
                await fetch(`${BASE}/api/category/create`, { method: 'POST', body: form });
            }
            setName(''); setImageFile(null); setEditingId(null); load();
        } catch (err) { console.error(err); alert('حدث خطأ'); }
    };

    const edit = (cat: Category) => { setEditingId(cat._id); setName(cat.name); };
    const remove = async (id: string) => {
        if (!confirm('هل أنت متأكد؟')) return;
        try {
            await fetch(`${BASE}/api/category/delete/${id}`, { method: 'DELETE' });
            load();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="panel">
            <h2>إدارة التصنيفات</h2>
            <form onSubmit={submit} className="form">
                <label>الاسم</label>
                <input value={name} onChange={e => setName(e.target.value)} required />
                <label>الصورة (اختياري)</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                <button type="submit">{editingId ? 'تحديث' : 'إضافة'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setName(''); }}>إلغاء</button>}
            </form>

            <ul className="list">
                {categories.map(c => {
                    const img = c.image ? (c.image.startsWith('http') ? c.image : `${BASE}${c.image}`) : `${BASE}/uploads/placeholder.png`;
                    return (
                        <li key={c._id}>
                            <div className="item">
                                <img src={img} alt={c.name} />
                                <div className="meta"><strong>{c.name}</strong></div>
                                <div className="actions">
                                    <button onClick={() => edit(c)}>تعديل</button>
                                    <button onClick={() => remove(c._id)}>حذف</button>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

export default CategoryPanel;
