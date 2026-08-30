import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CustomerNavbar from './components/CustomerNavbar';
import DashboardStats from './components/DashboardStats';
import OrderTable from './components/OrderTable';
import OrderModal from './components/OrderModal';
import CustomerTrackingView from './components/CustomerTrackingView';
import InvoiceSlipModal from './components/InvoiceSlipModal';
import TripManagerModal from './components/TripManagerModal';
import WeightCalculatorModal from './components/WeightCalculatorModal';
import ExportImportModal from './components/ExportImportModal';
import AdminLoginModal from './components/AdminLoginModal';
import StoreSettingsModal from './components/StoreSettingsModal';
import { api } from './services/api';

import { INITIAL_ORDERS, INITIAL_TRIPS } from './utils/initialData';
import { ORDER_STATUSES } from './types/data';

const STORAGE_KEY_ORDERS = 'koi_japan_shop_orders_v2';
const STORAGE_KEY_TRIPS = 'koi_japan_shop_trips_v2';
const STORAGE_KEY_ROLE = 'koi_japan_shop_role_v2';
const STORAGE_KEY_SETTINGS = 'koi_japan_shop_settings_v2';

const DEFAULT_SETTINGS = {
  shopName: 'KOI Japan Shop',
  shopTagline: 'บริการพรีออเดอร์ & ขนส่งสินค้าจากญี่ปุ่น ชั่งน้ำหนักจริง ส่งตรงถึงบ้าน',
  phone: '081-234-5678',
  lineId: '@koijapanshop',
  lineUrl: 'https://line.me',
  facebook: 'KOI Japan Shop',
  instagram: '@koijapan.shop',
  address: 'กรุงเทพมหานคร ประเทศไทย',
  bankName: 'กสิกรไทย (KBANK)',
  bankAccountNo: '123-4-56789-0',
  bankAccountName: 'KOI Japan Shop',
  promptpay: '081-234-5678',
  adminPin: '1234',
  requirePin: true
};

export default function App() {
  // Read initial query params from URL
  const searchParams = new URLSearchParams(window.location.search);
  const modeParam = searchParams.get('mode');
  const trackParam = searchParams.get('track') || '';

  // Determine initial role: default is ALWAYS 'customer' unless explicitly ?mode=admin
  const getInitialRole = () => {
    if (modeParam === 'admin') return 'admin';
    return 'customer';
  };

  const initialMode = getInitialRole();
  const initialTrackParam = trackParam;

  // Application State with LocalStorage Persistence
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      // Only use INITIAL_ORDERS if user has never visited or saved
      return INITIAL_ORDERS;
    } catch {
      return [];
    }
  });

  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIPS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return INITIAL_TRIPS;
    } catch {
      return [];
    }
  });

  // Store Settings (LINE, Phone, Bank, PIN, etc.)
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [lastSavedTime, setLastSavedTime] = useState(() => new Date().toLocaleTimeString('th-TH'));

  // Direct Synchronous Storage Writers
  const persistOrders = useCallback((newOrders) => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(newOrders));
      setLastSavedTime(new Date().toLocaleTimeString('th-TH'));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, []);

  const persistTrips = useCallback((newTrips) => {
    try {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(newTrips));
      setLastSavedTime(new Date().toLocaleTimeString('th-TH'));
    } catch (e) {
      console.error('Failed to save trips to localStorage', e);
    }
  }, []);

  const persistSettings = useCallback((newSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
      setLastSavedTime(new Date().toLocaleTimeString('th-TH'));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, []);

  // Sync to LocalStorage on state changes as backup
  useEffect(() => {
    persistOrders(orders);
  }, [orders, persistOrders]);

  useEffect(() => {
    persistTrips(trips);
  }, [trips, persistTrips]);

  useEffect(() => {
    persistSettings(settings);
  }, [settings, persistSettings]);

  // View mode: 'admin' or 'customer'
  const [viewMode, setViewMode] = useState(initialMode);
  const [customerTrackCode, setCustomerTrackCode] = useState(initialTrackParam);

  // Modals state
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active filters for Admin
  const [selectedTrip, setSelectedTrip] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [slipOrder, setSlipOrder] = useState(null);

  const [isTripManagerOpen, setIsTripManagerOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync document title and URL mode
  useEffect(() => {
    if (viewMode === 'customer') {
      document.title = `${settings.shopName || 'KOI Japan Shop'} — ตรวจสอบสถานะพัสดุและค่าน้ำหนัก`;
    } else {
      document.title = `${settings.shopName || 'KOI Japan Shop'} — ระบบจัดการร้านค้า & คำนวณค่าน้ำหนัก`;
    }
  }, [viewMode, settings.shopName]);

  // Cloud Sync on Mount
  useEffect(() => {
    async function syncWithCloud() {
      try {
        const [cloudOrders, cloudTrips, cloudSettings] = await Promise.all([
          api.getOrders(),
          api.getTrips(),
          api.getSettings()
        ]);

        if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
          setOrders(cloudOrders);
          persistOrders(cloudOrders);
        }
        if (Array.isArray(cloudTrips) && cloudTrips.length > 0) {
          setTrips(cloudTrips);
          persistTrips(cloudTrips);
        }
        if (cloudSettings) {
          setSettings(cloudSettings);
          persistSettings(cloudSettings);
        }
      } catch (e) {
        console.warn('Cloud sync offline or using local storage', e);
      }
    }
    syncWithCloud();
  }, [persistOrders, persistTrips, persistSettings]);

  // Settings Save Handler
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    persistSettings(newSettings);
    api.saveSettings(newSettings);
    showToast('💾 บันทึกข้อมูลร้านค้าและรหัสผ่านเรียบร้อยแล้ว');
  };

  // Order Handlers with Immediate Synchronous LocalStorage write & Cloud DB sync
  const handleOpenNewOrder = () => {
    setEditingOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = (orderData) => {
    if (editingOrder) {
      setOrders(prev => {
        const next = prev.map(o => o.id === orderData.id ? orderData : o);
        persistOrders(next);
        return next;
      });
      api.saveOrder(orderData, false);
      showToast(`💾 บันทึกการแก้ไข ${orderData.id} เรียบร้อยแล้ว`);
    } else {
      setOrders(prev => {
        const next = [orderData, ...prev];
        persistOrders(next);
        return next;
      });
      api.saveOrder(orderData, true);
      showToast(`💾 เพิ่มรายการใหม่ ${orderData.id} สำเร็จ!`);
    }
  };

  // Inline Quick Update handler (e.g. changing weight, rate, quantity, price directly on the table)
  const handleQuickUpdateOrder = (orderId, field, value) => {
    setOrders(prev => {
      let targetOrder = null;
      const next = prev.map(o => {
        if (o.id !== orderId) return o;
        const updated = {
          ...o,
          [field]: value,
          updatedAt: new Date().toISOString()
        };
        targetOrder = updated;
        return updated;
      });
      persistOrders(next);
      if (targetOrder) {
        api.saveOrder(targetOrder, false);
      }
      return next;
    });
    showToast(`💾 อัปเดต ${field} อัตโนมัติ`);
  };

  const handleDeleteOrder = (orderId) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการพัสดุ "${orderId}"?`)) {
      setOrders(prev => {
        const next = prev.filter(o => o.id !== orderId);
        persistOrders(next);
        return next;
      });
      api.deleteOrder(orderId);
      showToast(`ลบรายการ ${orderId} เรียบร้อยแล้ว`);
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    const statusObj = ORDER_STATUSES.find(s => s.id === newStatus);
    setOrders(prev => {
      let targetOrder = null;
      const next = prev.map(o => {
        if (o.id !== orderId) return o;

        const newLog = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: `เปลี่ยนสถานะเป็น ${statusObj ? statusObj.labelShort : newStatus}`
        };

        const existingLogs = Array.isArray(o.statusLogs) ? o.statusLogs : [];

        const updated = {
          ...o,
          status: newStatus,
          statusLogs: [...existingLogs, newLog],
          updatedAt: new Date().toISOString()
        };
        targetOrder = updated;
        return updated;
      });
      persistOrders(next);
      if (targetOrder) {
        api.saveOrder(targetOrder, false);
      }
      return next;
    });

    showToast(`อัปเดตสถานะเป็น "${statusObj?.labelShort || newStatus}"`);
  };

  // Slip handler
  const handleOpenSlip = (order) => {
    setSlipOrder(order);
    setIsSlipModalOpen(true);
  };

  // Trip Handlers with Immediate Synchronous LocalStorage write & Cloud DB sync
  const handleSaveTrip = (tripData) => {
    setTrips(prev => {
      let next;
      const exists = prev.some(t => t.id === tripData.id);
      if (exists) {
        next = prev.map(t => t.id === tripData.id ? tripData : t);
      } else {
        next = [...prev, tripData];
      }
      persistTrips(next);
      return next;
    });
    api.saveTrip(tripData, false);
    showToast(`💾 บันทึกรอบ "${tripData.name}" สำเร็จ`);
  };

  const handleDeleteTrip = (tripId) => {
    setTrips(prev => {
      const next = prev.filter(t => t.id !== tripId);
      persistTrips(next);
      return next;
    });
    api.deleteTrip(tripId);
    if (selectedTrip === tripId) setSelectedTrip('all');
    showToast('ลบรอบการเดินทางเรียบร้อย');
  };

  // Export / Import Handlers
  const handleImportData = (importedOrders, importedTrips) => {
    setOrders(importedOrders);
    persistOrders(importedOrders);
    if (importedTrips && importedTrips.length > 0) {
      setTrips(importedTrips);
      persistTrips(importedTrips);
    }
    showToast('นำเข้าและบันทึกข้อมูลสำเร็จ');
  };

  const handleResetData = () => {
    setOrders(INITIAL_ORDERS);
    setTrips(INITIAL_TRIPS);
    persistOrders(INITIAL_ORDERS);
    persistTrips(INITIAL_TRIPS);
    showToast('รีเซ็ตข้อมูลตัวอย่างเริ่มต้นสำเร็จ');
  };

  const totalWeight = orders.reduce((sum, o) => sum + (parseFloat(o.weightKg) || 0), 0);

  // Switch to customer view
  const handleSwitchToCustomer = () => {
    setViewMode('customer');
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, 'customer');
    } catch (e) {}
    const newUrl = `${window.location.pathname}?mode=customer`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    showToast('สลับเข้าสู่หน้าต่างสำหรับลูกค้า');
  };

  // Switch to admin view
  const handleSwitchToAdmin = () => {
    setViewMode('admin');
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, 'admin');
    } catch (e) {}
    const newUrl = `${window.location.pathname}?mode=admin`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    showToast('ยินดีต้อนรับเข้าสู่ระบบจัดการหลังบ้าน');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col selection:bg-red-500 selection:text-white">
      
      {/* 1. SEPARATE NAVBAR BASED ON ROLE */}
      {viewMode === 'admin' ? (
        <Navbar
          onOpenNewOrder={handleOpenNewOrder}
          onOpenTripManager={() => setIsTripManagerOpen(true)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenExportImport={() => setIsExportImportOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onSwitchToCustomer={handleSwitchToCustomer}
          orderCount={orders.length}
          totalWeight={totalWeight}
          lastSavedTime={lastSavedTime}
        />
      ) : (
        <CustomerNavbar
          onOpenAdminLogin={() => {
            if (settings.requirePin) {
              setIsAdminLoginOpen(true);
            } else {
              handleSwitchToAdmin();
            }
          }}
          settings={settings}
        />
      )}

      {/* 2. MAIN SEPARATE WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'admin' ? (
          /* ========================================================
             WINDOW 1: ADMIN & SYSTEM MANAGEMENT (สำหรับคนจัดการระบบ)
             ======================================================== */
          <div className="space-y-6 animate-fadeIn">
            {/* Store Statistics Overview */}
            <DashboardStats
              orders={orders}
              trips={trips}
              selectedTrip={selectedTrip}
              setSelectedTrip={setSelectedTrip}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onOpenTripManager={() => setIsTripManagerOpen(true)}
            />

            {/* Orders Management Table with Inline Quick Edit */}
            <OrderTable
              orders={orders}
              trips={trips}
              selectedTrip={selectedTrip}
              setSelectedTrip={setSelectedTrip}
              onEditOrder={handleEditOrder}
              onDeleteOrder={handleDeleteOrder}
              onOpenSlip={handleOpenSlip}
              onUpdateStatus={handleUpdateStatus}
              onQuickUpdate={handleQuickUpdateOrder}
              onOpenNewOrder={handleOpenNewOrder}
            />
          </div>
        ) : (
          /* ========================================================
             WINDOW 2: CUSTOMER PORTAL (สำหรับลูกค้าเช็คพัสดุ)
             ======================================================== */
          <div className="animate-fadeIn">
            <CustomerTrackingView
              orders={orders}
              trips={trips}
              initialTrackCode={customerTrackCode}
              settings={settings}
            />
          </div>
        )}
      </main>

      {/* 3. SEPARATE FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center font-bold text-[10px]">
              KOI
            </div>
            <span className="font-bold text-gray-800">{settings.shopName || 'KOI Japan Shop'}</span>
            <span>— {viewMode === 'admin' ? 'ระบบจัดการหลังบ้าน & คำนวณค่าน้ำหนัก' : 'ระบบติดตามสินค้าพรีออเดอร์จากญี่ปุ่น'}</span>
          </div>

          <div className="flex items-center gap-4">
            {viewMode === 'customer' ? (
              <button
                onClick={() => {
                  if (settings.requirePin) {
                    setIsAdminLoginOpen(true);
                  } else {
                    handleSwitchToAdmin();
                  }
                }}
                className="text-gray-500 hover:text-red-600 font-semibold underline flex items-center gap-1"
              >
                <span>🔒 เข้าสู่ระบบจัดการหลังบ้าน (สำหรับเจ้าของร้าน)</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>บันทึกข้อมูลล่าสุด: {lastSavedTime}</span>
                </span>
                <button
                  onClick={handleSwitchToCustomer}
                  className="text-gray-500 hover:text-red-600 font-semibold underline"
                >
                  👁️ สลับไปมุมมองลูกค้า
                </button>
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* ADMIN PIN LOGIN MODAL */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleSwitchToAdmin}
        settings={settings}
      />

      {/* ADMIN MODALS (Only active in admin mode) */}
      {viewMode === 'admin' && (
        <>
          {/* 1. Add/Edit Order Modal */}
          <OrderModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            onSave={handleSaveOrder}
            orderToEdit={editingOrder}
            trips={trips}
            onOpenTripManager={() => {
              setIsOrderModalOpen(false);
              setIsTripManagerOpen(true);
            }}
          />

          {/* 2. Slip / Invoice Modal */}
          <InvoiceSlipModal
            isOpen={isSlipModalOpen}
            onClose={() => setIsSlipModalOpen(false)}
            order={slipOrder}
            trips={trips}
            settings={settings}
          />

          {/* 3. Trip Manager Modal */}
          <TripManagerModal
            isOpen={isTripManagerOpen}
            onClose={() => setIsTripManagerOpen(false)}
            trips={trips}
            orders={orders}
            onSaveTrip={handleSaveTrip}
            onDeleteTrip={handleDeleteTrip}
          />

          {/* 4. Weight Calculator Widget Modal */}
          <WeightCalculatorModal
            isOpen={isCalculatorOpen}
            onClose={() => setIsCalculatorOpen(false)}
          />

          {/* 5. Export / Import Modal */}
          <ExportImportModal
            isOpen={isExportImportOpen}
            onClose={() => setIsExportImportOpen(false)}
            orders={orders}
            trips={trips}
            onImportData={handleImportData}
            onResetData={handleResetData}
          />

          {/* 6. Store Settings & Admin PIN Modal */}
          <StoreSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        </>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-gray-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
