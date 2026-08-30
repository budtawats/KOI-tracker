import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Crash Caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-gray-100 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">เกิดข้อผิดพลาดในการแสดงผล</h2>
              <p className="text-xs text-gray-500 mt-1">
                {this.state.error?.message || 'ระบบตรวจพบข้อผิดพลาด กรุณากดรีเฟรชเพื่อโหลดข้อมูลใหม่'}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch (e) {}
                  window.location.href = window.location.pathname;
                }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
              >
                ล้างแคช & เริ่มต้นใหม่
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>โหลดหน้าใหม่</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
