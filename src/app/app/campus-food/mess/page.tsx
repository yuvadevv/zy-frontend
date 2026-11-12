'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ChevronLeft, 
  UtensilsCrossed, 
  Clock, 
  CalendarDays, 
  Sparkles, 
  ArrowRight,
  Info,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChefHat
} from 'lucide-react';
import { APP_ROUTES } from '@/constants/routes';
import { workerClient } from '@/lib/api/workerClient';

interface MessDayMenu {
  id: string;
  day: string;
  dayOfWeek: number;
  title: string;
  items: string[];
  image: string;
  notes: string;
  mealTimings: string;
  adminFlagged?: boolean;
}

const FALLBACK_MESS_SCHEDULE: MessDayMenu[] = [
  {
    id: 'mess_day_1',
    day: 'Monday',
    dayOfWeek: 1,
    title: 'Monday Traditional Feast',
    items: ['Pappu Tamata', 'Cabbage 65', 'Rasam', 'Roti Pachadi (Chutney)', 'Perugu Annam', 'Rice'],
    image: '/images/food/rce_mess_cover.webp',
    notes: 'Freshly prepared South Indian comforting spread.',
    mealTimings: 'Lunch: 12:30 PM - 2:30 PM | Dinner: 7:30 PM - 9:30 PM'
  },
  {
    id: 'mess_day_2',
    day: 'Tuesday',
    dayOfWeek: 2,
    title: 'Tuesday Special Curry Day',
    items: ['Pappu Anapakaya', 'Egg Curry', 'Palak Makhani Curry', 'Roti Pachadi', 'Majjiga Chaaru', 'Rice'],
    image: '/images/food/rce_mess_cover.webp',
    notes: 'Egg Curry & Palak Makhani protein balance.',
    mealTimings: 'Lunch: 12:30 PM - 2:30 PM | Dinner: 7:30 PM - 9:30 PM'
  },
  {
    id: 'mess_day_3',
    day: 'Wednesday',
    dayOfWeek: 3,
    title: 'Wednesday Chicken Delight',
    items: ['Chicken Curry', 'Rasam', 'Majjiga', 'Chutney', 'Rice'],
    image: '/images/food/rce_mess_cover.webp',
    notes: 'Midweek special Andhra Chicken Curry meal.',
    mealTimings: 'Lunch: 12:30 PM - 2:30 PM | Dinner: 7:30 PM - 9:30 PM'
  },
  {
    id: 'mess_day_4',
    day: 'Thursday',
    dayOfWeek: 4,
    title: 'Thursday Green Leaf & Sambhar',
    items: ['Akkura Pappu', 'Sambhar', 'Potato Fry', 'Roti Pachadi', 'Curd Rice'],
    image: '/images/food/rce_mess_cover.webp',
    notes: 'Nutritious Akkura Pappu with crispy Potato Fry.',
    mealTimings: 'Lunch: 12:30 PM - 2:30 PM | Dinner: 7:30 PM - 9:30 PM'
  },
  {
    id: 'mess_day_5',
    day: 'Friday',
    dayOfWeek: 5,
    title: 'Friday Gutti Vankaya Special',
    items: ['Pappu Tamata', 'Gutti Vankaya', 'Rasam', 'Roti Pachadi', 'Curd Rice'],
    image: '/images/food/rce_mess_cover.webp',
    notes: 'Stuffed spicy Gutti Vankaya curry with Rasam.',
    mealTimings: 'Lunch: 12:30 PM - 2:30 PM | Dinner: 7:30 PM - 9:30 PM'
  },
  {
    id: 'mess_day_6',
    day: 'Saturday',
    dayOfWeek: 6,
    title: 'Saturday Royal Mudha Pappu & Avakaya',
    items: ['Mudha Pappu', 'Avakaya', 'Appadam', 'Ghee', 'Chama Dumpalu Pulusu', 'Curd Rice'],
    image: '/images/food/rce_mess_cover.webp',
    notes: 'Authentic Telugu Mudha Pappu, Pure Ghee & spicy Avakaya.',
    mealTimings: 'Lunch: 12:30 PM - 2:30 PM | Dinner: 7:30 PM - 9:30 PM'
  },
  {
    id: 'mess_day_0',
    day: 'Sunday',
    dayOfWeek: 0,
    title: 'Sunday Weekend Biryani Feast',
    items: ['Veg Biryani', 'Paneer Curry', 'Raita'],
    image: '/images/food/rce_mess_cover.webp',
    notes: 'Weekend royal meal. Note: Chicken Curry item flagged for admin confirmation.',
    mealTimings: 'Lunch: 12:00 PM - 3:00 PM | Dinner: 7:30 PM - 9:30 PM',
    adminFlagged: true
  },
  {
    id: 'mess_day_special',
    day: 'Monthly Special',
    dayOfWeek: -1,
    title: "Every Month's Last Sunday Special",
    items: ['Dum Biryani', 'Katta', 'Raita'],
    image: '/images/food/rce_mess_cover.webp',
    notes: 'Grand monthly finale Dum Biryani feast.',
    mealTimings: 'Lunch: 12:00 PM - 3:30 PM'
  }
];

export default function CollegeMessPage() {
  const router = useRouter();
  const [weeklyMenu, setWeeklyMenu] = useState<MessDayMenu[]>(FALLBACK_MESS_SCHEDULE);
  const [isLoading, setIsLoading] = useState(false);

  // Today's day index (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const todayIndex = new Date().getDay();
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(todayIndex);

  useEffect(() => {
    async function loadWeeklyMenu() {
      try {
        setIsLoading(true);
        const res = await workerClient.fetch('/api/food/mess/weekly-menu');
        const rawList = res?.data?.menu || res?.menu;
        if (Array.isArray(rawList) && rawList.length > 0) {
          const dayMap: Record<string, number> = {
            sunday: 0, sun: 0,
            monday: 1, mon: 1,
            tuesday: 2, tue: 2,
            wednesday: 3, wed: 3,
            thursday: 4, thu: 4,
            friday: 5, fri: 5,
            saturday: 6, sat: 6,
            'monthly special': -1, monthly_special: -1, special: -1
          };
          const list: MessDayMenu[] = rawList.map((m: any) => {
            let dow = m.dayOfWeek;
            if (typeof dow === 'string') {
              const clean = dow.toLowerCase().trim();
              dow = clean in dayMap ? dayMap[clean] : parseInt(clean, 10);
              if (isNaN(dow)) dow = 1;
            }
            return {
              ...m,
              dayOfWeek: typeof dow === 'number' ? dow : 1
            };
          });
          setWeeklyMenu(list);
        }
      } catch (e) {
        console.warn('Using local fallback for mess menu schedule:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadWeeklyMenu();
  }, []);

  const currentDayMenu = weeklyMenu.find(m => m.dayOfWeek === selectedDayOfWeek) || weeklyMenu[0];
  const monthlySpecial = weeklyMenu.find(m => m.dayOfWeek === -1);

  const daysList = [
    { label: 'Mon', dayOfWeek: 1, full: 'Monday' },
    { label: 'Tue', dayOfWeek: 2, full: 'Tuesday' },
    { label: 'Wed', dayOfWeek: 3, full: 'Wednesday' },
    { label: 'Thu', dayOfWeek: 4, full: 'Thursday' },
    { label: 'Fri', dayOfWeek: 5, full: 'Friday' },
    { label: 'Sat', dayOfWeek: 6, full: 'Saturday' },
    { label: 'Sun', dayOfWeek: 0, full: 'Sunday' },
    { label: '★ Special', dayOfWeek: -1, full: 'Monthly Special' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-12 select-none">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Campus Food</span>
        </button>
        <span className="text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          Official College Mess
        </span>
      </div>

      {/* 2. Hero Cover Banner */}
      <section className="relative overflow-hidden rounded-[24px] bg-[#151515] text-white shadow-xl border border-zinc-800">
        <div className="relative h-44 sm:h-52 w-full">
          <Image
            src="/images/food/rce_mess_cover.webp"
            alt="RCE Mess Dining Hall"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-[#FF6B00] text-white uppercase">
                Active Counter
              </span>
              <span className="text-[11px] text-zinc-300 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                Lunch: 12:30 PM • Dinner: 7:30 PM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              RCE MESS
            </h1>
            <p className="text-xs text-zinc-300 line-clamp-1">
              RCE Mess Dining Hall Serving Counter • Traditional South Indian Weekly Schedule
            </p>
          </div>
        </div>
      </section>

      {/* 3. Day Selector Tabs (Monday to Sunday + Monthly Special) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-500">
            Select Day of Week
          </span>
          <span className="text-[11px] font-bold text-[#FF6B00] flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Today is {daysList.find(d => d.dayOfWeek === todayIndex)?.full}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {daysList.map((d) => {
            const isSelected = selectedDayOfWeek === d.dayOfWeek;
            const isToday = d.dayOfWeek === todayIndex;
            return (
              <button
                key={d.dayOfWeek}
                onClick={() => setSelectedDayOfWeek(d.dayOfWeek)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all active:scale-95 flex flex-col items-center ${
                  isSelected
                    ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-500/40'
                    : isToday
                    ? 'bg-orange-50 text-orange-600 border border-orange-300 font-black'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
                }`}
              >
                <span>{d.label}</span>
                {isToday && (
                  <span className={`text-[8.5px] font-black uppercase tracking-tighter mt-0.5 ${isSelected ? 'text-white/90' : 'text-orange-600'}`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Active Day Menu Card */}
      {currentDayMenu && (
        <section className="bg-white rounded-[22px] border border-zinc-200 p-4 sm:p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF6B00]">
                  {currentDayMenu.day}
                </span>
                {currentDayMenu.dayOfWeek === todayIndex && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                    Active Today
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
                {currentDayMenu.title}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0">
              <ChefHat className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>

          {/* Meal Timings & Notes */}
          <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>{currentDayMenu.mealTimings}</span>
            </div>
            {currentDayMenu.notes && (
              <p className="text-[11px] text-zinc-500 pl-5">
                {currentDayMenu.notes}
              </p>
            )}
          </div>

          {/* Dishes List */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-black text-zinc-700 uppercase tracking-wider">
              Dishes Included in Menu ({currentDayMenu.items.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentDayMenu.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-orange-300 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-bold text-zinc-800">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sunday Chicken Curry Admin Notice if applicable */}
          {currentDayMenu.adminFlagged && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5 text-xs text-amber-800">
                <span className="font-black">Notice for Sunday Menu:</span>
                <span>The official printed schedule heading mentions Chicken Curry partially cut off. This item is subject to mess admin weekly confirmation.</span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. Monthly Special Banner (Last Sunday Special) */}
      {monthlySpecial && selectedDayOfWeek !== -1 && (
        <section className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 rounded-[22px] border border-amber-200/80 p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Monthly Special Feast</span>
            </div>
            <span className="text-[10px] font-black bg-amber-200/70 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
              Every Month's Last Sunday
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-zinc-900">
              {monthlySpecial.title}
            </h3>
            <p className="text-xs text-zinc-600 mt-0.5">
              {monthlySpecial.mealTimings} • {monthlySpecial.notes}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {monthlySpecial.items.map((dish, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-black border border-amber-200 shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {dish}
              </span>
            ))}
          </div>

          <button
            onClick={() => setSelectedDayOfWeek(-1)}
            className="mt-1 inline-flex items-center gap-1 text-xs font-black text-[#FF6B00] hover:text-orange-700"
          >
            <span>View monthly special details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* 6. Quick switch to CHOPSTICKS */}
      <section className="p-4 rounded-[20px] bg-zinc-900 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black">Want Fast Food or Biryani?</h4>
            <p className="text-[11px] text-zinc-400">Order from CHOPSTICKS Counter</p>
          </div>
        </div>
        <button
          onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
          className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition active:scale-95"
        >
          View Menu
        </button>
      </section>
    </div>
  );
}
