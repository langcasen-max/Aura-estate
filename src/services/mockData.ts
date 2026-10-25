import { Property, PropertyInquiry, UserProfile } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'sqd-prop-01',
    title: '3 Marla Single-Story Compact Family House',
    slug: '3-marla-budget-house-kausar-colony-sadiqabad',
    description: `صادق آباد کوثر کالونی میں نہایت مناسب قیمت پر 3 مرلہ خوبصورت سنگل سٹوری پکا مکان برائے فروخت۔

تفصیلات و نقشہ:
• رقبہ: 3 مرلہ (675 اسکوائر فٹ)
• 2 کشادہ بیڈ رومز مع اٹیچڈ واش رومز (ٹائل ورک اور سینیٹری فٹنگ)
• خوبصورت فیملی ٹی وی لاؤنج اور اوپن امیریکن کچن
• بائیکس اور چھوٹی فیملی کار (Alto / Mehran) کے لیے کار پورچ
• چھت پر مضبوط RCC لنٹر اور اوپر جانے کے لیے معیاری لوہے کی سیڑھی
• میٹھے پینے کے پانی کا ذاتی بور مع 1 ہارس پاور موٹر اور چھت پر واٹر ٹینک
• واپڈا کا الگ بجلی کا میٹر نصب
• 25 فٹ چوڑی پختہ گلی مع زیر زمین سیوریج لائن
• قانونی حیثیت: 100% رجسٹری انتقال مکمل کلیئر، موقع پر فوری قبضہ

جامع مسجد نور، گورنمنٹ گرلز ہائی اسکول اور لوکل مارکیٹ صرف 2 منٹ کی پیدل مسافت پر۔ قلیل بجٹ میں اپنا ذاتی گھر خریدنے والوں کے لیے نایاب موقع۔`,
    price: 3200000,
    currency: 'PKR',
    property_type: 'townhouse',
    listing_status: 'for_sale',
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 675,
    area_marla: 3,
    year_built: 2025,
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Street 5, near Jamia Masjid Noor, Kausar Colony',
      locality: 'Kausar Colony',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.317,
      longitude: 70.122,
    },
    features: {
      structure_type: 'Single Story (RCC Lenter & Awwal Eent)',
      registry_status: '100% Registry & Intiqal Clear (رجسٹری انتقال پاس)',
      car_porch: 'Small Car Porch (Alto / Mehran & Bikes)',
      water_source: 'Sweet Water Bore with 1HP Electric Motor',
      gas_status: 'Gas Line on Street (Cylinder Point Installed)',
      electricity: 'Dedicated WAPDA Electricity Meter',
      flooring: 'Sunny Grey Marble Chips & Ceramic Tiles',
      street_width: '25ft Paved Wide Street',
    },
    amenities: [
      'Sweet Water Bore / Supply',
      'Dedicated Car Porch / Garage',
      'Solid Wooden Doors',
      'Near Jamia Masjid & Park',
    ],
    media: [
      {
        id: 'med-sqd-1-1',
        property_id: 'sqd-prop-01',
        url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Kausar Colony 3 Marla front elevation',
        is_featured: true,
        display_order: 0,
      },
      {
        id: 'med-sqd-1-2',
        property_id: 'sqd-prop-01',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Living room with marble tiles',
        is_featured: false,
        display_order: 1,
      },
    ],
    created_at: '2026-10-24T06:00:00Z',
    updated_at: '2026-10-24T06:00:00Z',
  },
  {
    id: 'sqd-prop-02',
    title: '5 Marla Brand New Modern Single-Story House',
    slug: '5-marla-modern-single-story-satellite-town-sadiqabad',
    description: `سیٹلائٹ ٹاؤن صادق آباد کے پُرسکون اور پوش رہائشی علاقے میں 5 مرلہ برانڈ نیو سنگل سٹوری پکا مکان برائے فروخت۔

تفصیلات و نقشہ:
• رقبہ: 5 مرلہ (1,125 اسکوائر فٹ) - ڈائمینشن 25x45
• 3 ماسٹر بیڈ رومز مع جدید سینیٹری اور فل ٹائلڈ باتھ رومز
• کشادہ فیملی ٹی وی لاؤنج اور علیحدہ ڈرائنگ روم برائے مہمانان
• ماڈرن اوپن امیریکن کچن مع ماربل سلیب اور لکڑی کی خوبصورت کیبنٹس
• بڑی گاڑی (Corolla / City / Yaris) کے لیے ٹائلڈ کار پورچ
• اول درجے کی لال اینٹ (Awwal Brick) اور مضبوط RCC لنٹر چھت
• میٹھے پینے کے پانی کا گہرا بور مع آٹومیٹک ڈونکی پمپ اور واٹر ٹینک
• سوئی گیس لائن موجود اور واپڈا کا نیا ڈیجیٹل میٹر نصب
• 30 فٹ کشادہ کارپٹڈ سڑک مع انڈر گراؤنڈ سیوریج ڈرینج
• تمام تر کاغذات (انتقال اور رجسٹری) موقع پر تصدیق شدہ

کالج روڈ، جنرل ہسپتال اور مین بازار سے نہایت قریب۔ فیملی کے فوراً شفٹ ہونے کے لیے بالکل ریڈی مکان۔`,
    price: 4800000,
    currency: 'PKR',
    property_type: 'townhouse',
    listing_status: 'for_sale',
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 1125,
    area_marla: 5,
    year_built: 2025,
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Near Degree College Road, Sector 2, Satellite Town',
      locality: 'Satellite Town',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.315,
      longitude: 70.125,
    },
    features: {
      structure_type: 'Single Story (A-Grade Red Brick & RCC Roof)',
      registry_status: 'Direct Owner Registry & Intiqal (رجسٹری انتقال مکمل)',
      car_porch: 'Spacious Sedan Car Porch (Corolla / City & Bikes)',
      water_source: 'Deep Sweet Drinking Water Bore with Donkey Pump',
      gas_status: 'Sui Gas Supply Line Available',
      electricity: 'Single Phase WAPDA Meter Installed',
      flooring: 'Full Badal Marble Flooring & Master Bath Tiles',
      street_width: '30ft Wide Carpeted Street',
    },
    amenities: [
      'Sui Gas Available',
      'Sweet Water Bore / Supply',
      'Dedicated Car Porch / Garage',
      'Solid Wooden Doors',
      'Near Jamia Masjid & Park',
      '40ft Carpeted Main Road',
    ],
    media: [
      {
        id: 'med-sqd-2-1',
        property_id: 'sqd-prop-02',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Satellite Town 5 Marla Elevation',
        is_featured: true,
        display_order: 0,
      },
    ],
    created_at: '2026-10-23T10:00:00Z',
    updated_at: '2026-10-23T10:00:00Z',
  },
  {
    id: 'sqd-prop-03',
    title: '5 Marla Double-Story Solid Built Family House',
    slug: '5-marla-double-story-house-allama-iqbal-town-sadiqabad',
    description: `علامہ اقبال ٹاؤن صادق آباد میں پائیدار اور مضبوط تعمیر شدہ 5 مرلہ ڈبل سٹوری شاندار گھر نہایت مناسب قیمت پر برائے فروخت۔

گھر کا نقشہ اور خوبیاں:
• رقبہ: 5 مرلہ (1,125 مربع فٹ)
• گراؤنڈ فلور: 2 ماسٹر بیڈ رومز، 2 باتھ رومز، مہمان ڈرائنگ روم، ٹی وی لاؤنج، اوپن کچن اور کار پورچ
• فرسٹ فلور: 2 بیڈ رومز مع اٹیچڈ باتھ، علیحدہ کچن، ٹی وی لاؤنج اور وسیع اوپن ٹیرس (چھت)
• دونوں منزلوں کے لیے واپڈا کے الگ الگ الیکٹرک میٹر نصب ہیں (دو بھائیوں کے لیے یا اوپر کا پورشن کرائے پر دینے کے لیے بہترین)
• بادل ماربل فرش، پالش شدہ ٹھوس دیودار لکڑی کے دروازے
• چھت پر اونچی باؤنڈری وال، مومٹی اور اسٹور روم
• میٹھے پینے کے پانی کا بور موٹر مع گیس کا کنکشن بحال
• 30 فٹ کشادہ محفوظ گلی، شریف محلہ
• رجسٹری انتقال مکمل صاف، موقع پر فوری دستاویزات ٹرانسفر

ریلوے روڈ اور کے ایل پی روڈ سے صرف 5 منٹ کی ڈرائیو۔ مناسب ڈیمانڈ پر براہ راست مالک سے سودا ممکن۔`,
    price: 6800000,
    currency: 'PKR',
    property_type: 'townhouse',
    listing_status: 'for_sale',
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 1125,
    area_marla: 5,
    year_built: 2024,
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Street 9, Block C, Allama Iqbal Town',
      locality: 'Allama Iqbal Town',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.312,
      longitude: 70.128,
    },
    features: {
      structure_type: 'Double Story (Solid RCC Frame & Lenter)',
      registry_status: '100% Registry & Intiqal Verified (رجسٹری انتقال پاس)',
      car_porch: 'Covered Car Porch for Sedan or Hatchback',
      water_source: 'Sweet Water Bore + Overhead Fiber Water Tank',
      gas_status: 'Sui Gas Meter Installed & Functional',
      electricity: 'Dual WAPDA Meters (Separate Ground & Upper Floors)',
      flooring: 'Full Badal Marble & High-Gloss Ceramic Tiles',
      street_width: '30ft Carpeted Society Street',
    },
    amenities: [
      'Sui Gas Available',
      '3-Phase WAPDA Electricity',
      'Sweet Water Bore / Supply',
      'Dedicated Car Porch / Garage',
      'Near Jamia Masjid & Park',
      'Solid Wooden Doors',
      'Imported Tile & Marble Flooring',
    ],
    media: [
      {
        id: 'med-sqd-3-1',
        property_id: 'sqd-prop-03',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Allama Iqbal Town 5 Marla Double Story elevation',
        is_featured: true,
        display_order: 0,
      },
    ],
    created_at: '2026-10-22T12:00:00Z',
    updated_at: '2026-10-22T12:00:00Z',
  },
  {
    id: 'sqd-prop-04',
    title: '7 Marla Double-Story Corner House with Big Porch',
    slug: '7-marla-corner-double-story-mazhar-fareed-colony-sadiqabad',
    description: `مظہر فرید کالونی صادق آباد میں 7 مرلہ کارنر ڈبل سٹوری شاندار رہائش گاہ برائے فروخت۔

تفصیلی معلومات:
• رقبہ: 7 مرلہ (1,575 مربع فٹ) - کارنر پلاٹ پر پرائم لوکیشن
• 5 کشادہ ہوادار بیڈ رومز مع اٹیچڈ باتھ رومز اور وارڈروب الماریاں
• 2 بڑی گاڑیوں کے لیے وسیع کار پورچ
• گراؤنڈ اور فرسٹ دونوں منزلوں پر مکمل کچن اور کشادہ ٹی وی لاؤنجز
• کارنر ہونے کی وجہ سے دونوں اطراف سے ہوا اور قدرتی روشنی کی فراوانی
• واش رومز اور کچن میں ماسٹر ٹائلز، باقی پورے گھر میں کوالٹی ماربل
• سوئی گیس کا میٹر، تھری فیز واپڈا میٹر اور سولر پینل کی وائرنگ مکمل
• میٹھے پانی کا 250 فٹ گہرا بور مع واٹر موٹر اور ریزرو ٹینک
• سامنے 35 فٹ اور سائیڈ پر 30 فٹ کھلی پختہ گلیاں
• تمام تر قانونی کاغذات (رجسٹری، فرد، انتقال) کلیئر

صادق آباد کی سب سے پرسکون فیملی کالونی۔ کم قیمت پر کارنر کا مکمل تیار مکان۔`,
    price: 8800000,
    currency: 'PKR',
    property_type: 'villa',
    listing_status: 'for_sale',
    bedrooms: 5,
    bathrooms: 5,
    area_sqft: 1575,
    area_marla: 7,
    year_built: 2024,
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Corner Plot 14, Main Road, Mazhar Fareed Colony',
      locality: 'Mazhar Fareed Colony',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.305,
      longitude: 70.135,
    },
    features: {
      structure_type: 'Double Story Corner Villa (RCC Structure)',
      registry_status: 'Clean Title Registry & Intiqal (رجسٹری و انتقال کلیئر)',
      car_porch: 'Large Double Car Porch (Accommodates 2 Sedans)',
      water_source: '250ft Deep Sweet Water Bore with Heavy Pump',
      gas_status: 'Sui Gas Meter Installed',
      electricity: '3-Phase WAPDA Connection with Solar Inverter Wiring',
      flooring: 'Full Badal Marble & Master Ceramic Sanitary',
      street_width: '35ft Front & 30ft Side Corner Streets',
    },
    amenities: [
      'Corner Plot Location',
      'Sui Gas Available',
      '3-Phase WAPDA Electricity',
      'Sweet Water Bore / Supply',
      'Dedicated Car Porch / Garage',
      'Near Jamia Masjid & Park',
      'Imported Tile & Marble Flooring',
    ],
    media: [
      {
        id: 'med-sqd-4-1',
        property_id: 'sqd-prop-04',
        url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Mazhar Fareed Colony 7 Marla Corner House',
        is_featured: true,
        display_order: 0,
      },
    ],
    created_at: '2026-10-21T09:00:00Z',
    updated_at: '2026-10-21T09:00:00Z',
  },
  {
    id: 'sqd-prop-05',
    title: '10 Marla Complete Double-Story Residence in Model Town',
    slug: '10-marla-double-story-residence-model-town-sadiqabad',
    description: `ماڈل ٹاؤن صادق آباد کے معروف اور محفوظ سیکٹر بی میں 10 مرلہ ڈبل سٹوری مکمل خاندانی گھر۔

نمایاں خصوصیات و نقشہ:
• رقبہ: 10 مرلہ (2,250 مربع فٹ) - ڈائمینشن 35x65
• 5 ماسٹر بیڈ رومز مع ڈریسنگ رومز اور اٹیچڈ لگژری باتھ رومز
• ایگزیکٹو ڈرائنگ روم مع پاؤڈر روم برائے معزز مہمانان
• 2 جدید کچنز (اوپن ماڈرن شو کچن پلس ڈرٹی کچن برائے کھانا پکانے)
• سامنے خوبصورت چھوٹا گھاس کا لان اور 2 بڑی گاڑیوں کے لیے کار پورچ
• سوئی گیس کنکشن، 3 فیز بجلی کا میٹر، 5 کلوواٹ سولر انورٹر وائرنگ
• میٹھا پانی سپلائی اور ذاتی گہرا بور
• 40 فٹ کارپٹڈ سڑک، ماڈل ٹاؤن گیٹڈ سیکیورٹی اور گارڈ چیک پوسٹ
• صاف ستھری رجسٹری انتقال اور موقع پر کلیئر دستاویزات۔`,
    price: 14500000,
    currency: 'PKR',
    property_type: 'villa',
    listing_status: 'for_sale',
    bedrooms: 5,
    bathrooms: 6,
    area_sqft: 2250,
    area_marla: 10,
    year_built: 2025,
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Sector B, Street 4, Model Town',
      locality: 'Model Town',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.3089,
      longitude: 70.1311,
    },
    features: {
      structure_type: 'Double Story Luxury Construction (RCC)',
      registry_status: 'Direct Registry & Intiqal (رجسٹری انتقال مکمل)',
      car_porch: 'Wide Double Car Porch (Fits 2 SUVs / Sedans)',
      water_source: 'Sweet Water Supply + Deep Personal Bore',
      gas_status: 'Sui Gas Meter Installed',
      electricity: '3-Phase WAPDA Connection with Solar Net-Metering Support',
      flooring: 'Imported Porcelain Tiles & Ash Wood Carpentry',
      street_width: '40ft Carpeted Main Boulevard',
    },
    amenities: [
      'Sui Gas Available',
      '3-Phase WAPDA Electricity',
      'Sweet Water Bore / Supply',
      '40ft Carpeted Main Road',
      'Gated Society Security & Guard',
      'Dedicated Car Porch / Garage',
      'Imported Tile & Marble Flooring',
      'Near Jamia Masjid & Park',
    ],
    media: [
      {
        id: 'med-sqd-5-1',
        property_id: 'sqd-prop-05',
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Model Town 10 Marla residence',
        is_featured: true,
        display_order: 0,
      },
    ],
    created_at: '2026-10-20T10:00:00Z',
    updated_at: '2026-10-20T10:00:00Z',
  },
  {
    id: 'sqd-prop-06',
    title: '5 Marla Ready to Build Residential Plot',
    slug: '5-marla-residential-plot-millat-colony-sadiqabad',
    description: `ملت کالونی صادق آباد میں 5 مرلہ رہائشی پلاٹ انتہائی سستی اور مناسب قیمت پر برائے فروخت۔

تفصیلات:
• سائز: 25 فٹ فرنٹ اور 45 فٹ لمبائی (کل 5 مرلہ - 1,125 مربع فٹ)
• 30 فٹ پختہ کارپٹڈ گلی، چاروں طرف پہلے سے باقاعدہ فیملیز کے گھر آباد ہیں
• بجلی کے کھمبے، تاریں اور میٹھے پانی کی لائنیں گلی میں فعال ہیں
• فوری گھر کی بنیادیں بھرنے کے لیے زمین بالکل ہموار، بھراؤ شدہ اور تیار ہے
• رجسٹری انتقال مکمل تصدیق شدہ، موقع پر فوری پٹواری و تحصیل ٹرانسفر
• قیمت صرف 22 لاکھ روپے (علاقے کا سب سے سستا اور محفوظ پلاٹ)

قریب بائی پاس روڈ، گرلز اسکول اور جامع مسجد۔ محنت کش اور متوسط طبقے کے لیے اپنا گھر بنانے کا سنہری موقع۔`,
    price: 2200000,
    currency: 'PKR',
    property_type: 'townhouse',
    listing_status: 'for_sale',
    bedrooms: 0,
    bathrooms: 0,
    area_sqft: 1125,
    area_marla: 5,
    year_built: 2025,
    is_featured: false,
    featured_image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Block 2, Millat Colony near Bypass Link Road',
      locality: 'Millat Colony',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.311,
      longitude: 70.134,
    },
    features: {
      structure_type: 'Open Residential Plot (Ready for Immediate Construction)',
      registry_status: '100% Registry & Intiqal (رجسٹری انتقال مکمل پاس)',
      car_porch: 'N/A (Plot)',
      water_source: 'Sweet Water Line Available in Street',
      gas_status: 'Gas Pipeline in Colony Area',
      electricity: 'WAPDA Electricity Pole at Plot Boundary',
      flooring: 'Levelled Ground',
      street_width: '30ft Wide Paved Street',
    },
    amenities: [
      'Sweet Water Bore / Supply',
      'Near Jamia Masjid & Park',
      '40ft Carpeted Main Road',
    ],
    media: [
      {
        id: 'med-sqd-6-1',
        property_id: 'sqd-prop-06',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Millat Colony 5 Marla Plot',
        is_featured: true,
        display_order: 0,
      },
    ],
    created_at: '2026-10-19T14:00:00Z',
    updated_at: '2026-10-19T14:00:00Z',
  },
  {
    id: 'sqd-prop-07',
    title: 'Commercial Running Shop on Railway Road',
    slug: 'commercial-shop-railway-road-sadiqabad',
    description: `ریلوے روڈ صادق آباد (غلہ منڈی اور ریلوے اسٹیشن چوک کے قریب) تجارتی دکان مناسب قیمت میں برائے فروخت۔

تفصیلات:
• رقبہ: 1.5 مرلہ (تقریباً 10x34 فٹ)
• مین روڈ پر فرنٹ، بھاری عوامی رش اور صادق آباد کا مرکزی تجارتی حب
• لوہے کا مضبوط رولنگ شٹر اور شیشے کا انٹرنس ڈور نصب ہے
• واپڈا کا الگ کمرشل بجلی میٹر موجود
• ہول سیل ایجنسی، الیکٹرانکس شاپ، میڈیکل اسٹور، گارمنٹس، موبائل شاپ یا ٹریڈنگ کے لیے انتہائی موزوں
• فی الحال کرائے پر دینے کے لیے بھی زبردست ماہانہ کیش فلو
• تمام تر مالکانہ کاغذات مکمل اور موقع پر صاف ٹرانسفر۔`,
    price: 3500000,
    currency: 'PKR',
    property_type: 'commercial',
    listing_status: 'for_sale',
    bedrooms: 0,
    bathrooms: 1,
    area_sqft: 337,
    area_marla: 1.5,
    year_built: 2023,
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Near Ghalla Mandi Gate, Railway Road',
      locality: 'Railway Road Commercial',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.307,
      longitude: 70.133,
    },
    features: {
      structure_type: 'Commercial Ground Retail Shop',
      registry_status: 'Commercial Clear Registry (رجسٹری انتقال کمرشل)',
      car_porch: 'Roadside Customer Parking',
      water_source: 'Sweet Water Supply',
      gas_status: 'Commercial Connection Point',
      electricity: 'Dedicated Commercial WAPDA Electric Meter',
      flooring: 'Heavy-Duty Commercial Tile Flooring',
      street_width: 'Main Railway Road Commercial Front',
    },
    amenities: [
      'Commercial Frontage',
      '3-Phase WAPDA Electricity',
      'Sweet Water Bore / Supply',
      'CCTV Surveillance Installed',
    ],
    media: [
      {
        id: 'med-sqd-7-1',
        property_id: 'sqd-prop-07',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Railway Road Commercial Shop',
        is_featured: true,
        display_order: 0,
      },
    ],
    created_at: '2026-10-18T11:00:00Z',
    updated_at: '2026-10-18T11:00:00Z',
  },
  {
    id: 'sqd-prop-08',
    title: '5 Marla Single-Story Family House on Monthly Rent',
    slug: '5-marla-single-story-house-for-rent-satellite-town-sadiqabad',
    description: `سیٹلائٹ ٹاؤن صادق آباد میں 5 مرلہ صاف ستھرا سنگل سٹوری پکا مکان فیملی کے لیے ماہانہ کرائے پر دستیاب۔

تفصیلات و شرائط:
• 3 بیڈ رومز، کشادہ ٹی وی لاؤنج، کچن، 2 واش رومز اور چھوٹا کار پورچ
• میٹھے پانی کا بور اور موٹر بالکل چالو حالت میں
• واپڈا کا الگ بجلی کا میٹر موجود (کرایہ دار اپنے استعمال کا بل ادا کرے گا)
• صاف ستھرا ماربل فرش اور تازہ پینٹ شدہ دیواریں
• صرف شریف، ملازم پیشہ یا چھوٹی فیملی کو ترجیح دی جائے گی
• ماہانہ کرایہ: صرف 22,000 روپے (سیکیورٹی ایڈوانس 2 ماہ واجب الادا)
• وزٹ کے لیے ایڈمن یا دفتر سے رابطہ کریں۔`,
    price: 22000,
    currency: 'PKR',
    property_type: 'townhouse',
    listing_status: 'for_rent',
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1125,
    area_marla: 5,
    year_built: 2024,
    is_featured: false,
    featured_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Street 11, Sector 1, Satellite Town',
      locality: 'Satellite Town',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.314,
      longitude: 70.126,
    },
    features: {
      structure_type: 'Single Story Family Residence',
      registry_status: 'Family Lease Agreement (کرایہ نامہ)',
      car_porch: 'Small Car Porch (Mehran / Alto & Motorbikes)',
      water_source: 'Sweet Water Bore & Overhead Tank',
      gas_status: 'Sui Gas Supply Available',
      electricity: 'Independent WAPDA Meter',
      flooring: 'Polished Marble Chips',
      street_width: '25ft Paved Street',
    },
    amenities: [
      'Sui Gas Available',
      'Sweet Water Bore / Supply',
      'Dedicated Car Porch / Garage',
      'Near Jamia Masjid & Park',
    ],
    media: [
      {
        id: 'med-sqd-8-1',
        property_id: 'sqd-prop-08',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Satellite Town 5 Marla Rental Residence',
        is_featured: true,
        display_order: 0,
      },
    ],
    created_at: '2026-10-24T08:00:00Z',
    updated_at: '2026-10-24T08:00:00Z',
  },
  {
    id: 'sqd-prop-09',
    title: '3.5 Marla Low-Cost Finished Ready-to-Move House',
    slug: '3-5-marla-low-cost-house-kausar-colony-sadiqabad',
    description: `کوثر کالونی صادق آباد میں 3.5 مرلہ کم قیمت پکا تیار مکان برائے فروخت۔

تفصیلات:
• رقبہ: 3.5 مرلہ (788 مربع فٹ)
• 2 کشادہ بیڈ رومز مع اٹیچڈ باتھ رومز
• اوپن کچن، ٹی وی لاؤنج، اور موٹر سائیکل / چھوٹی گاڑی کا پورچ
• چھت پر مضبوط RCC لنٹر، مکمل ماربل چپ فرش
• میٹھا پانی موٹر، بجلی کا میٹر فعال
• ڈیمانڈ: صرف 35 لاکھ روپے (کمی بیشی موقع پر ممکن ہے)
• قریبی بازار اور اسکولوں تک آسان رسائی۔`,
    price: 3500000,
    currency: 'PKR',
    property_type: 'townhouse',
    listing_status: 'for_sale',
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 788,
    area_marla: 3.5,
    year_built: 2025,
    is_featured: false,
    featured_image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Near Madni Masjid, Kausar Colony',
      locality: 'Kausar Colony',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.318,
      longitude: 70.123,
    },
    features: {
      structure_type: 'Single Story Finished House (RCC Roof)',
      registry_status: 'Clear Ownership Registry & Intiqal (رجسٹری انتقال)',
      car_porch: 'Bike & Small Vehicle Space',
      water_source: 'Sweet Water Bore & Pump',
      gas_status: 'Gas Pipeline in Street',
      electricity: 'Dedicated Electric Meter',
      flooring: 'Marble Chips Flooring',
      street_width: '20ft Street',
    },
    amenities: [
      'Sweet Water Bore / Supply',
      'Solid Wooden Doors',
      'Near Jamia Masjid & Park',
    ],
    media: [
      {
        id: 'med-sqd-9-1',
        property_id: 'sqd-prop-09',
        url: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Kausar Colony 3.5 Marla House',
        is_featured: true,
        display_order: 0,
      },
    ],
    created_at: '2026-10-23T07:00:00Z',
    updated_at: '2026-10-23T07:00:00Z',
  },
  {
    id: 'sqd-prop-10',
    title: '4 Marla Commercial Plot on Bypass Road',
    slug: '4-marla-commercial-plot-bypass-road-sadiqabad',
    description: `مین بائی پاس روڈ صادق آباد پر 4 مرلہ پرائم کمرشل پلاٹ برائے فروخت۔

تفصیلات:
• سائز: 4 مرلہ (900 اسکوائر فٹ)
• مین روڈ فرنٹ، ہیوی ٹریفک اور ٹرانسپورٹ روٹ
• شوروم، گودام، ورکشاپ، سروس اسٹیشن یا کمرشل بلڈنگ کے لیے بہترین موزوں
• ڈیمانڈ: 42 لاکھ روپے
• فوری رجسٹری انتقال اور موقع پر قبضہ۔`,
    price: 4200000,
    currency: 'PKR',
    property_type: 'commercial',
    listing_status: 'for_sale',
    bedrooms: 0,
    bathrooms: 0,
    area_sqft: 900,
    area_marla: 4,
    year_built: 2025,
    is_featured: false,
    featured_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    location: {
      address: 'Near Bypass Chowk, Main Bypass Road',
      locality: 'Bypass Road',
      city: 'Sadiqabad',
      state: 'Punjab',
      postal_code: '64350',
      country: 'Pakistan',
      latitude: 28.309,
      longitude: 70.141,
    },
    features: {
      structure_type: 'Commercial Land / Plot',
      registry_status: 'Commercial Registry & Intiqal (رجسٹری انتقال)',
      car_porch: 'Wide Front Parking',
      water_source: 'Water Bore Available',
      gas_status: 'Commercial Gas Connection Eligible',
      electricity: 'High-Voltage WAPDA Line on Bypass',
      flooring: 'Open Land',
      street_width: 'Heavy Commercial Bypass Road',
    },
    amenities: [
      'Commercial Frontage',
      '40ft Carpeted Main Road',
      '3-Phase WAPDA Electricity',
    ],
    media: [
      {
        id: 'med-sqd-10-1',
        property_id: 'sqd-prop-10',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
        alt_text: 'Bypass Road Commercial Plot',
        is_featured: true,
        display_order: 0,
      },
    ],
    created_at: '2026-10-22T08:00:00Z',
    updated_at: '2026-10-22T08:00:00Z',
  },
];

export const INITIAL_INQUIRIES: PropertyInquiry[] = [
  {
    id: 'inq-sqd-1',
    property_id: 'sqd-prop-01',
    property_title: '3 Marla Single-Story Compact Family House',
    full_name: 'Muhammad Tariq',
    email: 'tariq.sadiqabad@gmail.com',
    phone: '+92 300 9876543',
    inquiry_type: 'viewing',
    preferred_date: '2026-10-26',
    preferred_time: '16:00',
    message: 'اسلام علیکم، میں اپنی فیملی کے ہمراہ کوثر کالونی والا 3 مرلہ مکان دیکھنا چاہتا ہوں۔ کیا اتوار کی سہ پہر وزٹ ممکن ہے؟ اور رجسٹری کی تفصیلات شیئر فرمائیں۔',
    status: 'new',
    created_at: '2026-10-24T08:30:00Z',
  },
  {
    id: 'inq-sqd-2',
    property_id: 'sqd-prop-02',
    property_title: '5 Marla Brand New Modern Single-Story House',
    full_name: 'Chaudhry Nadeem Akhtar',
    email: 'nadeem.transport@yahoo.com',
    phone: '+92 301 7654321',
    inquiry_type: 'advisory',
    message: 'سیٹلائٹ ٹاؤن والے 5 مرلہ مکان میں پینے کا پانی کیسا ہے اور کیا 45 لاکھ میں سودا فائنل ہو سکتا ہے؟ مہربانی فرما کر رابطہ کریں۔',
    status: 'contacted',
    created_at: '2026-10-23T14:10:00Z',
  },
  {
    id: 'inq-sqd-3',
    property_id: 'sqd-prop-03',
    property_title: '5 Marla Double-Story Solid Built Family House',
    full_name: 'Dr. Kashif Riaz',
    email: 'drkashif.ryk@gmail.com',
    phone: '+92 302 5551234',
    inquiry_type: 'financing',
    message: 'علامہ اقبال ٹاؤن والے ڈبل سٹوری مکان کے کاغذات اور فرد کی کاپی درکار ہے۔ ہم موقع پر دیکھ کر ٹوکن کروانا چاہتے ہیں۔',
    status: 'qualified',
    created_at: '2026-10-22T16:40:00Z',
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-langcasen',
    email: 'langcasen@gmail.com',
    full_name: 'Admin - Sadiqabad Real Estate',
    phone: '+92 300 8671234',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
    created_at: '2026-08-01T09:00:00Z',
    inquiry_count: 0,
  },
  {
    id: 'usr-client-1',
    email: 'client@sadiqabad.pk',
    full_name: 'Haji Abdul Rasheed',
    phone: '+92 300 1122334',
    role: 'user',
    created_at: '2026-10-10T12:00:00Z',
    inquiry_count: 3,
  },
];
