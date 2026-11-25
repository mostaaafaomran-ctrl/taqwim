(function (root) {
  var FMT = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });
  var HM_AR = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
  var HM_EN = ['Muharram', 'Safar', "Rabi' al-awwal", "Rabi' al-thani", 'Jumada al-awwal', 'Jumada al-thani', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'];
  var GM_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  var WD_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  var DAY = 86400000;
  function utc(y, m, d) { var t = new Date(0); t.setUTCFullYear(y, m - 1, d); t.setUTCHours(12, 0, 0, 0); return t; }
  function g2h(date, off) {
    var t = new Date(date.getTime() + (off || 0) * DAY), o = {};
    FMT.formatToParts(t).forEach(function (p) { if (p.type !== 'literal') o[p.type] = +p.value; });
    return { y: o.year || o.relatedYear, m: o.month, d: o.day };
  }
  function h2g(y, m, d, off) {
    var days = Math.round((y - 1) * 354.3671 + (m - 1) * 29.5306 + (d - 1));
    var t = new Date(utc(622, 7, 16).getTime() + days * DAY - (off || 0) * DAY);
    for (var i = 0; i < 40; i++) {
      var h = g2h(t, off), diff = (h.y - y) * 354.3671 + (h.m - m) * 29.5306 + (h.d - d);
      if (h.y === y && h.m === m && h.d === d) return t;
      t = new Date(t.getTime() - Math.sign(diff) * DAY * (Math.abs(diff) > 3 ? Math.round(Math.abs(diff) / 2) : 1));
    }
    return null;
  }
  function monthLen(y, m, off) {
    var a = h2g(y, m, 1, off), b = m === 12 ? h2g(y + 1, 1, 1, off) : h2g(y, m + 1, 1, off);
    return Math.round((b - a) / DAY);
  }
  var HOL = [
    { h: [1, 1], ar: 'رأس السنة الهجرية', en: 'Islamic New Year' },
    { h: [1, 10], ar: 'يوم عاشوراء', en: 'Ashura' },
    { h: [3, 12], ar: 'المولد النبوي الشريف', en: "Mawlid al-Nabi" },
    { h: [7, 27], ar: 'الإسراء والمعراج', en: "Isra' and Mi'raj" },
    { h: [8, 15], ar: 'ليلة النصف من شعبان', en: "Mid-Sha'ban" },
    { h: [9, 1], ar: 'أول رمضان', en: 'First of Ramadan' },
    { h: [9, 27], ar: 'ليلة القدر (٢٧ رمضان)', en: 'Laylat al-Qadr (27 Ramadan)' },
    { h: [10, 1], ar: 'عيد الفطر', en: 'Eid al-Fitr' },
    { h: [12, 9], ar: 'يوم عرفة', en: 'Day of Arafat' },
    { h: [12, 10], ar: 'عيد الأضحى', en: 'Eid al-Adha' },
    { g: [1, 7], ar: 'عيد الميلاد المجيد (قبطي)', en: 'Coptic Christmas' },
    { g: [1, 25], ar: 'عيد الثورة وعيد الشرطة', en: 'Revolution and Police Day' },
    { g: [4, 25], ar: 'عيد تحرير سيناء', en: 'Sinai Liberation Day' },
    { g: [5, 1], ar: 'عيد العمال', en: 'Labour Day' },
    { g: [6, 30], ar: 'ثورة 30 يونيو', en: '30 June Revolution' },
    { g: [7, 23], ar: 'ثورة 23 يوليو', en: '23 July Revolution' },
    { g: [10, 6], ar: 'عيد القوات المسلحة', en: 'Armed Forces Day' }
  ];
  function upcoming(from, off, limit) {
    var start = utc(from.getUTCFullYear(), from.getUTCMonth() + 1, from.getUTCDate()), out = [], hy = g2h(start, off).y;
    HOL.forEach(function (x) {
      for (var k = -1; k <= 2; k++) {
        var d = x.h ? h2g(hy + k, x.h[0], x.h[1], off) : utc(start.getUTCFullYear() + k, x.g[0], x.g[1]);
        if (d && d >= start && d <= new Date(start.getTime() + 400 * DAY)) { out.push({ date: d, ar: x.ar, en: x.en, type: x.h ? 'hijri' : 'civil', days: Math.round((d - start) / DAY) }); break; }
      }
    });
    out.sort(function (a, b) { return a.date - b.date; });
    return out.slice(0, limit || 8);
  }
  var api = { g2h: g2h, h2g: h2g, monthLen: monthLen, upcoming: upcoming, utc: utc, HM_AR: HM_AR, HM_EN: HM_EN, GM_AR: GM_AR, WD_AR: WD_AR };
  if (typeof module !== 'undefined') module.exports = api; else root.Taqwim = api;
})(this);
