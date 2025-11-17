import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        shop: 'Shop',
        categories: 'Categories',
        offers: 'Offers',
        about: 'About',
        contact: 'Contact',
        account: 'Account',
        admin: 'Admin',
        login: 'Login',
        logout: 'Logout',
      },
      hero: {
        headline: 'Activewear Designed for Comfort, Style, and Performance',
        cta: 'Shop Now',
      },
      home: {
        categories: 'Shop by Category',
        newArrivals: 'New Arrivals',
        specialOffers: 'Special Offers',
      },
      product: {
        price: 'Price',
        selectColor: 'Select Color',
        selectSize: 'Select Size',
        addToCart: 'Add to Cart',
        description: 'Description',
        youMayLike: 'You May Also Like',
        inStock: 'In Stock',
        outOfStock: 'Out of Stock',
      },
      cart: {
        title: 'Shopping Cart',
        empty: 'Your cart is empty',
        subtotal: 'Subtotal',
        discount: 'Discount',
        total: 'Total',
        checkout: 'Checkout',
        continueShopping: 'Continue Shopping',
      },
      shop: {
        filters: 'Filters',
        sortBy: 'Sort By',
        priceRange: 'Price Range',
        category: 'Category',
        color: 'Color',
        size: 'Size',
        clearFilters: 'Clear Filters',
        newest: 'Newest',
        priceLowHigh: 'Price: Low to High',
        priceHighLow: 'Price: High to Low',
        bestSelling: 'Best Selling',
      },
      admin: {
        dashboard: 'Dashboard',
        products: 'Products',
        categories: 'Categories',
        orders: 'Orders',
        users: 'Users',
        discounts: 'Discounts',
        settings: 'Settings',
        addProduct: 'Add Product',
        editProduct: 'Edit Product',
        totalRevenue: 'Total Revenue',
        totalOrders: 'Total Orders',
        totalProducts: 'Total Products',
        totalUsers: 'Total Users',
      },
      auth: {
        login: 'Login',
        register: 'Register',
        username: 'Email or Phone',
        password: 'Password',
        fullName: 'Full Name',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
      },
      footer: {
        about: 'About Lift Me Up',
        shipping: 'Return & Shipping',
        contact: 'Contact Us',
        copyright: '© 2024 Lift Me Up. All rights reserved.',
      },
    },
  },
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        shop: 'المتجر',
        categories: 'الأقسام',
        offers: 'العروض',
        about: 'من نحن',
        contact: 'اتصل بنا',
        account: 'الحساب',
        admin: 'لوحة التحكم',
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
      },
      hero: {
        headline: 'ملابس رياضية مصممة للراحة والأناقة والأداء',
        cta: 'تسوق الآن',
      },
      home: {
        categories: 'تسوق حسب القسم',
        newArrivals: 'المنتجات الجديدة',
        specialOffers: 'العروض الخاصة',
      },
      product: {
        price: 'السعر',
        selectColor: 'اختر اللون',
        selectSize: 'اختر المقاس',
        addToCart: 'أضف إلى السلة',
        description: 'الوصف',
        youMayLike: 'قد يعجبك أيضاً',
        inStock: 'متوفر',
        outOfStock: 'غير متوفر',
      },
      cart: {
        title: 'سلة التسوق',
        empty: 'سلة التسوق فارغة',
        subtotal: 'المجموع الفرعي',
        discount: 'الخصم',
        total: 'الإجمالي',
        checkout: 'إتمام الشراء',
        continueShopping: 'متابعة التسوق',
      },
      shop: {
        filters: 'الفلاتر',
        sortBy: 'الترتيب حسب',
        priceRange: 'نطاق السعر',
        category: 'القسم',
        color: 'اللون',
        size: 'المقاس',
        clearFilters: 'إزالة الفلاتر',
        newest: 'الأحدث',
        priceLowHigh: 'السعر: من الأقل للأعلى',
        priceHighLow: 'السعر: من الأعلى للأقل',
        bestSelling: 'الأكثر مبيعاً',
      },
      admin: {
        dashboard: 'لوحة التحكم',
        products: 'المنتجات',
        categories: 'الأقسام',
        orders: 'الطلبات',
        users: 'المستخدمين',
        discounts: 'الخصومات',
        settings: 'الإعدادات',
        addProduct: 'إضافة منتج',
        editProduct: 'تعديل المنتج',
        totalRevenue: 'إجمالي الإيرادات',
        totalOrders: 'إجمالي الطلبات',
        totalProducts: 'إجمالي المنتجات',
        totalUsers: 'إجمالي المستخدمين',
      },
      auth: {
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        username: 'البريد الإلكتروني أو رقم الهاتف',
        password: 'كلمة المرور',
        fullName: 'الاسم الكامل',
        dontHaveAccount: 'ليس لديك حساب؟',
        alreadyHaveAccount: 'لديك حساب بالفعل؟',
      },
      footer: {
        about: 'عن Lift Me Up',
        shipping: 'الإرجاع والشحن',
        contact: 'اتصل بنا',
        copyright: '© 2024 Lift Me Up. جميع الحقوق محفوظة.',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Set initial direction
const updateDocumentDirection = (lang: string) => {
  if (typeof document !== 'undefined') {
    const isArabic = lang === 'ar';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.dir = isArabic ? 'rtl' : 'ltr';
  }
};

// Set initial direction
updateDocumentDirection(i18n.language || 'en');

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
});

export default i18n;
