// shared/defaults.js
export const DEFAULT_SETTINGS = {
  site: { name: 'Reward Web', primary: '#d71920', secondary: '#ffd700' },
  banner: {
    title: 'Chào mừng Quốc khánh 2/9',
    subtitle: 'Xem quảng cáo – Nhận thưởng lớn!',
    ctaText: 'Bắt đầu kiếm điểm',
    ctaLink: '#earn',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg',
    effect: 'fireworks'
  },
  countdown: { seconds: 15, shape: 'round' },
  watch: { requiredSec: 12, antiSkip: true },
  sfx: { enabled: true, ting: '/sfx/ting.mp3', woosh: '/sfx/woosh.mp3' },
  modules: { withdraw: true, verify: true, admin: true },
  ads: [
    { id: 'ad1', type: 'video', src: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', reward: 5 },
    { id: 'ad2', type: 'image', src: 'https://picsum.photos/seed/ads2/800/300', reward: 7 }
  ]
};
