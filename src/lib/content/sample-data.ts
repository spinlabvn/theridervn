/**
 * Bài viết MẪU – được dùng khi chưa cấu hình Sanity (NEXT_PUBLIC_SANITY_PROJECT_ID trống).
 * Tác giả, nội dung và ảnh (Unsplash) chỉ để minh hoạ bố cục; hãy thay bằng nội dung thật trên Sanity.
 */
import { md } from "./text";
import type { RawCategory, RawPost } from "./types";

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=80`;

export const sampleCategories: RawCategory[] = [
  {
    slug: "road",
    order: 1,
    title: { vi: "Đường trường", en: "Road" },
    description: {
      vi: "Cung đường, group ride và văn hoá xe đạp đường trường.",
      en: "Routes, group rides and road cycling culture.",
    },
  },
  {
    slug: "mtb",
    order: 2,
    title: { vi: "Địa hình", en: "Mountain bike" },
    description: {
      vi: "Kỹ thuật, xe và đường mòn cho dân MTB.",
      en: "Skills, bikes and trails for mountain bikers.",
    },
  },
  {
    slug: "gravel",
    order: 3,
    title: { vi: "Gravel", en: "Gravel" },
    description: {
      vi: "Đường đất, bikepacking và những chuyến đi xa.",
      en: "Dirt roads, bikepacking and long adventures.",
    },
  },
  {
    slug: "gear",
    order: 4,
    title: { vi: "Trang bị", en: "Gear" },
    description: {
      vi: "Đánh giá, tư vấn chọn mua và bảo dưỡng xe.",
      en: "Reviews, buying advice and bike maintenance.",
    },
  },
  {
    slug: "training",
    order: 5,
    title: { vi: "Tập luyện", en: "Training" },
    description: {
      vi: "Giáo án, dinh dưỡng và phục hồi.",
      en: "Training plans, nutrition and recovery.",
    },
  },
  {
    slug: "events",
    order: 6,
    title: { vi: "Sự kiện", en: "Events" },
    description: {
      vi: "Giải đấu, gran fondo và các sự kiện cộng đồng.",
      en: "Races, gran fondos and community events.",
    },
  },
];

const cat = (slug: string) => sampleCategories.find((c) => c.slug === slug)!;

const authors = {
  khoa: { name: "Minh Khoa", role: { vi: "Biên tập viên Road", en: "Road Editor" } },
  lanAnh: { name: "Lan Anh", role: { vi: "Biên tập viên Trang bị", en: "Gear Editor" } },
  huy: { name: "Đức Huy", role: { vi: "Biên tập viên MTB & Gravel", en: "MTB & Gravel Editor" } },
  trang: { name: "Thu Trang", role: { vi: "Huấn luyện viên cộng tác", en: "Contributing Coach" } },
};

export const samplePosts: RawPost[] = [
  {
    slug: "bon-ngay-tren-cao-nguyen-da-ma-pi-leng",
    featured: true,
    publishedAt: "2026-10-14T07:00:00+07:00",
    category: cat("road"),
    tags: ["Hà Giang", "Mã Pí Lèng", "Leo đèo", "Hành trình"],
    author: authors.khoa,
    coverUrl: img("1471506480208-91b3a4cc78be"),
    coverAlt: {
      vi: "Người đạp xe trên con đường uốn lượn giữa những ngọn đồi lúc bình minh",
      en: "A cyclist on a winding road through rolling hills at sunrise",
    },
    title: {
      vi: "Bốn ngày trên cao nguyên đá: đạp xe qua đèo Mã Pí Lèng",
      en: "Four days on the stone plateau: riding the Ma Pi Leng pass",
    },
    excerpt: {
      vi: "Khoảng 350 km, hàng nghìn mét leo và những khúc cua nhìn xuống sông Nho Quế. Đây là cách chúng tôi chia chặng, chọn xe và giữ sức cho cung đường đẹp nhất miền Bắc.",
      en: "Around 350 km, thousands of metres of climbing and switchbacks above the Nho Que river. How we split the stages, chose the bikes and paced the most beautiful loop in northern Vietnam.",
    },
    body: {
      vi: md(`
Có những cung đường bạn đạp để lấy số liệu. Và có những cung đường như vòng cung cao nguyên đá Hà Giang – nơi bạn sẽ dừng lại ở mỗi khúc cua chỉ để nhìn. Bốn ngày, khoảng 350 km và một bài học lớn: trên núi, nhịp độ đều quan trọng hơn sức mạnh.

## Chia chặng thế nào cho hợp lý

Chúng tôi chia hành trình thành bốn chặng, mỗi chặng 70–100 km, để luôn tới điểm nghỉ trước khi trời tối. Chặng đầu qua Cổng trời Quản Bạ là bài khởi động tốt: dốc dài nhưng không quá gắt.

- **Ngày 1:** Thành phố Hà Giang – Quản Bạ – Yên Minh
- **Ngày 2:** Yên Minh – Đồng Văn
- **Ngày 3:** Đồng Văn – Mã Pí Lèng – Mèo Vạc
- **Ngày 4:** Mèo Vạc – quay về theo cung đường khác

## Mã Pí Lèng: đừng vội

Đoạn đèo nổi tiếng nhất không phải đoạn khó nhất, nhưng là đoạn dễ khiến bạn "đốt" sức nhất vì phấn khích. Hãy giữ nhịp tim ở vùng 2–3, ăn mỗi 40 phút và để dành năng lượng cho những con dốc ngắn mà gắt sau đó.

> Trên núi, người về đích đẹp nhất là người biết tiết chế ở cây số thứ 20, không phải cây số thứ 80.

## Trang bị nên mang

Một chiếc xe road có líp lớn (34T trở lên) hoặc xe gravel là lựa chọn an toàn. Mang theo áo gió vì nhiệt độ trên đỉnh đèo có thể chênh nhiều so với chân dốc, đèn trước/sau và ít nhất hai săm dự phòng.
`),
      en: md(`
Some roads you ride for the numbers. Others – like the Ha Giang stone plateau loop – make you stop at every switchback just to look. Four days, roughly 350 km and one big lesson: in the mountains, steady pacing beats raw power.

## Splitting the stages

We broke the trip into four stages of 70–100 km so we always reached our stop before dark. Day one over the Quan Ba "Heaven's Gate" is a perfect warm-up: long, but never brutal.

- **Day 1:** Ha Giang city – Quan Ba – Yen Minh
- **Day 2:** Yen Minh – Dong Van
- **Day 3:** Dong Van – Ma Pi Leng – Meo Vac
- **Day 4:** Meo Vac – back via a different road

## Ma Pi Leng: take your time

The famous pass isn't the hardest section, but it's the one where excitement makes you burn matches. Keep your heart rate in zones 2–3, eat every 40 minutes and save something for the short, steep ramps that follow.

> In the mountains, the best finisher is the one who held back at kilometre 20, not kilometre 80.

## What to pack

A road bike with a big cassette (34T or larger) or a gravel bike is the safe choice. Bring a wind jacket – the summit can be much cooler than the valley – front and rear lights, and at least two spare tubes.
`),
    },
  },
  {
    slug: "xe-aero-hay-xe-leo-doc",
    featured: false,
    publishedAt: "2026-10-11T08:00:00+07:00",
    category: cat("gear"),
    tags: ["Xe road", "Aero", "Tư vấn chọn xe"],
    author: authors.lanAnh,
    coverUrl: img("1532298229144-0ec0c57515c7"),
    coverAlt: {
      vi: "Chiếc xe đạp road màu đen trong studio tối",
      en: "A black road bike in a dark studio",
    },
    title: {
      vi: "Xe aero hay xe leo dốc: chọn khung nào cho đường Việt Nam?",
      en: "Aero or climbing bike: which frame suits Vietnamese roads?",
    },
    excerpt: {
      vi: "Phần lớn chúng ta đạp ở tốc độ 28–35 km/h trên đường bằng, gió ngang và thỉnh thoảng một con đèo. Câu trả lời có thể khác với những gì bạn thấy trên TV.",
      en: "Most of us ride at 28–35 km/h on flat roads with crosswinds and the occasional climb. The answer may not be what you see on TV.",
    },
    body: {
      vi: md(`
Mỗi mùa mua sắm, câu hỏi chúng tôi nhận nhiều nhất vẫn là: "Nên mua xe aero hay xe nhẹ để leo dốc?". Câu trả lời ngắn: hãy nhìn vào nơi bạn đạp nhiều nhất, không phải nơi bạn mơ được đạp.

## Khi nào xe aero đáng tiền

Lực cản không khí tăng rất nhanh theo tốc độ. Nếu phần lớn quãng đường của bạn là đường bằng ven biển hoặc đại lộ ngoại ô ở tốc độ trên 30 km/h, khung aero và bánh vành cao sẽ giúp bạn tiết kiệm sức đáng kể sau vài giờ đạp.

## Khi nào nên ưu tiên trọng lượng

Nếu bạn sống gần đèo, thường đạp Tam Đảo, Bà Nà hay các cung đường Tây Nguyên, mỗi trăm gram sẽ có ý nghĩa hơn. Nhưng hãy nhớ: chênh lệch vài trăm gram trên xe thường nhỏ hơn chênh lệch cân nặng cơ thể giữa hai mùa.

## Lựa chọn thứ ba: xe "all-round"

Thế hệ khung road hiện đại đã thu hẹp khoảng cách giữa hai trường phái. Với đa số người chơi phong trào, một khung all-round cùng bánh vành 40–50 mm là điểm cân bằng tốt.

- Ưu tiên **fit** (số đo khung, góc ngồi) trước mọi thông số khác
- Chọn lốp 28 mm trở lên cho mặt đường nhiều ổ gà
- Để dành ngân sách cho một buổi bike fit chuyên nghiệp
`),
      en: md(`
Every buying season, the question we get most is: "Should I buy an aero bike or a light climbing bike?" The short answer: look at where you ride most, not where you dream of riding.

## When aero is worth it

Air resistance rises steeply with speed. If most of your miles are on flat coastal roads or suburban boulevards above 30 km/h, an aero frame and deep wheels will save meaningful energy over a few hours.

## When weight matters more

If you live near climbs and regularly ride Tam Dao, Ba Na or the Central Highlands, every hundred grams counts for more. But remember: a few hundred grams of bike is usually less than the difference in your own body weight between seasons.

## Option three: the all-rounder

Modern road frames have narrowed the gap between the two camps. For most amateur riders, an all-round frame with 40–50 mm wheels is the sweet spot.

- Prioritise **fit** (frame size, geometry) over every other spec
- Choose 28 mm tyres or wider for potholed roads
- Save budget for a professional bike fit
`),
    },
  },
  {
    slug: "giao-an-8-tuan-chinh-phuc-100-km",
    featured: false,
    publishedAt: "2026-10-08T06:30:00+07:00",
    category: cat("training"),
    tags: ["Giáo án", "Người mới", "Sức bền"],
    author: authors.trang,
    coverUrl: img("1528629297340-d1d466945dc5"),
    coverAlt: {
      vi: "Người đạp xe tăng tốc trên đường nhựa",
      en: "A rider accelerating on an asphalt road",
    },
    title: {
      vi: "Giáo án 8 tuần: từ 50 km tới cột mốc 100 km đầu tiên",
      en: "An 8-week plan: from 50 km to your first 100 km",
    },
    excerpt: {
      vi: "Ba buổi mỗi tuần, tăng khối lượng có kiểm soát và một tuần giảm tải trước ngày lớn. Giáo án đơn giản nhưng đủ để bạn về đích còn cười được.",
      en: "Three rides a week, controlled progression and a taper before the big day. Simple, but enough to finish your century with a smile.",
    },
    body: {
      vi: md(`
100 km là cột mốc mà gần như ai bắt đầu đạp xe nghiêm túc cũng muốn chinh phục. Tin tốt: nếu bạn đã đạp thoải mái 50 km, tám tuần là đủ.

## Nguyên tắc chung

Mỗi tuần gồm ba buổi: một buổi cường độ ngắn giữa tuần, một buổi đạp nhẹ phục hồi và một buổi dài cuối tuần. Buổi dài tăng khoảng 10% mỗi tuần, riêng tuần thứ 4 giảm tải để cơ thể kịp thích nghi.

1. **Tuần 1–3:** buổi dài 55 → 70 km, nhịp độ nói chuyện được
2. **Tuần 4:** giảm tải, buổi dài 50 km
3. **Tuần 5–7:** buổi dài 75 → 90 km, tập ăn uống trên xe
4. **Tuần 8:** giảm tải nhẹ đầu tuần, cuối tuần chinh phục 100 km

## Buổi cường độ giữa tuần

Khởi động 15 phút, sau đó 4–6 hiệp 4 phút ở mức "khó nhưng duy trì được", nghỉ 3 phút giữa các hiệp. Buổi này giúp nâng ngưỡng để nhịp độ trong buổi dài trở nên nhẹ nhàng hơn.

## Đừng bỏ qua phục hồi

Ngủ đủ giấc và ăn đủ tinh bột quan trọng không kém buổi tập. Nếu thấy nhịp tim lúc nghỉ tăng bất thường hoặc chân nặng kéo dài, hãy nghỉ thêm một ngày – giáo án phục vụ bạn, không phải ngược lại.
`),
      en: md(`
100 km is the milestone almost everyone who starts riding seriously wants to tick off. Good news: if you can comfortably ride 50 km, eight weeks is enough.

## The principles

Each week has three rides: a short intensity session midweek, an easy recovery spin and a long weekend ride. The long ride grows about 10% a week, with week 4 as a recovery week so your body can adapt.

1. **Weeks 1–3:** long ride 55 → 70 km at conversational pace
2. **Week 4:** recovery, long ride 50 km
3. **Weeks 5–7:** long ride 75 → 90 km, practise eating on the bike
4. **Week 8:** light taper early in the week, ride your 100 km at the weekend

## The midweek session

Warm up for 15 minutes, then 4–6 reps of 4 minutes at "hard but sustainable", with 3 minutes easy between reps. It lifts your threshold so long-ride pace feels easier.

## Don't skip recovery

Sleep and carbohydrates matter as much as the sessions. If your resting heart rate is unusually high or your legs stay heavy, take an extra day off – the plan works for you, not the other way round.
`),
    },
  },
  {
    slug: "gravel-da-lat-duong-dat-do-langbiang",
    featured: true,
    publishedAt: "2026-10-04T07:30:00+07:00",
    category: cat("gravel"),
    tags: ["Đà Lạt", "Bikepacking", "Lâm Đồng"],
    author: authors.huy,
    coverUrl: img("1511994298241-608e28f14fde"),
    coverAlt: {
      vi: "Xe gravel chở túi bikepacking trên đồi lúc hoàng hôn",
      en: "A gravel bike loaded with bikepacking bags on a hill at sunset",
    },
    title: {
      vi: "Gravel ở Đà Lạt: những con đường đất đỏ quanh Langbiang",
      en: "Gravel in Da Lat: red-dirt roads around Langbiang",
    },
    excerpt: {
      vi: "Rừng thông, đường đất đỏ và khí hậu mát quanh năm – Đà Lạt có lẽ là sân chơi gravel tự nhiên nhất Việt Nam. Ghi chép từ ba ngày lang thang của chúng tôi.",
      en: "Pine forests, red dirt and cool weather year-round – Da Lat may be Vietnam's most natural gravel playground. Notes from three days of wandering.",
    },
    body: {
      vi: md(`
Nếu phải chọn một nơi để giới thiệu gravel với người mới, chúng tôi sẽ chọn Đà Lạt. Đường đất nén trong rừng thông, dốc vừa phải và không khí mát khiến mỗi giờ trên yên trôi đi rất nhanh.

## Vòng quanh chân núi Langbiang

Từ trung tâm, hướng về phía Lạc Dương rồi rẽ vào các đường lâm nghiệp quanh chân núi. Mặt đường chủ yếu là đất đỏ nén, xen kẽ những đoạn sỏi lớn – lốp 40 mm trở lên sẽ giúp bạn tự tin hơn nhiều.

## Mùa nào đẹp nhất

Mùa khô (khoảng tháng 11 đến tháng 4) là thời điểm lý tưởng. Mùa mưa, đất đỏ trở nên rất trơn và bám bùn vào bộ truyền động – nếu đi, hãy chuẩn bị chắn bùn và dầu xích loại ướt.

## Lưu ý khi đi rừng

- Tải bản đồ ngoại tuyến vì sóng điện thoại chập chờn
- Báo lộ trình cho người thân hoặc đi theo nhóm
- Tôn trọng đất canh tác và rừng phòng hộ: chỉ đi trên đường mòn có sẵn

> Gravel không phải là tốc độ. Gravel là được lạc đường một cách có chủ đích.
`),
      en: md(`
If we had to pick one place to introduce someone to gravel, it would be Da Lat. Hard-packed dirt through pine forest, moderate climbs and cool air make every hour in the saddle fly by.

## Around the foot of Langbiang

From the centre, head towards Lac Duong and turn onto the forestry roads circling the mountain. The surface is mostly packed red dirt with patches of chunky gravel – 40 mm tyres or wider will make you far more confident.

## When to go

The dry season (roughly November to April) is ideal. In the wet season the red dirt turns slick and cakes your drivetrain – if you go, bring mudguards and wet chain lube.

## Riding in the forest

- Download offline maps; mobile signal is patchy
- Share your route with someone or ride as a group
- Respect farmland and protected forest: stay on existing tracks

> Gravel isn't about speed. It's about getting lost on purpose.
`),
    },
  },
  {
    slug: "ky-thuat-xuong-doc-mtb-cho-nguoi-moi",
    featured: false,
    publishedAt: "2026-09-30T08:00:00+07:00",
    category: cat("mtb"),
    tags: ["Kỹ thuật", "Người mới", "Downhill"],
    author: authors.huy,
    coverUrl: img("1544191696-102dbdaeeaa0"),
    coverAlt: {
      vi: "Người chơi MTB đội mũ bảo hiểm lao xuống đường mòn",
      en: "A helmeted mountain biker descending a trail",
    },
    title: {
      vi: "Xuống dốc MTB an toàn: 5 kỹ thuật nền tảng cho người mới",
      en: "Descending safely on an MTB: 5 core skills for beginners",
    },
    excerpt: {
      vi: "Tư thế sẵn sàng, nhìn xa, phanh đúng lúc – những kỹ năng tưởng đơn giản nhưng quyết định bạn tận hưởng con dốc hay sợ hãi nó.",
      en: "Ready position, looking ahead, braking at the right time – simple-sounding skills that decide whether you enjoy a descent or fear it.",
    },
    body: {
      vi: md(`
Leo dốc là chuyện thể lực, còn xuống dốc là chuyện kỹ thuật. Tin vui là kỹ thuật học được – và học càng sớm, bạn càng ít ngã.

## 1. Tư thế sẵn sàng

Hai bàn đạp ngang nhau, đứng khỏi yên, khuỷu tay và đầu gối hơi cong như lò xo. Hạ thấp trọng tâm và để xe chuyển động tự do bên dưới cơ thể.

## 2. Nhìn xa, không nhìn bánh trước

Mắt bạn nhìn đâu, xe sẽ đi đó. Hãy nhìn trước 5–10 mét, vào đường chạy bạn muốn, đừng nhìn chằm chằm vào hòn đá bạn sợ.

## 3. Phanh trước khi vào cua

Giảm tốc trên đoạn thẳng, nhả phanh khi vào cua để bánh xe bám đường. Phanh trước mạnh hơn phanh sau, nhưng luôn bóp đều và dứt khoát, không giật.

## 4. Thả lỏng tay

Nắm ghi đông chặt khiến mọi rung động truyền thẳng lên người. Một hoặc hai ngón tay đặt hờ trên tay phanh là đủ.

## 5. Tập ở nơi dễ trước

Chọn một đoạn dốc ngắn, lặp lại nhiều lần thay vì lao vào đường mòn khó ngay ngày đầu. Mũ bảo hiểm và găng tay là bắt buộc, không phải tuỳ chọn.
`),
      en: md(`
Climbing is about fitness; descending is about skill. The good news is that skill can be learned – and the earlier you learn, the less you crash.

## 1. The ready position

Pedals level, out of the saddle, elbows and knees slightly bent like springs. Lower your centre of gravity and let the bike move freely beneath you.

## 2. Look ahead, not at your front wheel

Where your eyes go, the bike follows. Look 5–10 metres ahead along the line you want, not at the rock you're afraid of.

## 3. Brake before the corner

Scrub speed on the straight, release as you enter the turn so the tyres can grip. The front brake does more work than the rear, but always squeeze smoothly – never grab.

## 4. Relax your hands

A death grip sends every bump straight into your body. One or two fingers resting on the levers is enough.

## 5. Practise somewhere easy first

Pick a short slope and repeat it rather than throwing yourself at a hard trail on day one. A helmet and gloves are mandatory, not optional.
`),
    },
  },
  {
    slug: "checklist-gran-fondo-dau-tien",
    featured: true,
    publishedAt: "2026-09-26T07:00:00+07:00",
    category: cat("events"),
    tags: ["Gran fondo", "Giải phong trào", "Checklist"],
    author: authors.khoa,
    coverUrl: img("1517649763962-0c623066013b"),
    coverAlt: {
      vi: "Một đoàn cua-rơ đạp sát nhau trong cuộc đua",
      en: "A tight group of racers riding together in a race",
    },
    title: {
      vi: "Gran fondo đầu tiên: checklist từ đăng ký tới vạch đích",
      en: "Your first gran fondo: a checklist from sign-up to finish line",
    },
    excerpt: {
      vi: "Đạp trong đoàn hàng trăm người khác hẳn đạp một mình. Những gì cần chuẩn bị trước một tuần, tối hôm trước và trong ngày đua.",
      en: "Riding with hundreds of others is nothing like riding alone. What to prepare a week out, the night before and on race day.",
    },
    body: {
      vi: md(`
Gran fondo là định dạng giải phong trào ngày càng phổ biến: cự ly dài, có tính giờ nhưng tinh thần chính là hoàn thành và tận hưởng. Nếu đây là lần đầu, checklist dưới đây sẽ giúp bạn bớt lo.

## Một tuần trước

- Kiểm tra tổng thể xe: phanh, lốp, xích, cáp số
- Không thay đổi gì lớn (yên, giày, cleat) ngay trước giải
- Đọc kỹ điều lệ, bản đồ, vị trí trạm tiếp tế

## Tối hôm trước

- Chuẩn bị sẵn số đeo, chip tính giờ, đồ ăn và bình nước
- Ăn bữa tối giàu tinh bột quen thuộc, tránh món lạ
- Ngủ sớm – lo lắng là bình thường

## Trong ngày đua

Xuất phát chậm hơn bạn nghĩ. Trong đoàn đông, hãy giữ đường chạy ổn định, ra hiệu bằng tay khi có chướng ngại và không phanh gấp. Ăn trước khi đói, uống trước khi khát.

> Mục tiêu của gran fondo đầu tiên chỉ có một: về đích và muốn đăng ký lần sau.
`),
      en: md(`
The gran fondo is an increasingly popular amateur format: long distance, timed, but really about finishing and enjoying the day. If it's your first, this checklist will calm the nerves.

## One week out

- Give the bike a full check: brakes, tyres, chain, gear cables
- Don't change anything major (saddle, shoes, cleats) right before the event
- Read the rules, the route map and the feed-zone locations

## The night before

- Lay out your number, timing chip, food and bottles
- Eat a familiar carb-rich dinner; avoid anything new
- Get to bed early – nerves are normal

## On the day

Start slower than you think. In a big bunch, hold a steady line, point out hazards and never brake suddenly. Eat before you're hungry and drink before you're thirsty.

> Your first gran fondo has one goal: finish, and want to sign up again.
`),
    },
  },
  {
    slug: "dinh-duong-khi-dap-xe-troi-nong",
    featured: false,
    publishedAt: "2026-09-21T06:00:00+07:00",
    category: cat("training"),
    tags: ["Dinh dưỡng", "Thời tiết nóng", "Sức bền"],
    author: authors.trang,
    coverUrl: img("1541625602330-2277a4c46182"),
    coverAlt: {
      vi: "Hai người đạp xe road cạnh nhau dưới trời nắng",
      en: "Two road cyclists riding side by side in the sun",
    },
    title: {
      vi: "Ăn uống khi đạp xe đường dài trong thời tiết nóng ẩm",
      en: "Fuelling long rides in hot, humid weather",
    },
    excerpt: {
      vi: "Nắng 35°C và độ ẩm cao là “đặc sản” của nhiều cung đường Việt Nam. Bù nước, bù điện giải và nạp năng lượng đúng cách để không bị “sập nguồn”.",
      en: "35°C heat and high humidity are a staple of Vietnamese roads. How to hydrate, replace electrolytes and fuel properly so you don't bonk.",
    },
    body: {
      vi: md(`
Trong thời tiết nóng ẩm, mồ hôi bay hơi kém nên cơ thể phải làm việc vất vả hơn để hạ nhiệt. Kết quả: bạn mất nước nhanh hơn và cảm giác mệt đến sớm hơn bình thường.

## Nước và điện giải

Một quy tắc khởi đầu hợp lý là khoảng một bình nước (500–750 ml) mỗi giờ, điều chỉnh theo cơ thể và cường độ. Khi đạp trên hai giờ, hãy dùng thêm viên hoặc bột điện giải thay vì chỉ uống nước lọc.

## Năng lượng

Với các buổi dài, cơ thể cần nạp tinh bột đều đặn. Chia nhỏ: một miếng chuối, một thanh năng lượng hoặc một gói gel mỗi 30–45 phút dễ tiêu hoá hơn ăn nhiều một lúc.

## Mẹo cho ngày nắng gắt

- Xuất phát sớm, kết thúc trước 10 giờ sáng nếu có thể
- Đổ nước lên đầu, cổ ở các điểm dừng
- Chọn áo màu sáng, chất liệu thoáng
- Nhận biết dấu hiệu say nắng: chóng mặt, buồn nôn, ngừng ra mồ hôi – dừng lại ngay

Lưu ý: đây là hướng dẫn chung. Nếu bạn có bệnh lý nền, hãy hỏi ý kiến bác sĩ hoặc chuyên gia dinh dưỡng thể thao.
`),
      en: md(`
In hot, humid weather sweat evaporates poorly, so your body works harder to cool down. The result: you lose fluid faster and fatigue arrives earlier than usual.

## Fluids and electrolytes

A sensible starting rule is about one bottle (500–750 ml) per hour, adjusted for your body and the intensity. On rides longer than two hours, add electrolyte tablets or powder rather than drinking plain water only.

## Energy

On long rides your body needs a steady supply of carbohydrate. Little and often – a piece of banana, a bar or a gel every 30–45 minutes – is easier to digest than a big feed.

## Tips for scorching days

- Start early and finish before 10 a.m. if you can
- Pour water over your head and neck at stops
- Wear light-coloured, breathable kit
- Know the signs of heat illness: dizziness, nausea, no longer sweating – stop immediately

Note: this is general guidance. If you have a medical condition, consult a doctor or sports nutritionist.
`),
    },
  },
  {
    slug: "bao-duong-xich-15-phut-moi-tuan",
    featured: false,
    publishedAt: "2026-09-16T09:00:00+07:00",
    category: cat("gear"),
    tags: ["Bảo dưỡng", "Bộ truyền động", "DIY"],
    author: authors.lanAnh,
    coverUrl: img("1576435728678-68d0fbf94e91"),
    coverAlt: {
      vi: "Xe đạp road dựng cạnh bức tường gỗ",
      en: "A road bike leaning against a wooden wall",
    },
    title: {
      vi: "Bảo dưỡng xích 15 phút mỗi tuần: xe êm hơn, linh kiện bền hơn",
      en: "15 minutes of chain care a week: a quieter bike and longer-lasting parts",
    },
    excerpt: {
      vi: "Một bộ truyền động sạch có thể giúp bạn tiết kiệm vài watt và kéo dài tuổi thọ líp, đĩa. Quy trình đơn giản mà ai cũng làm được tại nhà.",
      en: "A clean drivetrain can save you a few watts and extend the life of your cassette and chainrings. A simple routine anyone can do at home.",
    },
    body: {
      vi: md(`
Xích là bộ phận làm việc vất vả nhất trên xe nhưng thường bị bỏ quên nhất. Bụi đường và dầu cũ tạo thành hỗn hợp mài mòn, ăn dần líp và đĩa – những linh kiện đắt hơn xích nhiều lần.

## Quy trình 15 phút

1. Lau sạch xích bằng khăn khô, quay ngược bàn đạp vài vòng
2. Dùng dung dịch tẩy dầu chuyên dụng với bàn chải nếu xích quá bẩn
3. Lau khô hoàn toàn
4. Nhỏ một giọt dầu vào mỗi mắt xích
5. Chờ vài phút rồi lau sạch dầu thừa ở mặt ngoài

## Dầu khô hay dầu ướt?

Dầu khô phù hợp đường bụi, ít mưa; dầu ướt bám lâu hơn khi trời mưa nhưng hút bụi nhiều hơn. Với khí hậu Việt Nam, nhiều người dùng dầu khô mùa nắng và chuyển sang dầu ướt vào mùa mưa.

## Khi nào thay xích

Dùng thước đo độ giãn xích – dụng cụ rẻ nhưng rất đáng tiền. Thay xích đúng lúc giúp bạn tránh phải thay cả bộ líp và đĩa sau này.
`),
      en: md(`
The chain works harder than any other part of your bike and gets the least attention. Road grit and old oil form a grinding paste that slowly eats your cassette and chainrings – parts that cost many times more than a chain.

## The 15-minute routine

1. Wipe the chain with a dry rag while backpedalling a few turns
2. Use a dedicated degreaser and brush if it's very dirty
3. Dry it completely
4. Put one drop of lube on each roller
5. Wait a few minutes, then wipe off the excess from the outside

## Dry or wet lube?

Dry lube suits dusty, dry roads; wet lube lasts longer in the rain but attracts more dirt. In Vietnam's climate many riders use dry lube in the dry season and switch to wet lube during the rains.

## When to replace the chain

Use a chain-wear checker – a cheap tool that pays for itself. Replacing the chain on time spares you from replacing the whole cassette and chainrings later.
`),
    },
  },
  {
    slug: "group-ride-dem-sai-gon",
    featured: false,
    publishedAt: "2026-09-10T21:00:00+07:00",
    category: cat("road"),
    tags: ["Sài Gòn", "Group ride", "Cộng đồng"],
    author: authors.khoa,
    coverUrl: img("1475666675596-cca2035b3d79"),
    coverAlt: {
      vi: "Góc nhìn từ ghi đông xe đạp trên con đường lúc hoàng hôn",
      en: "View over a bike's handlebars on a road at dusk",
    },
    title: {
      vi: "Khi thành phố ngủ: văn hoá group ride đêm ở Sài Gòn",
      en: "When the city sleeps: Saigon's night group-ride culture",
    },
    excerpt: {
      vi: "Đường thoáng, trời mát và những ánh đèn hậu nhấp nháy thành hàng dài. Vì sao ngày càng nhiều người chọn đạp xe sau 9 giờ tối?",
      en: "Empty roads, cooler air and long lines of blinking tail lights. Why are more riders choosing to ride after 9 p.m.?",
    },
    body: {
      vi: md(`
Ở một thành phố nóng và đông như Sài Gòn, buổi tối là khoảng thời gian hiếm hoi đường phố "nhường" lại cho người đạp xe. Không lạ khi các nhóm group ride đêm mọc lên ngày càng nhiều.

## Luật bất thành văn

Mỗi nhóm có quy tắc riêng, nhưng điểm chung là: đạp thành hàng đôi gọn gàng, người dẫn đầu ra hiệu chướng ngại, không ai bị bỏ lại phía sau. Tốc độ được thông báo trước để người mới chọn nhóm phù hợp.

## An toàn là trên hết

- Đèn trước sáng và đèn hậu nhấp nháy là bắt buộc
- Áo có chi tiết phản quang
- Tuân thủ đèn tín hiệu, kể cả khi đường vắng
- Luôn mang theo giấy tờ và điện thoại đã sạc đầy

> Group ride đêm không chỉ là tập luyện. Đó là cách người ta kết bạn trong một thành phố quá bận rộn.

## Tham gia lần đầu

Hãy liên hệ trưởng nhóm trước, hỏi về tốc độ trung bình và lộ trình. Đến sớm mười phút, giới thiệu bản thân và đạp ở cuối đoàn trong buổi đầu tiên để quan sát cách nhóm vận hành.
`),
      en: md(`
In a city as hot and crowded as Saigon, the evening is the rare time when the streets are handed back to cyclists. No wonder night group rides keep multiplying.

## The unwritten rules

Every group has its own code, but the basics are shared: ride in tidy pairs, the leader calls out hazards, and nobody gets dropped. The pace is announced in advance so newcomers can choose the right group.

## Safety first

- A bright front light and a flashing tail light are mandatory
- Wear kit with reflective details
- Obey traffic lights, even on empty roads
- Always carry ID and a fully charged phone

> Night group rides aren't just training. They're how people make friends in a city that's always busy.

## Joining for the first time

Message the organiser beforehand and ask about average speed and the route. Arrive ten minutes early, introduce yourself and ride at the back on your first outing to see how the group works.
`),
    },
  },
  {
    slug: "xe-mtb-dau-tien-hardtail-hay-full-suspension",
    featured: false,
    publishedAt: "2026-09-03T08:00:00+07:00",
    category: cat("mtb"),
    tags: ["Tư vấn chọn xe", "Hardtail", "Full-suspension"],
    author: authors.huy,
    coverUrl: img("1572111504021-40abd3479ddb"),
    coverAlt: {
      vi: "Chiếc xe đạp địa hình dựng trên sườn đồi",
      en: "A mountain bike standing on a hillside",
    },
    title: {
      vi: "Xe MTB đầu tiên: hardtail hay full-suspension?",
      en: "Your first MTB: hardtail or full suspension?",
    },
    excerpt: {
      vi: "Hai triết lý thiết kế, hai mức ngân sách và hai cảm giác lái rất khác nhau. Chọn đúng ngay từ đầu giúp bạn tiến bộ nhanh hơn.",
      en: "Two design philosophies, two budgets and two very different ride feels. Choosing right from the start helps you progress faster.",
    },
    body: {
      vi: md(`
Bước vào thế giới MTB, câu hỏi đầu tiên gần như luôn là: một phuộc trước (hardtail) hay giảm xóc cả trước lẫn sau (full-suspension)?

## Hardtail: đơn giản và hiệu quả

Hardtail nhẹ hơn, ít bộ phận cần bảo dưỡng hơn và thường rẻ hơn ở cùng mức linh kiện. Quan trọng hơn, nó "dạy" bạn chọn đường chạy và dùng cơ thể để hấp thụ địa hình – nền tảng kỹ thuật rất tốt.

## Full-suspension: tự tin trên địa hình khó

Giảm xóc sau giúp bánh xe bám đường tốt hơn trên đá, rễ cây và các đoạn xuống dốc kỹ thuật. Bạn sẽ ít mệt hơn trên những chuyến dài, đổi lại là trọng lượng, giá thành và công bảo dưỡng.

## Gợi ý của chúng tôi

- Chủ yếu đạp đường mòn nhẹ, đồi thấp, ngân sách vừa phải: **hardtail**
- Thường xuyên đi đường mòn kỹ thuật, đổ dốc nhiều: **full-suspension**
- Dù chọn loại nào, hãy ưu tiên đúng size khung và lốp tốt

Nếu có thể, hãy thuê hoặc mượn thử cả hai loại trên cùng một cung đường trước khi quyết định.
`),
      en: md(`
Stepping into mountain biking, the first question is almost always: front suspension only (hardtail) or suspension front and rear (full suspension)?

## Hardtail: simple and efficient

A hardtail is lighter, has fewer parts to maintain and is usually cheaper at the same component level. More importantly, it teaches you to pick lines and use your body to absorb terrain – a great foundation for skills.

## Full suspension: confidence on rough terrain

Rear suspension keeps the wheel tracking over rocks, roots and technical descents. You'll tire less on long rides, at the cost of weight, price and maintenance.

## Our suggestion

- Mostly mellow trails and low hills on a moderate budget: **hardtail**
- Regular technical trails with lots of descending: **full suspension**
- Whichever you choose, prioritise the right frame size and good tyres

If you can, rent or borrow both types on the same trail before you decide.
`),
    },
  },
];
