# Sürüm notları

## v1.5.2 — 24 Kasım 2026

### Eklendi
- **Kurulum dosyası (Setup):** Yönetici izni istemeyen kurulum; Başlat menüsü ve masaüstü kısayolu, Windows "Uygulamalar" listesinden kaldırma. Program içi güncelleme kurulu sürümde de çalışır.
- **7 yeni FPS ayarı:** Arka plan pencerelerinin oyunun önüne geçmesini engelleme, Game DVR'ı ilkeyle kapatma, svchost hizmet birleştirme, çekirdeği RAM'de tutma, arka plan uygulama ilkesi, Windows Arama dizinlemesini kapatma ve MPO'yu kapatma (çift monitör titremesi için).
- **Disk testi:** Performans testlerinde test edilecek sürücüyü seçme veya tüm sürücüleri sırayla test etme; Diskler sayfasında "Tüm sürücüleri test et".

### Düzeltildi
- **Monitör bilgileri:** 360 Hz gibi yüksek yenileme hızları ve çift/çoklu monitör doğru gösterilir; her ekranın adı, çözünürlüğü, çalıştığı ve desteklediği en yüksek Hz ayrı listelenir.
- **FPS optimizasyonu "Geri al":** Kayıt defteri değerleri ZETX öncesi hâline gerçekten döner ve doğrulanır (boş değerli ayarların silinmesi ve büyük sayıların yazılamaması düzeltildi). Yedeği olmayan ayarlar Windows varsayılanına döndürülür.
- **NVMe SSD'lerin SATA görünmesi:** Intel RST/VMD, RAID veya üretici sürücüsü kullanan sistemlerde M.2 NVMe diskler doğru tanınır; M.2 SATA diskler ayrıca belirtilir. Disk hız sınıflandırması düzeltildi.
- **Sürücüler:** Güncel sürücü kurulduğu hâlde "eski" görünmesi düzeltildi; birden fazla kayıt olduğunda en yeni sürüm esas alınır, en güncel sürüm listesi yenilendi (NVIDIA 621.24, AMD Adrenalin 26.11.2, AMD Chipset 8.09.28.1124).
- **Lisans etkinleştirme:** Bağlantı veya antivirüs kaynaklı bozuk yanıtlarda otomatik yeniden deneme (Windows sertifika deposunu kullanan ikinci bağlantı yolu).
- İngilizce arayüzde güncelleme kartındaki "Later" düğmesi.

## v1.5.1 — 15 Kasım 2026

### Eklendi
- **Donanım ayarları kontrolü:** RAM XMP/EXPO (kit modeli ve çalışma hızına göre), çift kanal ve yanlış yuva, karışık RAM kitleri, Resizable BAR / Smart Access Memory, Bellek Bütünlüğü (VBS/HVCI), ekran yenileme hızı (tek tıkla en yüksek Hz'e geçirme), çözünürlük, monitör kablosunun anakarta takılı olması ve ekran kartı PCIe hat genişliği. BIOS ayarları için anakart markasına göre (ASUS, MSI, GIGABYTE, ASRock) adım adım yol ve "BIOS'a yeniden başlat".
- **Ekran kartı profili:** NVIDIA sürücüsünün küresel profiline güç yönetimi "maksimum performans", düşük gecikme modu, doku filtreleme "yüksek performans" ve 10 GB gölgelendirici önbelleği; önceki değerler yedeklenir ve tek tıkla geri alınır. AMD Adrenalin ve Intel için adım adım rehber.
- **İngilizce dil desteği:** Sağ üstteki dil seçimiyle tüm arayüz, menüler ve overlay İngilizce.
- **Formata dayanıklı lisans:** Lisans artık bilgisayarın donanımına bağlıdır; Windows yeniden kurulsa da sipariş numarası ve e-postayla aynı bilgisayarda tekrar etkinleştirilir. Önceki sürümlerde etkinleştirilen lisanslar ilk açılışta otomatik taşınır.

### Düzeltildi
- Lisans sunucusuna ulaşılamadığında "geçersiz yanıt" yerine anlaşılır bir mesaj gösterilir.
- Güncelleme notları başlık ve açıklama olarak ayrı gösterilir.

## v1.5.0 — 10 Kasım 2026

### Eklendi
- **Program içi güncelleme:** Yeni sürüm çıktığında "Şimdi güncelle" ile program kendini indirir, Volkan Sezer imzasıyla doğrular, kurar ve yeniden açılır. GitHub sayfasına gitmek gerekmez; hata olursa önceki sürüm geri yüklenir. Güncelleme notları sürüm bilgisinin altında açıklamalı gösterilir.
- **Gecikme testi:** Sürücü bazlı DPC/ISR gecikmesi (ETW) ve Windows zamanlayıcı gecikmesi; sorunlu sürücü için çözüm önerileri.
- **İşlemci analizi:** Çekirdek yapısı, çekirdek başına saat ve park durumu, en hızlı çekirdek testi, tam yük testi ve işlemci ailesine özel tam güç protokolü.
- **Sıcaklık ve fanlar:** HWiNFO, LibreHardwareMonitor, AIDA64, Core Temp, NVIDIA ve ACPI okuma protokolleri; soğutma ilkesi ve fan yönetimi önerileri.
- **Diskler:** Birden çok SSD/HDD desteği, sağlık, TRIM, hizalama, önbelleksiz okuma/yazma testi ve iyileştirmeler.
- **Sürücü ve BIOS:** Sürüm denetimi, eski sürücü uyarısı ve resmi indirme bağlantıları.
- **Ağ:** QoS paket zamanlayıcıyı kapatma ve ağ kartı oyun profili (kesme denetimi, EEE, Green Ethernet, akış denetimi, LSO, güç tasarrufu), yedekli geri alma ve öneriler.
- **FPS optimizasyonu:** 9 yeni ayar (işlemciyi tam güçte tut, çekirdek park etmeyi kapat, zamanlayıcı çözünürlüğü, SysMain, Edge arka plan, pencere öğeleri, hata raporlama, menü gecikmesi, tam ekran iyileştirmeleri) ve ayrıntı açıklamaları.
- **Temizlik:** Prefetch, gereksiz Windows günlükleri, telemetri/tanılama verileri, etkinlik geçmişi, teslim iyileştirme önbelleği, tarayıcı ve başlatıcı önbellekleri, Geri Dönüşüm Kutusu.
- **FPS karşılaştırma:** Önceki FPS'i elle girme ve PresentMon / FrameView / CapFrameX CSV içe aktarma.
- **Arıza teşhisi:** Giderilmeyen sorunlar sonraki taramalarda "Giderilmedi" olarak işaretlenir; düzelenler "Giderildi" listesine alınır.
- Discord destek alanı ve Shopier üyelik hatırlatması.

### Düzeltildi
- Oyun içi overlay'de FPS'in görünmemesi: FPS ölçümü artık tüm oyunları otomatik tanır, yetki sorununu kendisi çözer ve "Ölçümü sına" ile neyin engellediğini gösterir.
- Oyun profilleri sayfası sadeleştirildi.

## v1.4.0 — 9 Kasım 2026

### Eklendi
- **Oyun profilleri:** Oyun açılınca otomatik algılanır; güç planı ve işlem öncelikleri oyuna göre ayarlanır, oyun kapanınca geri alınır. Dengeli ve Rekabetçi profiller, oyun başına ayar ve özel oyun ekleme.
- **Oyun içi overlay:** FPS, 1% low, kare süresi, GPU/CPU sıcaklığı ve kullanımı. Konum, boyut, saydamlık ve kısayol (Ctrl + Alt + F) ayarı.
- **FPS karşılaştırma:** "Önce" ve "Sonra" ölçümleri yan yana; sonuç paylaşım kartı olarak PNG kaydetme ve panoya kopyalama.
- Sistem tepsisinde çalışma ve Windows ile başlatma seçeneği.
- FPS ölçümünü yönetici izni sormadan çalıştırma seçeneği.

### İyileştirildi
- Oyun içi izleme, overlay ve oyun profilleri aynı FPS ölçümünü paylaşır; aynı oyun için ikinci kez izin istenmez.
- Overlay oyun sırasında hafif sensör okuması kullanır.

## v1.3.0 — 6 Kasım 2026

### Eklendi
- **Otomatik lisans etkinleştirme:** Satın aldıktan sonra Lisans sayfasında sipariş numaranızı ve e-postanızı yazmanız yeterli; lisans saniyeler içinde bu bilgisayara tanımlanır.
- Hediye ve kampanya kodlarıyla etkinleştirme.

## v1.2.0 — 6 Kasım 2026

### Eklendi
- **Lisans paketleri ve fiyatlar** programın Lisans sayfasında: 30 gün 149 TL, 3 ay 349 TL, 6 ay 599 TL, 1 yıl 999 TL. Her paketin altında **Satın al** düğmesi.
- **Güncelleme bildirimi:** Yeni sürüm yayınlandığında programın üstünde "Yeni sürüm hazır" bandı ve yenilikler listesi.
- **Duyurular:** Kampanya, çekiliş ve önemli bilgiler ana ekranda gösterilir.
- Fiyatlar, kampanyalar ve duyurular yeni sürüm yayınlamadan güncellenebilir.

## v1.1.1 — 4 Kasım 2026

### Düzeltildi
- 32 GB RAM'i olan sistemlerde (Windows 31.9 GB gösterdiği için) yanlışlıkla "32 GB'a yükseltin" önerisi çıkması düzeltildi.

## v1.1.0 — 1 Kasım 2026

### Eklendi
- **Optimizasyon skoru:** Sistem 100 üzerinden puanlanır, eksik ayarlar işaretlenir. Tarama hiçbir şeyi değiştirmez.
- **Optimizasyon profilleri:** Dengeli (12 ayar), Rekabetçi (19 ayar) ve Özel.
- **9 yeni ayar:** PCIe ve USB güç tasarrufu, teslim optimizasyonu, Windows Update yeniden başlatma, yapışkan tuşlar, Windows önerileri ve reklamları, öndeki pencereye işlemci önceliği, telemetri (DiagTrack), pencereli oyun optimizasyonu + VRR, animasyonlar.
- **Önce / sonra** skor karşılaştırması.
- **Bellek Bütünlüğü (VBS)** durumu ve aç/kapat.
- **Başlangıç uygulamaları:** Tek tıkla aç/kapat; anti-cheat ve sürücü öğeleri için uyarı.
- **Windows onarımı** sayfası: DISM + SFC, ilerleme çubuklarıyla.
- Temizlik merkezine **WinSxS bileşen deposu (DISM)** temizliği.
- **İşlem geçmişi** ve tek tuşla **Tümünü geri al** (ayarlar, başlangıç uygulamaları, VBS).

## v1.0.0 — 1 Kasım 2026

İlk sürüm.

- Sistem paneli, canlı sensörler ve sağlık puanı
- Donanım bilgileri (işlemci, ekran kartı, RAM, disk, anakart, ekran, ağ)
- Performans testleri: işlemci, ekran kartı (ZETX 3D), RAM, disk
- Arıza teşhisi: Windows hata kayıtları, SMART, sensörler
- FPS optimizasyonu (11 ayar), yedekleme ve geri alma
- 24 oyun için uygunluk ve FPS tahmini
- Oyun içi izleme (Intel PresentMon ile gerçek FPS, 1% low, sıcaklıklar)
- İnternet hız ve bufferbloat testi, DNS testi, ağ düzeltmeleri
- Temizlik ve başlangıç programları
- HTML rapor
- Abonelik lisans sistemi (30 gün, 3 ay, 6 ay, 1 yıl) ve 3 gün ücretsiz deneme
- İletişim sayfası
