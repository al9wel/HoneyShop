import React, { useEffect, useState } from 'react';
import { CategoryAPI, BASE } from '../api';

const CategoryPanel: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const load = async () => {
        const res: any = await CategoryAPI.list();
        if (Array.isArray(res)) setCategories(res);
    };

    useEffect(() => { load(); }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', name);
        if (imageFile) form.append('image', imageFile);
        try {
            if (editingId) await CategoryAPI.update(editingId, form);
            else await CategoryAPI.create(form);
            setName(''); setImageFile(null); setEditingId(null); load();
        } catch (err) { alert('حدث خطأ'); }
    };

    const edit = (cat: any) => { setEditingId(cat._id); setName(cat.name); };
    const remove = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; await CategoryAPI.delete(id); load(); };

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
