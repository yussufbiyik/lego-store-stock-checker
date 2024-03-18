# Lego Store Stok Kontrolcüsü
Bu proje, belirli Lego anahtarlıklarının stok durumunu kontrol etmek için oluşturulmuştur. Proje, belirli aralıklarla Lego Store Türkiye'nin web sitesini kontrol eder ve belirli anahtarlıkların stok durumunu kontrol eder.

## Kullanılan Teknolojiler
[![Tech Stack](https://skillicons.dev/icons?i=nodejs,express,sqlite)](https://skillicons.dev)

## Nasıl Çalışır?

### Akış Diyagramı
Özetle:
```mermaid
graph TD;
    A[Başla] --> B{Çalıştırılırken Argüman Verildi Mi?}
    subgraph Komut Satırı Modu
    B --> |Verildi| C[[Argümanlardaki ürün kodlarını al]]
    C --> D[Lego Store Türkiye'yi Kontrol Et]
    D --> L[Çıktıyı konsola yazdır]
    L --> M[Bitir]
    end
    subgraph Sunucu Modu
    B --> |Verilmedi, sunucuyu başlat| E[Sunucu]
    subgraph Abone-Sunucu Etkileşimleri
    F[Abone] --> |/subscribe| E
    E --> |/subscribe| I[(Veritabanı)]
    end
    subgraph CRON Job
    E --> G[Kontrol zamanının gelmesini bekle]
    G --> J[Abonelerden izleme listesi için ürün kodlarını al]
    I --> |getSubscribers| J
    J --> N[Check Lego Store Turkey]
    N --> K[Abonelerin her birini kontrol et ve izleme listelerindeki bir ürün stoktaysa bildirim gönder]
    K --> G
    end
    end
```
### Sunucu ve Abone Etkileşimi
```mermaid
sequenceDiagram
    actor Abone
    Note over Abone,Sunucu: Kayıt Sayfası
    Abone->>+Sunucu: /
    Sunucu-->>Abone: Kayıt Sayfası
    Note over Abone,Sunucu: Abone Olma
    Abone->>+Sunucu: /subscribe
    Sunucu-->>Abone: 200, Abone Eklendi
```

## Özellikler
- [CLI ile kullanım](https://github.com/yussufbiyik/lego-store-stock-checker/blob/main/turkish-readme.md#tek-seferlik-kullan%C4%B1m-cli)
- [Sunucu olarak kullanım](https://github.com/yussufbiyik/lego-store-stock-checker/blob/main/turkish-readme.md#sunucu-olarak-kullan%C4%B1m)
    - Belirli aralıklarla stok kontrol etme
        - Stok olunca bildirim gönderme
    - Birden fazla abone desteği
        - Güvenli şifre saklama (JWT)

## Kurulum
Projenin kurulumu için aşağıdaki adımları takip edebilirsiniz:

1. Projeyi klonlayın veya indirin.
2. Terminalde proje klasörüne gidin.
3. ```npm install``` komutunu çalıştırın. projenin çalışması için gerekli olan paketler yüklenecektir.
4. Sadece sunucu modu için gerekli! Bir sonraki başlığı takip edin ve `.env` dosyasını oluşturun.

### Vapid Key Oluşturma
Terminalde
```bash
$ npm run createVAPID
```
komutunu çalıştırın ve çıktıyı kaydedin, .env dosyasında bildirim göndermek için `PUBLIC_VAPID_KEY` ve `PRIVATE_VAPID_KEY`'in değerleri buradan geliyor.

### .env Dosyası Oluşturma
```env
# WEBPUSH CONFIG
PUBLIC_VAPID_KEY="Public VAPID Key" 
PRIVATE_VAPID_KEY="Private VAPID Key"
MAIL="E-Postanız"
# JWT CONFIG
TOKEN_SECRET="JWT için paylaşılmaması gereken bir kod, kafanıza göre bir metin yazın."
# SERVER CONFIG
PORT=3000
# Sunucunun kontrol aralığı (node-cron'un istediği formatta olmalı)
CRON_INTERVAL = "0 */4 * * *"
```
Tırnak içindeki kısımları kendi bilgilerinizle doldurun, PORT'u da istediğiniz gibi değişirebilirisiniz.

## Sunucu Olarak Kullanım
Kontrol edilecek anahtarlıkların listesi argüman olarak verilir, eğer verilmezse sunucu çalışır ve izleme listesi Aboneların izleme listesi baz alınarak oluşturulur.

Kontrol sıklığı .env dosyasında CRON_INTERVAL olarak belirtilmiştir, [Buraya](https://www.npmjs.com/package/node-cron#cron-syntax) bakarak istediğiniz sıklığı ayarlayabilirsiniz.
Varsayılan 4 saatte bir kontrol etmektir. 

Sunucu 
```bash
$ npm start
``` 
komutu ile çalıştırılabilir.

### Sunucuya Kayıt Olmak
`localhost:PORT`* adresini ziyaret ederseniz ana sayfa ile karşılaşacaksınız, buradan herhangi bir isim ve şifre ile kaydolabilirsiniz, isim ve şifrenin bir önemi yok tamamken keyfi olarak ekledim.

*: PORT, .env dosyasında belirlenir, belirlenmezse varsayılan port 3000'dir

## Tek Seferlik Kullanım (CLI)
Eğer sadece belirli ürünlere bakmak istiyorsanız (her ürünü kontrol için anahtar kodu olarak 0 yazmalısınız) terminale:
```bash
$ npm start <ANAHTARLIK_KODU> <ANAHTARLIK_KODU>
```
formatında komutunuzu yazarak istediğiniz kadar anahtarlık koduna bakabilirsiniz. 

## Lisans
Bu proje ISC lisansı ile lisanslanmıştır.

## Yapılacaklar
- [X] Stok oldukça cihaza bildirim gönderme
- [X] JWT ile ~~sadece sunucuyu kuran kişinin servise erişmesini~~ çoklu Abone erişimi sağlama (aslında hiç gerek yok da, JWT kullanmak istedim.)
- [X] Dotenv ile önemli bilgilerin gizliliğini sağlama
- [ ] Firebase üzerinde çalıştırılabilecek hale getirme
- [X] readme dosyasında kullanım üzerine daha fazla detay verme

## Ekran Görüntüleri
![Her ürünü kontrol ederse.](screenshots/cli.png)
![Sunucu tarafından ekran görüntüsü.](screenshots/serverside.png)