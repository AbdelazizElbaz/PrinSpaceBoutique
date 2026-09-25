import type { Plan, CompareGroup } from "../fr/plans"

export const plans: Plan[] = [
  {
    code: "starter",
    name: "Starter",
    audience: "الورشات والمطابع الصغيرة التي تريد الخروج من Excel وواتساب.",
    monthly: 300,
    yearlyMonthly: 250,
    description: "الحل كاملاً، بحجم ورشة صغيرة.",
    limits: [
      { label: "المستخدمون", value: "2" },
      { label: "الطلبيات / شهرياً", value: "300" },
      { label: "تخزين الملفات", value: "5 GB" },
      { label: "نقاط البيع", value: "1" },
      { label: "الناقلون المرتبطون", value: "1" },
    ],
    includes: ["الطلبيات والعروض والنماذج وتتبع الإنتاج", "الزبناء والتسبيقات والتعديلات والمتبقي للدفع", "التوصيل مع الوصولات والملصقات", "لوحة القيادة وكشوف الحساب", "PrintosSync على جهاز واحد", "دعم بالبريد الإلكتروني"],
    cta: "ابدأ التجربة المجانية",
  },
  {
    code: "pro",
    name: "Pro",
    audience: "المطابع التي توصّل يومياً وتريد التحكم في الدفع عند الاستلام.",
    monthly: 690,
    yearlyMonthly: 575,
    highlight: true,
    badge: "الأكثر اختياراً",
    description: "لنشاط يومي مع التوصيل وعدة أجهزة.",
    limits: [
      { label: "المستخدمون", value: "غير محدود" },
      { label: "الطلبيات / شهرياً", value: "2 000" },
      { label: "تخزين الملفات", value: "50 GB" },
      { label: "نقاط البيع", value: "3" },
      { label: "الناقلون المرتبطون", value: "الكل (Ameex، Olivraison، Ozone Express + موزّعون داخليون)" },
    ],
    includes: ["كل ما في Starter، بالإضافة إلى:", "مطابقة تلقائية للدفع عند الاستلام مع تنبيه بالفرق", "برنامج الولاء وأكواد الخصم", "متجر إلكتروني عمومي متزامن", "PrintosSync على أجهزة غير محدودة (وضع الخدمة)", "تصدير CSV محاسبي", "دعم ذو أولوية بالبريد + واتساب"],
    cta: "ابدأ التجربة المجانية",
  },
  {
    code: "business",
    name: "Business",
    audience: "الشبكات والامتيازات والمطابع التي لها موزّعون خارجيون.",
    monthly: 1490,
    yearlyMonthly: 1240,
    description: "حجم غير محدود، موزّعون خارجيون ومواكبة مخصصة.",
    limits: [
      { label: "المستخدمون", value: "غير محدود" },
      { label: "الطلبيات / شهرياً", value: "غير محدودة" },
      { label: "تخزين الملفات", value: "250 GB" },
      { label: "نقاط البيع", value: "غير محدودة" },
      { label: "الناقلون المرتبطون", value: "الكل" },
    ],
    includes: ["كل ما في Pro، بالإضافة إلى:", "موزّعون خارجيون بفضاء وكتالوج مخصصين", "نطاق مخصص (commandes.votre-marque.ma)", "جلسة انطلاق عبر الفيديو (ساعتان) + استيراد بياناتك", "نسخ احتياطية يومية محفوظة 30 يوماً", "مدير حساب مخصص"],
    extras: ["خيار: نسخة مخصصة (خادم معزول) حسب عرض ثمن"],
    cta: "التحدث مع مستشار",
  },
]

export const comparison: CompareGroup[] = [
  {
    title: "القدرات",
    rows: [
      { feature: "المستخدمون", starter: "2", pro: "غير محدود", business: "غير محدود" },
      { feature: "الطلبيات شهرياً", starter: "300", pro: "2 000", business: "غير محدودة" },
      { feature: "تخزين ملفات الطباعة", starter: "5 GB", pro: "50 GB", business: "250 GB" },
      { feature: "نقاط البيع", starter: "1", pro: "3", business: "غير محدودة" },
      { feature: "أجهزة بـ PrintosSync", starter: "1", pro: "غير محدودة", business: "غير محدودة" },
    ],
  },
  {
    title: "الطلبيات والمبيعات",
    rows: [
      { feature: "الطلبيات والمواد والخيارات والمواد الخام", starter: true, pro: true, business: true },
      { feature: "عروض الثمن والنماذج للمصادقة", starter: true, pro: true, business: true },
      { feature: "التسبيقات والتعديلات والمتبقي للدفع", starter: true, pro: true, business: true },
      { feature: "أكواد الخصم والعروض التلقائية", starter: false, pro: true, business: true },
      { feature: "برنامج الولاء (نقاط عند التوصيل)", starter: false, pro: true, business: true },
      { feature: "متجر إلكتروني عمومي", starter: false, pro: true, business: true },
      { feature: "موزّعون خارجيون", starter: false, pro: false, business: true },
    ],
  },
  {
    title: "التوصيل والتحصيل",
    rows: [
      { feature: "وصولات توصيل وملصقات PDF", starter: true, pro: true, business: true },
      { feature: "الناقلون (Ameex، Olivraison، Ozone Express)", starter: "واحد حسب الاختيار", pro: "الكل", business: "الكل" },
      { feature: "موزّعون داخليون وجولات", starter: true, pro: true, business: true },
      { feature: "تتبع تلقائي للحالات", starter: true, pro: true, business: true },
      { feature: "مطابقة الدفع عند الاستلام مع تنبيه بالفرق", starter: false, pro: true, business: true },
      { feature: "عمليات جمع الطرود لكل بائع", starter: true, pro: true, business: true },
    ],
  },
  {
    title: "الورشة والطباعة",
    rows: [
      { feature: "طابور الإنتاج والملفات الجاهزة", starter: true, pro: true, business: true },
      { feature: "وكيل طباعة Windows / macOS / Linux", starter: true, pro: true, business: true },
      { feature: "وضع الخدمة (يعمل والجلسة مغلقة)", starter: false, pro: true, business: true },
      { feature: "التحكم في الأجهزة من الويب", starter: true, pro: true, business: true },
    ],
  },
  {
    title: "المالية والتسيير",
    rows: [
      { feature: "لوحة قيادة في الوقت الحقيقي", starter: true, pro: true, business: true },
      { feature: "كشوف حساب الزبناء", starter: true, pro: true, business: true },
      { feature: "المصاريف والهامش", starter: true, pro: true, business: true },
      { feature: "تصدير CSV محاسبي", starter: false, pro: true, business: true },
      { feature: "الطلبيات المحذوفة (سلة) والسجل", starter: true, pro: true, business: true },
    ],
  },
  {
    title: "الأمان والمواكبة",
    rows: [
      { feature: "قاعدة بيانات وتخزين مخصصان لكل عميل", starter: true, pro: true, business: true },
      { feature: "النسخ الاحتياطية", starter: "أسبوعية", pro: "يومية (7 أيام)", business: "يومية (30 يوماً)" },
      { feature: "نطاق مخصص", starter: false, pro: false, business: true },
      { feature: "الدعم", starter: "بريد إلكتروني", pro: "بريد + واتساب ذو أولوية", business: "مدير مخصص" },
      { feature: "تكوين الانطلاق", starter: "فيديوهات", pro: "فيديوهات + ساعة عبر الفيديو", business: "فيديوهات + ساعتان + استيراد" },
    ],
  },
]
