// 404 generic — לא קשור ל-tenant.
export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gray-50">
      <h1 className="text-7xl font-black text-gray-300 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-2">העמוד לא נמצא</p>
      <p className="text-sm text-gray-500 max-w-md">
        בדוק את הקישור — ייתכן שהאירוע הסתיים, הקישור שגוי, או ש-RideUp עוד לא יצר את האתר הזה.
      </p>
      <a href="https://rideup.co.il" className="mt-8 text-indigo-600 hover:underline font-semibold">
        rideup.co.il →
      </a>
    </div>
  );
}
