
import React, { useState } from 'react'
import CategoryPanel from './components/CategoryPanel'
import ProductPanel from './components/ProductPanel'
import OrderPanel from './components/OrderPanel'

const App: React.FC = () => {
  const [tab, setTab] = useState<'categories' | 'products' | 'orders'>('categories')
  return (
    <div className="app" dir="rtl">
      <header className="header">
        <h1>لوحة تحكم المتجر</h1>
        <nav className="nav">
          <button onClick={() => setTab('categories')}>التصنيفات</button>
          <button onClick={() => setTab('products')}>المنتجات</button>
          <button onClick={() => setTab('orders')}>الطلبات</button>
        </nav>
      </header>
      <main className="main">
        {tab === 'categories' && <CategoryPanel />}
        {tab === 'products' && <ProductPanel />}
        {tab === 'orders' && <OrderPanel />}
      </main>
    </div>
  )
}

export default App
