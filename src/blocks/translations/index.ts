export const relatedPostsTranslations = {
  relatedArticles: {
    en: 'Related articles',
    id: 'Artikel terkait',
  },
  seeAllArticles: {
    en: 'See all articles',
    id: 'Lihat semua artikel',
  },
  untitledPost: {
    en: 'Untitled Post',
    id: 'Postingan Tanpa Judul',
  },
} as const

export const commentsBlockTranslations = {
  addComment: {
    en: 'Add a Comment',
    id: 'Tambahkan Komentar',
  },
  comment: {
    en: 'Comment',
    id: 'Komentar',
  },
  commentMaxLength: {
    en: (length: number) => `Comment must not exceed ${length} characters`,
    id: (length: number) => `Komentar tidak boleh melebihi ${length} karakter`,
  },
  commentMinLength: {
    en: (length: number) => `Comment must be at least ${length} character long`,
    id: (length: number) => `Komentar harus minimal ${length} karakter`,
  },
  commentRequired: {
    en: 'Comment is required',
    id: 'Komentar wajib diisi',
  },
  comments: {
    en: 'Comments',
    id: 'Komentar',
  },
  commentSubmitted: {
    en: 'Your comment has been submitted!',
    id: 'Komentar Anda telah dikirim!',
  },
  email: {
    en: 'Email',
    id: 'Email',
  },
  emailMaxLength: {
    en: (length: number) => `Email must not exceed ${length} characters`,
    id: (length: number) => `Email tidak boleh melebihi ${length} karakter`,
  },
  emailRequired: {
    en: 'Email is required',
    id: 'Email wajib diisi',
  },
  enterYourEmail: {
    en: 'Enter your email',
    id: 'Masukkan email Anda',
  },
  enterYourName: {
    en: 'Enter your name',
    id: 'Masukkan nama Anda',
  },
  gotoAdminAndPublish: {
    en: 'Goto Admin and publish',
    id: 'Buka Admin dan publikasikan',
  },
  invalidEmail: {
    en: 'Invalid email address',
    id: 'Alamat email tidak valid',
  },
  name: {
    en: 'Name',
    id: 'Nama',
  },
  nameMaxLength: {
    en: (length: number) => `Name must not exceed ${length} characters`,
    id: (length: number) => `Nama tidak boleh melebihi ${length} karakter`,
  },
  nameMinLength: {
    en: (length: number) => `Name must be at least ${length} character long`,
    id: (length: number) => `Nama harus minimal ${length} karakter`,
  },
  nameRequired: {
    en: 'Name is required',
    id: 'Nama wajib diisi',
  },
  process: {
    en: 'Process',
    id: 'Memproses',
  },
  shareThoughts: {
    en: 'Share your thoughts and feedback on this article.',
    id: 'Bagikan pemikiran dan masukan Anda tentang artikel ini.',
  },
  somethingWentWrong: {
    en: 'Something went wrong',
    id: 'Terjadi kesalahan',
  },
  submit: {
    en: 'Submit',
    id: 'Kirim',
  },
  unnamedUser: {
    en: 'Unnamed User',
    id: 'Pengguna Tanpa Nama',
  },
  writeYourComment: {
    en: 'Write your comment',
    id: 'Tulis komentar Anda',
  },
}

export const blogBlockTranslations = {
  allArticles: {
    en: 'All Articles',
    id: 'Semua Artikel',
  },
  checkBackLater: {
    en: 'Check back later for new content.',
    id: 'Kembali lagi nanti untuk konten baru.',
  },
  featuredPosts: {
    en: 'Featured Posts',
    id: 'Postingan Unggulan',
  },
  latestBlogPosts: {
    en: 'Latest Blog Posts',
    id: 'Postingan Blog Terbaru',
  },
  latestUpdates: {
    en: 'Latest Updates',
    id: 'Pembaruan Terbaru',
  },
  minRead: {
    en: 'min read',
    id: 'menit baca',
  },
  noDescriptionAvailable: {
    en: 'No description available',
    id: 'Tidak ada deskripsi tersedia',
  },
  noPostsFound: {
    en: 'No posts found.',
    id: 'Tidak ada postingan ditemukan.',
  },
  on: {
    en: 'on',
    id: 'pada',
  },
  readArticle: {
    en: 'Read article',
    id: 'Baca artikel',
  },
  readMore: {
    en: 'Read more',
    id: 'Baca selengkapnya',
  },
  relatedPosts: {
    en: 'Related Posts',
    id: 'Postingan Terkait',
  },
  showingPosts: {
    en: (current: number, total: number) => `Showing ${current} of ${total} posts`,
    id: (current: number, total: number) => `Menampilkan ${current} dari ${total} postingan`,
  },
  unknown: {
    en: 'MIDBLCK',
    id: 'MIDBLCK',
  },
} as const

export const paginationTranslations = {
  goToNextPage: {
    en: 'Go to next page',
    id: 'Ke halaman berikutnya',
  },
  goToPreviousPage: {
    en: 'Go to previous page',
    id: 'Ke halaman sebelumnya',
  },
  next: {
    en: 'Next',
    id: 'Selanjutnya',
  },
  previous: {
    en: 'Previous',
    id: 'Sebelumnya',
  },
} as const

export const contactUsBlockTranslations = {
  addressLabel: {
    en: 'Address',
    id: 'Alamat',
  },
  chatDescription: {
    en: 'Get instant help from our support team.',
    id: 'Dapatkan bantuan instan dari tim dukungan kami.',
  },
  chatLabel: {
    en: 'Live Chat',
    id: 'Live Chat',
  },
  connectNow: {
    en: 'Connect Now',
    id: 'Hubungi Sekarang',
  },
  emailDescription: {
    en: 'We respond to all emails within 24 hours.',
    id: 'Kami merespons semua email dalam 24 jam.',
  },
  emailLabel: {
    en: 'Email',
    id: 'Email',
  },
  officeDescription: {
    en: 'Drop by our office for a chat.',
    id: 'Kunjungi kantor kami untuk berbincang.',
  },
  officeHours: {
    en: 'Office Hours',
    id: 'Jam Kantor',
  },
  officeLabel: {
    en: 'Office',
    id: 'Kantor',
  },
  phoneDescription: {
    en: "We're available Mon-Fri, 9am-5pm.",
    id: 'Kami tersedia Senin-Jumat, 9am-5pm.',
  },
  phoneLabel: {
    en: 'Phone',
    id: 'Telepon',
  },
  startChat: {
    en: 'Start Chat',
    id: 'Mulai Chat',
  },
  whatsappMissingMessage: {
    en: 'WhatsApp message is not configured yet.',
    id: 'Pesan WhatsApp belum dikonfigurasi.',
  },
  whatsappMissingNumber: {
    en: 'WhatsApp number is not available right now.',
    id: 'Nomor WhatsApp belum tersedia.',
  },
  whatsappUnavailable: {
    en: 'WhatsApp chat is currently unavailable.',
    id: 'Chat WhatsApp sedang tidak tersedia.',
  },
} as const

export const formBlockTranslations = {
  agreeToTerms: {
    en: 'I agree to the terms.',
    id: 'Saya setuju dengan syarat dan ketentuan.',
  },
  continueLabel: {
    en: 'Continue',
    id: 'Lanjutkan',
  },
  internalServerError: {
    en: 'Internal Server Error',
    id: 'Kesalahan Server Internal',
  },
  requiredLabel: {
    en: '(required)',
    id: '(wajib diisi)',
  },
  sending: {
    en: 'Sending...',
    id: 'Mengirim...',
  },
  somethingWentWrong: {
    en: 'Something went wrong.',
    id: 'Terjadi kesalahan.',
  },
  submit: {
    en: 'Submit',
    id: 'Kirim',
  },
} as const

export const mapBlockTranslations = {
  loadingMap: {
    en: 'Loading map...',
    id: 'Memuat peta...',
  },
  noLocationDataAvailable: {
    en: 'No location data available.',
    id: 'Data lokasi tidak tersedia.',
  },
  openInMaps: {
    en: 'Open in Maps',
    id: 'Buka di Maps',
  },
  viewOnGoogleMaps: {
    en: 'View on Google Maps',
    id: 'Lihat di Google Maps',
  },
} as const

export const iframeBlockTranslations = {
  codepenContent: {
    en: 'CodePen content',
    id: 'Konten CodePen',
  },
  contentBlocked: {
    en: 'Content Blocked',
    id: 'Konten Diblokir',
  },
  contentBlockedDescription: {
    en: 'This content cannot be embedded due to security restrictions or CORS policies.',
    id: 'Konten ini tidak dapat disematkan karena pembatasan keamanan atau kebijakan CORS.',
  },
  externalContent: {
    en: 'External content',
    id: 'Konten eksternal',
  },
  googleMapsContent: {
    en: 'Google Maps content',
    id: 'Konten Google Maps',
  },
  loading: {
    en: 'Loading...',
    id: 'Memuat...',
  },
  openInNewTab: {
    en: 'Open in New Tab',
    id: 'Buka di Tab Baru',
  },
  vimeoContent: {
    en: 'Vimeo content',
    id: 'Konten Vimeo',
  },
  youtubeContent: {
    en: 'YouTube content',
    id: 'Konten YouTube',
  },
} as const

export const testimonialBlockTranslations = {
  anonymousLabel: {
    en: 'Anonymous',
    id: 'Anonim',
  },
  badgeLabel: {
    en: 'Testimonials',
    id: 'Testimoni',
  },
  customerLabel: {
    en: 'Customer',
    id: 'Pelanggan',
  },
  emptyStateCmsMessage: {
    en: 'Add testimonials in the CMS to showcase customer quotes in this section.',
    id: 'Tambahkan testimoni di CMS untuk menampilkan kutipan pelanggan di bagian ini.',
  },
  emptyStatePayloadMessage: {
    en: 'Add testimonials in Payload CMS to showcase customer stories here.',
    id: 'Tambahkan testimoni di Payload CMS untuk menampilkan cerita pelanggan di sini.',
  },
  fallbackQuoteDefault: {
    en: 'Amazing service and results.',
    id: 'Layanan dan hasil yang luar biasa.',
  },
  fallbackQuoteEmphasized: {
    en: 'Amazing service and results!',
    id: 'Layanan dan hasil yang luar biasa!',
  },
  fallbackQuotePartnership: {
    en: 'Incredible partnership and results.',
    id: 'Kemitraan dan hasil yang luar biasa.',
  },
  fallbackQuoteSupportExperience: {
    en: 'Outstanding support and experience.',
    id: 'Dukungan dan pengalaman yang luar biasa.',
  },
  fallbackQuoteSupportPerformance: {
    en: 'Outstanding support and performance.',
    id: 'Dukungan dan kinerja yang luar biasa.',
  },
  goToTestimonial: {
    en: (index: number) => `Go to testimonial ${index}`,
    id: (index: number) => `Ke testimoni ${index}`,
  },
  headingBlock24: {
    en: 'See why customers love our platform',
    id: 'Lihat mengapa pelanggan menyukai platform kami',
  },
  headingBlock25: {
    en: 'Trusted by product builders',
    id: 'Dipercaya para pembangun produk',
  },
  headingBlock28: {
    en: 'Testimonials',
    id: 'Testimoni',
  },
  headingBlock29: {
    en: 'Testimonials',
    id: 'Testimoni',
  },
  headingStyle1: {
    en: 'What Our Clients Say',
    id: 'Apa Kata Klien Kami',
  },
  headingStyle2: {
    en: 'Happy Customers',
    id: 'Pelanggan yang Bahagia',
  },
  headingStyle3: {
    en: "Don't take our word for it. See what customers are saying about us.",
    id: 'Jangan hanya percaya kata kami. Lihat apa yang pelanggan katakan tentang kami.',
  },
  learnMoreLabel: {
    en: 'Learn more',
    id: 'Pelajari lebih lanjut',
  },
  readStoriesLabel: {
    en: 'Read our customer stories',
    id: 'Baca cerita pelanggan kami',
  },
} as const

export const templatesPageTranslations = {
  assignTemplatesInstruction: {
    en: 'Go to Midblck admin → Templates collection → assign templates to the "templates" category or its child categories (like "homepage")',
    id: 'Buka admin Midblck → Koleksi Template → gunakan template ke kategori "templates" atau sub kategori (seperti "homepage")',
  },
  checkConsole: {
    en: 'Check the console for detailed error logs.',
    id: 'Periksa konsol untuk log kesalahan yang detail.',
  },
  createTemplatesCategoryInstruction: {
    en: 'Please create a category with slug "templates" in your Payload admin to organize your templates.',
    id: 'Silakan buat kategori dengan slug "templates" di admin Payload Anda untuk mengorganisir template Anda.',
  },
  errorLoadingTemplates: {
    en: 'Error Loading Templates',
    id: 'Kesalahan Memuat Template',
  },
  errorLoadingTemplatesDescription: {
    en: 'An error occurred while loading the templates page.',
    id: 'Terjadi kesalahan saat memuat halaman template.',
  },
  noTemplatesAssigned: {
    en: 'No templates are assigned to the "templates" category or its child categories.',
    id: 'Tidak ada template yang ditugaskan ke kategori "templates" atau kategori anaknya.',
  },
  noTemplatesCategory: {
    en: 'Templates category not found',
    id: 'Kategori template tidak ditemukan',
  },
  noTemplatesFound: {
    en: 'No Templates Found',
    id: 'Tidak Ada Template Ditemukan',
  },
  ourTemplates: {
    en: 'Our Templates',
    id: 'Template Kami',
  },
  templatesDescription: {
    en: 'Pick a page layout template, customize it, and make it yours. Our responsive page layouts are designed to simplify page creation',
    id: 'Pilih template tata letak halaman, sesuaikan, dan buat milik Anda sendiri. Tata letak halaman responsif kami dirancang untuk menyederhanakan pembuatan halaman',
  },
} as const

export type Locale = 'en' | 'id'
